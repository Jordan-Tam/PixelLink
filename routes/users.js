import {Router} from 'express';
import {checkString} from '../helpers.js';
import users from '../data/users.js';


const router = Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const allUsers = await users.getAllUsers();
            return res.json(allUsers);
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
            return res.render('user-page', {user, loggedInUser});
        } catch (error) {
            res.status(500).json({error});
        }
    })
    .post(async (req, res) => {
        try {
            const id = checkString(req.params.id, 'User id','POST user/:id');
            const {username, email, password} = req.body;
            const nUsername = checkString(username, 'Username', 'POST user/:id');
            const nEmail = checkString(email, 'Email', 'POST user/:id');
            const nPassword = checkString(password, 'Password', 'POST user/:id');
            const updatedUser = await users.updateUser(id, nUsername, nEmail, nPassword);
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
            return res.render('friends-list', {friends: friendsArr, username: user.username});
        } catch (error) {
            return res.status(500).json({error});
        }
    })
    .post();

export default router;