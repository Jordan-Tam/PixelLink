import {Router} from 'express';
import {checkString, checkId, checkUsername, checkPassword, checkUserGameInfo} from '../helpers.js';
import users from '../data/users.js';
import games from "../data/games.js";
import comments from '../data/comments.js';
import { all } from 'axios';


const router = Router();

router.route('/')
    .get(async (req, res) => {
        try {
            let allUsers = await users.getAllUsers(true);
            const allGames = await games.getAllGames(true);
            let allOtherUsers = allUsers.filter((elem) => elem.username !== req.session.user.username);    // Remove yourself
            let myself = allUsers.filter((elem) => elem.username === req.session.user.username)[0]; // Find yourself
            let userFollowPairs = []
            for(let u of allOtherUsers){
                if(myself.friends.includes(u._id.toString())){  // Check if we are following each user
                    userFollowPairs.push({user: u, following: true})
                }
                else{
                    userFollowPairs.push({ user: u, following: false });
                }
            }
            
            return res.render("user-list", {
                title: "User Browser",
                stylesheet: "/public/css/user-list.css",
                users: userFollowPairs,
                games: allGames,
                script: "/public/js/user-list.js"
            })
        } catch (error) {
            res.status(500).json({error});
        }
    })
    .post(async (req, res) => {
        try{
            let body = req.body;
            let userId = req.session.user._id;
            if(Object.keys(body).length === 1){   // This means we only have gameId and are searching just for the game
                let id = body.gameId
                id = checkString(id, "User POST AJAX");
                let r = await users.filterUsersByGame(userId, id)
                return res.json(r);
            }
            let {field_name, value, type, gameId, operator} = body;
            field_name = checkString(field_name, "User POST AJAX");
            value = checkString(value, "User POST AJAX");
            type = checkString(type, "User POST AJAX");
            gameId = checkString(gameId, "User POST AJAX");
            if(operator !== "Greater Than"  && operator !== "Less Than" && operator !== "Equal To" && operator !== ""){
                return res.json("Invalid operator value");
            }
            let result = [];
            if(type === "text"){
                result = await users.filterUsersByText(
                  userId,
                  gameId,
                  field_name,
                  value
                );
            }
            else if(type === "number"){
                result = await users.filterUsersByNumber(
                  userId,
                  gameId,
                  field_name,
                  parseInt(value),
                  operator
                );
            }
            else if(type === "select"){
                result = await users.filterUsersBySelect(
                  userId,
                  gameId,
                  field_name,
                  value
                );
            }
            return res.json(result);
        }catch(e){
            return res.json(e.error);
        }
    });

