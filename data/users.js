import {ObjectId} from 'mongodb';
import {users} from '../config/mongoCollections.js'
import { checkString } from "../helpers.js";

/*
    - Profile picture check in create/updateUser is not done
    - Testing tomorrow
*/


const exportedMethods = {
    async createUser (username, email, password, retype, profile_picture, admin) {

        checkString(username, "username", "createUser");
        checkUsername(username);
    
        checkString(email, "email", "createUser");
        checkEmail(email);
        email = email.toLowerCase();
    
        passwordCheck(password);
        if (password !== retype) throw 'passwords do not match'
          
        checkString(profile_picture, "profile picture", "createUser");
        if (admin === undefined || typeof admin !== 'boolean') throw 'Invalid admin status (True or False).';
    
        let takenUsernames = await getTakenNames();
        if (takenUsernames.includes(username)) throw 'Username taken.'
        let takenEmails = await getTakenEmails();
        if (takenEmails.includes(email)) throw 'Email is already associated with an account.'
    
        let newUser = {
            username,
            email,
            password,
            profile_picture, 
            admin,
            friends: [],
            comments: [],
            games: []
        }
        const userCollection = await users();
        const insertInfo = await userCollection.insertOne(newUser);
        if (!insertInfo.acknowledged || !insertInfo.insertedId)
            throw 'Could not add user';
        const newId = insertInfo.insertedId.toString();
        newUser._id = newId;
    
        return newUser;
    },
    async updateUser (id, username, email, password, profile_picture, admin){
        checkString(username, "username", "createUser");
        checkUsername(username);
    
        checkString(email, "email", "createUser");
        checkEmail(email);
        email = email.toLowerCase();
    
        passwordCheck(password);
        if (password !== retype) throw 'passwords do not match'
          
        checkString(profile_picture, "profile picture", "createUser");
        if (admin === undefined || typeof admin !== 'boolean') throw 'Invalid admin status (True or False).';
    
        let takenUsernames = await getTakenNames();
        if (takenUsernames.includes(username)) throw 'Username taken.'
        let takenEmails = await getTakenEmails();
        if (takenEmails.includes(email)) throw 'Email is already associated with an account.'

        if (typeof id !== "string") throw 'error: provide a string for ID';
        id = id.trim();
        if (id === "") throw 'error: please provide a non-empty string for ID';
        if (!ObjectId.isValid(id)) throw 'error: invalid object ID';
        
        let user = getUserById(id);
        
        const updatedUser = {
            username, 
            email, 
            password, 
            retype, 
            profile_picture, 
            admin,
            friends: user.friends,
            comments: user.comments,
            games: user.games
        }
        const movieCollection = await users();
        const updateInfo = await movieCollection.findOneAndReplace(
        {_id: new ObjectId(movieId)},
        updatedUser,
        {returnDocument: 'after'}
    );
    if (!updateInfo)
        throw `Error: Update failed, could not find a user with id of ${id}`;
    return updatedUser;
    }, 
    async removeMovie (id) {

        if (id === undefined) throw 'you must provide an id to search for';
        if (typeof id !== 'string') throw 'id must be a string';
        if (id.trim().length === 0)
          throw 'id cannot be an empty string or just spaces';
        id = id.trim();
        if (!ObjectId.isValid(id)) throw 'invalid object ID';
        const userCollection = await users();
        const deletionInfo = await userCollection.findOneAndDelete({
          _id: new ObjectId(id)
        });
        if (!deletionInfo) {
          throw `could not delete user with id of ${id}`;
        }
        return `${deletionInfo.username} has been successfully deleted!`;
    
    },
    async getAllUsers () {
        const userCollection = await users();
        let userList = await userCollection.find({}).toArray();
        if (!userList) throw 'Could not get all users';
        userList = userList.map((element) => {
            element._id = element._id.toString();
            return element;
        });
        return userList
    },
    async getUserById (id) {
        if (id === undefined | typeof id !== string) throw 'Invalid ID';
        if (id.trim().length === 0)
          throw 'error: id cannot be an empty string or just spaces';
        id = id.trim();
        if (!ObjectId.isValid(id)) throw 'Invalid user ID';
        const userCollection = await movies();
        const user = await movieCollection.findOne({ _id: new ObjectId(id) });
        if (user === null) throw 'error: no user with that id';
        user._id = user._id.toString();
        return user;
      
    },
    async getTakenNames(){
        const userCollection = await users();
        let userList = await userCollection.find({}).toArray();
        if (!userList) throw 'Could not get all users';
        let usernames = userList.map((user) => user.username);
        return usernames
    },
    async getTakenEmails(){
        const userCollection = await users();
        let userList = await userCollection.find({}).toArray();
        if (!userList) throw 'Could not get all users';
        let emails = userList.map((user) => user.email);
        return emails;
    }
};
export default exportedMethods;