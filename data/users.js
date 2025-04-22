import {ObjectId} from 'mongodb';
import {users} from '../config/mongoCollections.js'
import {checkUsername, checkEmail, passwordCheck, checkImage} from "../helpers.js";

const exportedMethods = {

    /**
     * 
     * @param {*} username 
     * @param {*} email 
     * @param {*} password 
     * @param {*} profile_picture 
     * @param {*} admin 
     * @returns 
     */
    async createUser (username, email, password, profile_picture, admin) {

        username = checkUsername(username, "createUser");

        email = checkEmail(email, "createUser");

        password = passwordCheck(password);
          
        profile_picture = checkImage(profile_picture, "createUser");
        if (typeof admin !== 'boolean') throw 'createUser Error: Invalid admin status (True or False).';
    
        let takenUsernames = await this.getTakenNames();
        if (takenUsernames.includes(username.toLowerCase())) throw "createUser Error: Username taken.";
        let takenEmails = await this.getTakenEmails();
        if (takenEmails.includes(email.toLowerCase())) throw "createUser Error: Email is already associated with an account.";
        
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
            throw "createUser Error: Could not add user";
        const newId = insertInfo.insertedId.toString();
        newUser._id = newId;
    
        return newUser;
    },


    /**
     * 
     * @param {*} id 
     * @param {*} username 
     * @param {*} email 
     * @param {*} password 
     * @param {*} profile_picture 
     * @param {*} admin 
     * @returns 
     */
    async updateUser (id, username, email, password, profile_picture, admin){
        username = checkUsername(username, "updateUser")
    
        email = checkEmail(email, "updateUser");
    
        password = passwordCheck(password);
          
        profile_picture = checkImage(profile_picture, "updateUser");

        if (typeof admin !== 'boolean') throw 'Invalid admin status (True or False).';
    
        let user = await this.getUserById(id);

        if(username !== user.username){
        let takenUsernames = await this.getTakenNames();
        if (takenUsernames.includes(username.toLowerCase()))
          throw "Username taken.";
        }
        if(email !== user.email){
            let takenEmails = await this.getTakenEmails();
            if (takenEmails.includes(email.toLowerCase()))
                throw "Email is already associated with an account.";
        }

        if (typeof id !== "string") throw 'error: provide a string for ID';
        id = id.trim();
        if (id === "") throw 'error: please provide a non-empty string for ID';
        if (!ObjectId.isValid(id)) throw 'error: invalid object ID';
        
        
        const updatedUser = {
            username, 
            email, 
            password, 
            profile_picture, 
            admin,
            friends: user.friends,
            comments: user.comments,
            games: user.games
        }
        const userCollection = await users();
        const updateInfo = await userCollection.findOneAndReplace(
        {_id: new ObjectId(id)},
        updatedUser,
        {returnDocument: 'after'}
    );
    if (!updateInfo)
        throw `Error: Update failed, could not find a user with id of ${id}`;
    return updatedUser;
    }, 
    

    /**
     * 
     * @param {*} id 
     * @returns 
     */
    async removeUser (id) {

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


    /**
     * 
     * @returns 
     */
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


    /**
     * 
     * @param {*} id 
     * @returns 
     */
    async getUserById (id) {
        if (id === undefined | typeof id !== "string") throw 'Invalid ID';
        if (id.trim().length === 0)
          throw 'error: id cannot be an empty string or just spaces';
        id = id.trim();
        if (!ObjectId.isValid(id)) throw 'Invalid user ID';
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: new ObjectId(id) });
        if (user === null) throw 'error: no user with that id';
        user._id = user._id.toString();
        return user;
      
    },


    /**
     * 
     * @returns 
     */
    async getTakenNames(){
        const userCollection = await users();
        let userList = await userCollection.find({}).toArray();
        if (!userList) throw 'Could not get all users';
        let usernames = userList.map((user) => user.username.toLowerCase());
        return usernames
    },

    
    /**
     * 
     * @returns 
     */
    async getTakenEmails(){
        const userCollection = await users();
        let userList = await userCollection.find({}).toArray();
        if (!userList) throw 'Could not get all users';
        let emails = userList.map((user) => user.email.toLowerCase());
        return emails;
    }
};

export default exportedMethods;