router.route('/:id')
    .get(async (req, res) => {

        // Validate the "id" path variable.
        try {
            req.params.id = checkId(req.params.id, "GET /users/:id", "User");
        } catch (e) {
            return res.status(e.status).render("error", {
                status: e.status,
                error_message: e.error,
                stylesheet: "/public/css/error.css"
            });
        }

        // Get the user associated with req.params.id.
        let user = undefined;
        try {
            user = await users.getUserById(req.params.id);
        } catch (e) {
            return res.status(e.status).render("error", {
                status: e.status,
                error_message: e.error,
                stylesheet: "/public/css/error.css"
            });
        }

        // Add a property to all of this user's comments indicating whether that comment was made by the currently signed-in user.
        for (let comment of user.comments) {
            if (comment.userId === req.session.user._id.toString()) {
                comment.is_own_comment = true;
            }
        }

        // Check if this is the user's own profile.
        let is_own_profile = false;
        if (req.session.user._id === req.params.id) {
            is_own_profile = true;
        }
        // Check if the user is already following this profile.
        let notFriended = true;
        if (!is_own_profile) {
            const yourself = await users.getUserById(req.session.user._id);
            for (let i = 0; i < yourself.friends.length; i++) { 
                if (yourself.friends[i] === req.params.id){
                    notFriended = false;
                    break;
                }
            }
        }

        // Render the user profile.
        return res.render('user-page', {
            user,
            title: `${user.username}'s Profile`,
            stylesheet: "/public/css/user-page.css",
            script: "/public/js/user-page.js",
            changeUsernameError_hidden: "hidden",
            changePasswordError_hidden: "hidden",
            commentError_hidden: "hidden",
            is_own_profile,
            notFriended
        });
        
    })

    .post(async (req, res) => {

        // Validate the "id" path variable.
        try {

            req.params.id = checkId(req.params.id, "POST /:id", "User");
        
        } catch (e) {

            return res.status(e.status).render('error', {
                status: e.status,
                error_message: e.error,
                stylesheet: "/public/css/error.css"
            });
        }

        // Add the comment.
        try {

            await comments.createComment("user", req.params.id, req.session.user._id, req.body.comment);
        
        } catch (e) {
            
            return res.status(e.status).render('user-page', {
                user: req.session.user, 
                title: `${req.session.user.username}'s Profile`,
                stylesheet: "/public/css/user-page.css",
                script: "/public/js/user-page.js",
                changeUsernameError_hidden: "hidden",
                changePasswordError_hidden: "hidden",
                commentError_message: e.error,
                is_own_profile: true,
                notFriended: true,
            });
        
        }

        // Redirect to "GET /:id" to re-render the page.
        return res.redirect(`/users/${req.params.id}`);
        
    })

    .patch(async (req, res) => {

        // Get User document for the signed-in user.
        // This is necessary because req.session.user only stores the user's _id.
        // In order to get everything else related to the user we need to retrieve it from the database first.
        let user = await users.getUserById(req.session.user._id);

        // Validate the "id" path variable.
        try {
            req.params.id = checkId(req.params.id, "PATCH /:id/username", "User");
        } catch (e) {
            return res.status(e.status).render('error', {
                status: e.status,
                error_message: e.error,
                stylesheet: "/public/css/error.css"
            });
        }

        // Make sure the user is updating their own account.
        if (req.session.user._id !== req.params.id) {
            return res.status(403).render('error', {
                status: 403,
                error_message: "Forbidden",
                stylesheet: "/public/css/error.css"
            });
        }

        // If a username is in the req.body, this is the change username form.
        if (req.body.username !== undefined) {

            console.log("username");

            // Input validation for username.
            let username = req.body.username;
            try {
                username = checkUsername(username, "PATCH /:id/username");
            } catch (e) {
                console.log(req.session.user);
                return res.status(e.status).render('user-page', {
                    user, 
                    title: `${req.session.user.username}'s Profile`,
                    stylesheet: "/public/css/user-page.css",
                    script: "/public/js/user-page.js",
                    changeUsernameError_message: e.error,
                    changePasswordError_hidden: "hidden",
                    commentError_hidden: "hidden",
                    is_own_profile: true,
                    notFriended: true,
                });
            }

            console.log("username2");

            // Update username.
            try {
                await users.updateUsername(req.session.user._id, username);
                console.log("username3");
                req.session.user.username = username;
                console.log("username4");
            } catch (e) {
                console.log(e);
                return res.status(e.status ? e.status : 500).render('user-page', {
                    user,
                    title: `${req.session.user.username}'s Profile`,
                    stylesheet: "/public/css/user-page.css",
                    script: "/public/js/user-page.js",
                    changeUsernameError_message: e.error,
                    changePasswordError_hidden: "hidden",
                    commentError_hidden: "hidden",
                    is_own_profile: true,
                    notFriended: true,
                });
            }

            console.log("username5");
        
        }
        
        // If a password is in the req.body, this is the change password form.
        else if (req.body.password !== undefined) {

            console.log("password");

            // Input validation for password.
            // Ignore confirmPassword.
            let password = req.body.password;
            try {
                password = checkPassword(password, "PATCH /:id/password");
            } catch (e) {
                return res.status(e.status).render('user-page', {
                    user,
                    title: `${req.session.user.username}'s Profile`,
                    stylesheet: "/public/css/user-page.css",
                    script: "/public/js/user-page.js",
                    changeUsernameError_hidden: "hidden",
                    changePasswordError_message: e.error,
                    commentError_hidden: "hidden",
                    is_own_profile: true,
                    notFriended: true,
                });
            }

            // Update password.
            try {
                await users.updatePassword(req.session.user._id, password);
            } catch (e) {
                return res.status(e.status).render('user-page', {
                    user,
                    title: `${req.session.user.username}'s Profile`,
                    stylesheet: "/public/css/user-page.css",
                    script: "/public/js/user-page.js",
                    changeUsernameError_hidden: "hidden",
                    changePasswordError_message: e.error,
                    commentError_hidden: "hidden",
                    is_own_profile: true,
                    notFriended: true,
                });
            }

        }

        res.redirect(`/users/${req.session.user._id}`);        
        
    })


