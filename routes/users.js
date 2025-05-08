import {Router} from 'express';
import {checkString, checkId} from '../helpers.js';
import users from '../data/users.js';
import games from "../data/games.js";
import comments from '../data/comments.js';
import { all } from 'axios';


const router = Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const allUsers = await users.getAllUsers(true);
            const allGames = await games.getAllGames(true);
            return res.render("user-list", {
                title: "User Browser",
                stylesheet: "/public/css/user-list.css",
                users: allUsers,
                games: allGames,
                script: "/public/js/user-list.js"
            })
        } catch (error) {
            res.status(500).json({error});
        }
    })
    .post();

router.route('/:id')
    .get(async (req, res) => {
        try {
            const id = checkString(req.params.id, 'User id','GET user/:id');
            const user = await users.getUserById(id);
            let loggedInUser = false;
            if(req.session.user && req.session.user._id == id){//checks if user is visiting their own profile page
                loggedInUser = true;
            }

            //check to see if the user is friends with the profile they are checking
            let notFriended = true;
            if (!loggedInUser){
                const sessionUser = await users.getUserById(req.session.user._id)
                const friendsList = sessionUser.friends;
                for (let i = 0; i < friendsList.length; i++){
                    if (friendsList[i] === id){
                        notFriended = false;
                        break;
                    }
                }
            }
            return res.render('user-page', {
                user, 
                stylesheet: "/public/css/user-page.css",
                script: "/public/js/user-page.js",
                hidden: "hidden",
                loggedInUser,
                title: `${user.username}'s Profile`,
                notFriended
            });
        } catch (error) {
            res.status(404).redirect("/error");
        }
    })
    .patch(async (req, res) => {
        try {
            const id = checkString(req.params.id, 'User id','PATCH user/:id');
            let {username, password} = req.body;
            const nUsername = checkString(username, 'Username', 'PATCH user/:id');
            const nPassword = checkString(password, 'Password', 'PATCH user/:id');
            let loggedInUser = false;
            //check if user is logged in
            if(req.session.id){
                loggedInUser = true;
            }
            //check if user is updating their own profile
            if(req.session.user._id !== id){
                return res.status(403).render('error', {
                    status: 403,
                    error_message: "Permission Denied"
                });
            }
            
            let notFriended = true; //user isn't friends with themself
            const updatedUser = await users.updateUser(id, nUsername, nPassword);
            req.session.user.username = updatedUser.username; //update the session username

            return res.render('user-page', {
                user: req.session.user, 
                stylesheet: "/public/css/user-page.css",
                hidden: "hidden",
                loggedInUser,
                title: `${req.session.user.username}'s Profile`,
                notFriended
            });
        } catch (error) {
            if(error.function === "updateUser"){
                //const user = await users.getUserById(req.params.id);
                return res.render('user-page', {
                    user: req.session.user, 
                    stylesheet: "/public/css/user-page.css",
                    hidden: "hidden",
                    loggedInUser,
                    title: `${req.session.user.username}'s Profile`,
                    notFriended,
                    error_message: error.error
                });
            }
            return res.status(500).render('error', {
                status: 500,
                error_message: "Unknown error in PATCH user/:id"
            });
        }
    })

router.route('/:id/friends')
    .get(async (req, res) => {
        try{
            const id = checkString(req.params.id, 'User id','GET user/:id/friends');
            const user = await users.getUserById(id);
            let friends = user.friends; //list of user's friends' ids
            let friendsArr = [];
            for(let id of friends){
                const friend = await users.getUserById(id);
                friendsArr.push(friend); //array of users(friends)
            }
            return res.render('friends-list', {
                id: user._id,
                friends: friendsArr,
                username: user.username,
                title: `${user.username}'s Friends List`
            });
        } catch (error) {
            return res.status(500).json({error});
        }
    })
    .post(async (req, res) => {
        try {
            const id = checkId(req.params.id, "POST user/:id/friends", "User");
            if(!req.session.user || req.session.user._id === id){ //checks if user is visiting their own profile page
                //render the 403 error
                return res.status(403).json({error: "Permission Denied"});
            }
            
            await users.addFriend(req.session.user._id, id); //add friend
            

            const user = await users.getUserById(req.session.user._id); //get user
            
            let friends = user.friends; //list of user's friends' ids
            let friendsArr = [];
            for(let id of friends){
                const friend = await users.getUserById(id);
                friendsArr.push(friend); //array of users(friends)
            }
            //Changed this to take you to your friends list since it only adds the friend on your side.
            return res.render('friends-list', {
                id: user._id,
                friends: friendsArr,
                username: user.username,
                title: `${user.username}'s Friends List`
            });
        } catch (e) {
            return res.status(500).json({error: e.error});
        }
    })

    .delete(async (req, res) => {
        try {

            //Input validation
            const id = checkString(req.params.id, 'User id','GET user/:id/friends');

            //Check if the user is removing themself as a friend - throws error if so
            if(!req.session.user || req.session.user._id === id){ 
                //render the 403 error
                return res.status(403).json({error: "Permission Denied"});
            }

            //remove friend from users friends list
            await users.removeFriend(req.session.user._id, id);

            //get user information after removing friend
            const user = await users.getUserById(req.session.user._id);

            //Render the users friends list after removing the friend
            //Wanted to render the removed friends page with the button changed but its causing errors...
            return res.render('friends-list', {
                id: user._id, 
                friends: user.friends,
                username: user.username,
                title: `${user.username}'s Friends List`
            });


        } catch (error) {
            return res.status(error.status).render("error", {
                status: error.status,
                error_message: `${error.function}: ${error.error}`
            });
        }
    });

router.route('/:id/comment')
    .post(async (req, res) => {

        try {
            req.params.id = checkId(req.params.id, "POST /:id/comment", "User");
        } catch (e) {

            // How do we re-render the user page if the ID is bad?
            // Theoretically, the ID should always be good if this comment was submitted from the website...?
            // You can't, just make sure the code above never errors.
            return res.status(500).json({error: e.error});
        }

        try {
            await comments.createComment("user", req.params.id, req.session.user._id, req.body.comment);
        } catch (e) {
            return res.status(e.status).json({error: e.error});
        }

        return res.redirect(`/users/${req.params.id}`);
        
    })

    //Commented this out to run the app
    // router.route('/:userId/game/:gameId')
    //     .update(async (req, res) => {
            
    //     })
    //     .delete(async (req, res) => {
            
    // });

export default router;