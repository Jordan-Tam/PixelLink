import {Router} from 'express';
import {checkString, checkId} from '../helpers.js';
import users from '../data/users.js';
import { all } from 'axios';


const router = Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const allUsers = await users.getAllUsers();
            return res.render("users", {title: "User Browser", users: allUsers})
        } catch (error) {
            return res.status(error.status).render("error", {
                status: error.status,
                error_message: `${error.function}: ${error.error}`
            });
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
                const friendsList = req.session.user.friends;
                for (friendId in friendsList){
                    if (friendId === id){
                        notFriended = false;
                        break;
                    }
                }
            }
            return res.render('user-page', {
                title: `${user.username}'s Profile`,
                stylesheet: "/public/css/user-page.css",
                hidden: "hidden",
                user, 
                loggedInUser,
                notFriended
            });
        } catch (error) {
            return res.status(error.status).render("error", {
                status: error.status,
                error_message: `${error.function}: ${error.error}`
            });
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
            return res.status(error.status).render("error", {
                status: error.status,
                error_message: `${error.function}: ${error.error}`
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
                id,
                friends: friendsArr,
                username: user.username,
                title: `${user.username}'s Friends List`
            });
        } catch (error) {
            return res.status(error.status).render("error", {
                status: error.status,
                error_message: `${error.function}: ${error.error}`
            });
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
                id,
                friends: friendsArr,
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