router.route('/:id/friends')
    .get(async (req, res) => {
        try {
            const id = checkString(req.params.id, 'User id','GET user/:id/friends');
            const user = await users.getUserById(id);
            let friends = user.friends; //list of user's friends' ids
            let friendsArr = [];
            for(let id of friends){
                const friend = await users.getUserById(id);
                friendsArr.push(friend); //array of users(friends)
            }
            return res.render('friends-list', {
                title: `${user.username}'s Friends List`,
                stylesheet: "/public/css/friends-list.css",
                id: user._id,
                friends: friendsArr,
                username: user.username,
            });
        } catch (e) {
            return res.status(e.status).render("error", {
                status: e.status,
                error_message: `${e.function}: ${e.error}`
            });
        }
    })
    .post(async (req, res) => {
        try {
            const id = checkId(req.params.id, "POST user/:id/friends", "User");
            if(!req.session.user || req.session.user._id === id){ //checks if user is trying to friend themselves (should never happen)
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
            return res.redirect(`/users/${id}`);
        } catch (e) {
            return res.status(400).render("error", {
                status: e.status,
                error_message: `${e.function}: ${e.error}`
            });
        }
    })

    .delete(async (req, res) => {
        try {

            //Input validation
            const id = checkString(req.params.id, 'User id','GET user/:id/friends');

            //Check if the user is removing themself as a friend - throws error if so
            if(!req.session.user || req.session.user._id === id){ 
                //render the 403 error
                return res.status(403).render("error", {
                    status: 403,
                    error_message: "Permission Denied"
                });
            }

            //remove friend from users friends list
            await users.removeFriend(req.session.user._id, id);

            //get user information after removing friend
            const user = await users.getUserById(req.session.user._id);

            //Render the users friends list after removing the friend
            return res.redirect("/users/" + id);


        } catch (error) {
            return res.status(error.status).render("error", {
                status: error.status,
                error_message: `${error.function}: ${error.error}`
            });
        }
    });

router.route('/:id/followers')
    .get(async (req, res) => {

        try {

            // Validate the "id" path variable.
            req.params.id = checkId(req.params.id, "PATCH /:id/username", "User");
        
        } catch (e) {

            return res.status(e.status).render('error', {
                status: e.status,
                error_message: e.error
            });
        
        }

        try {

            const user = await users.getUserById(req.params.id);

            let followers = user.followers;
            
            let followersArray = [];

            for (let follower_id of followers) {
                const follower = await users.getUserById(follower_id);
                followersArray.push(follower);
            }

            return res.render("followers-list", {
                title: `${user.username}'s Followers`,
                stylesheet: "/public/css/followers-list.css",
                user,
                followers: followersArray
            });

        } catch (e) {

            return res.status(e.status).render("error", {
                status: e.status,
                error_message: e.error
            });

        }

    });

router.route('/:id/comment/:commentId')
    .delete(async (req, res) => {

        try {

            req.params.id = checkId(req.params.id, "DELETE /:id/comment/:commentId", "User");
            req.params.commentId = checkId(req.params.commentId, "DELETE /:id/comment/:commentId", "Comment");

        } catch (e) {
            return res.status(500).json({error: e.error});
        }

        try {
            const result = await comments.removeComment(req.params.commentId, 'user')

            if (result !== true) {
                return res.status(500).render("error", {
                    status: 500,
                    error_message: "Internal Server Error",
                    title: `500 Error`,
                    stylesheet: "/public/css/error.css"
                });
            }

            //dummy

            const user = await users.getUserById(req.session.user._id)
            return res.redirect(`/users/${req.params.id}`);

        } catch (error) {
            return res.status(error.status).render("error", {
                status: error.status,
                error_message: `${error.function}: ${error.error}`,
                title: `${error.status} Error`,
                stylesheet: "/public/css/error.css"
              });
        }
        
    })

    // .patch(async (req, res) => {

    //     try {

    //         req.params.id = checkId(req.params.id, "PATCH /:id/comment/:commentId", "User");
    //         req.params.commentId = checkId(req.params.commentId, "PATCH /:id/comment/:commentId", "Comment");
    //         checkString(req.body.comment);

    //     } catch (e) {
    //         return res.status(500).json({error: e.error});
    //     }

    //     try {

    //         const result = await comments.updateComment(req.params.commentId, "user", req.body.comment)

    //         if (result !== true) {
    //             return res.status(500).render("error", {
    //                 status: 500,
    //                 error_message: "Internal Server Error",
    //                 title: `500 Error`,
    //                 stylesheet: "/public/css/error.css"
    //             });
    //         }

    //         const user = await users.getUserById(req.session.user._id)
    //         return res.render('user-page', {
    //             user,
    //             title: `${user.username}'s Profile`,
    //             stylesheet: "/public/css/user-page.css",
    //             script: "/public/js/user-page.js",
    //             changeUsernameError_hidden: "hidden",
    //             changePasswordError_hidden: "hidden",
    //             commentError_hidden: "hidden",
    //             is_own_profile:true,
    //             notFriended: true
    //         });
    //     } catch (error) {
    //         return res.status(error.status).render("error", {
    //             status: error.status,
    //             error_message: `${error.function}: ${error.error}`,
    //             title: `${error.status} Error`,
    //             stylesheet: "/public/css/error.css"
    //           });
    //     }


    // });
    
        

export default router;