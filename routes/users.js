import {Router} from 'express';
import {checkString, checkId} from '../helpers.js';
import users from '../data/users.js';
import { all } from 'axios';


const router = Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const allUsers = await users.getAllUsers();
            return res.render("user-list", {title: "User Browser", users: allUsers})
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
                hidden: "hidden",
                loggedInUser,
                title: `${user.username}'s Profile`,
                notFriended
            });
        } catch (error) {
            res.status(404).redirect("/error");
        }
    })
    .post(async (req, res) => {
        try {
            const id = checkString(req.params.id, 'User id','POST user/:id');
            let {username, password} = req.body;
            const nUsername = checkString(username, 'Username', 'POST user/:id');
            const nPassword = checkString(password, 'Password', 'POST user/:id');
            const updatedUser = await users.updateUser(id, nUsername, nPassword);
            return res.json(updatedUser);
        } catch (error) {
            res.status(400).json({error});
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
        } catch (error) {
            return res.status(500).json({error});
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

export default router;