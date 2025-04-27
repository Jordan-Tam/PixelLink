import {ObjectId} from 'mongodb';

import bcrypt from 'bcryptjs';
const saltRounds = 10;

import {users} from '../config/mongoCollections.js'
import {
    checkUsername,
    checkEmail,
    checkPassword,
    checkAdmin,
    checkId
} from "../helpers.js";


const exportedMethods = {

    /**
     * Adds a User document to the Users collection.
     * @param {string} username The username of the new account. It must be between 8-30 characters long; must contain only letters, numbers, underscores, periods, and hyphens; and cannot start or end with a period.
     * @param {string} email 
     * @param {string} password The plain text password of the new account. It must be at least 8 characters long; contain at least 1 uppercase letter, 1 lowercase number, 1 number, and 1 special character.
     * @param {boolean} admin 
     * @returns {object} The newly created User document (with the _id property converted to a string).
     */
    async createUser (username, email, password, admin) {

        // Input validation.
        username = checkUsername(username, "createUser");
        email = checkEmail(email, "createUser");
        password = checkPassword(password);
        admin = checkAdmin(admin);
    
        // Check if username is already taken.
        let takenUsernames = await this.getTakenNames();
        if (takenUsernames.includes(username.toLowerCase())) throw "createUser Error: Username taken.";
        let takenEmails = await this.getTakenEmails();
        if (takenEmails.includes(email.toLowerCase())) throw "createUser Error: Email is already associated with an account.";

        // Hash the password.
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Create the new user object.
        let newUser = {
            username,
            email,
            password: hashedPassword,
            admin,
            friends: [],
            games: [],
            comments: []
        }

        // Get the users collection.
        const userCollection = await users();

        // Insert the new user to the users database.
        const insertInfo = await userCollection.insertOne(newUser);
        
        if (!insertInfo.acknowledged || !insertInfo.insertedId)
            throw "createUser Error: Could not add user.";
        
        // Get the new user's ID and convert it to a string. 
        const newId = insertInfo.insertedId.toString();
        
        newUser._id = newId;
    
        return newUser;

    },


    /**
     * Updates the username, email, and password of the User document associated with the given ID.
     * @param {string} id 
     * @param {string} username 
     * @param {string} email 
     * @param {string} password 
     * @returns {object} The updated User document (with the _id property converted to a string).
     */
    async updateUser (id, username, email, password) {

        // Input validation.
        id = checkId(id, "updateUser", "User");
        username = checkUsername(username, "updateUser")
        email = checkEmail(email, "updateUser");
        password = checkPassword(password);
        admin = checkAdmin(admin);
    
        // Get the user associated with the given ID.
        // This function will throw an error if no user is found.
        let user = await this.getUserById(id);

        // If the username changed, make sure it is not taken.
        if(username !== user.username) {
            let takenUsernames = await this.getTakenNames();
            if (takenUsernames.includes(username.toLowerCase())) {
                throw "Username taken.";
            }
        }

        // If the email changed, make sure it is not taken.
        if(email !== user.email) {
            let takenEmails = await this.getTakenEmails();
            if (takenEmails.includes(email.toLowerCase())) {
                throw "Email is already associated with an account.";
            }
        }
        
        const updatedUser = {
            username, 
            email, 
            password
        };

        const userCollection = await users();
        const updateInfo = await userCollection.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: updatedUser},
            {returnDocument: 'after'}
        );

        if (!updateInfo)
            throw `updateUser Error: Update failed, could not find a user with id of ${id}.`;

        updatedUser._id = updatedUser._id.toString();
        
        return updatedUser;
    }, 
    

    /**
     * Deletes the User document associated with the given ID from the Users collection.
     * @param {string} id 
     * @returns {boolean} true
     */
    async removeUser (id) {

        // Input validation.
        id = checkId(id, "removeUser", "User")

        // Get Users collection.
        const userCollection = await users();

        // Delete user from the database.
        const deletionInfo = await userCollection.findOneAndDelete({
          _id: new ObjectId(id)
        });

        if (!deletionInfo) {
          throw `removeUser Error: Could not delete user with id of ${id}.`;
        }

        return true;
    
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
        id = checkString(id, "id", "getUserById");

        if (!ObjectId.isValid(id)) throw 'Invalid user ID';
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: new ObjectId(id) });
        if (user === null) throw 'error: no user with that id';
        user._id = user._id.toString();
        return user;
      
    },


    /**
     * 
     * @returns A list of all usernames in the Users collection.
     */
    async getTakenNames() {
        const userCollection = await users();
        let userList = await userCollection.find({}).toArray();
        if (!userList) throw 'Could not get all users';
        let usernames = userList.map((user) => user.username.toLowerCase());
        return usernames
    },

    
    /**
     * 
     * @returns A list of all emails in the Users collection.
     */
    async getTakenEmails() {
        const userCollection = await users();
        let userList = await userCollection.find({}).toArray();
        if (!userList) throw 'Could not get all users';
        let emails = userList.map((user) => user.email.toLowerCase());
        return emails;
    },
    

    /**
     * 
     * @param {*} id 
     * @param {*} friendId 
     */
    async addFriend(id, friendId) {

        // Input validation.
        id = checkId(id, "addFriend", "User");
        friendId = checkId(id, "addFriend", "User");

        // Get the user associated with "id".
        // This function will throw an error if no user is found.
        const user = await this.getUserById(id);

        // Check if there is a user associated with "friendId".
        // This function will throw an error if no user is found.
        await this.getUserById(friendId);

        // Create updated friends list.
        const updatedUser = {
            friends: user.friends.push(friendId)
        };
        
        // Get the Users collection.
        const userCollection = await users();

        // Update the user's friends list.
        const updateInfo = await userCollection.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: updatedUser},
            {returnDocument: 'after'}
        );

        if (!updateInfo) {
            throw "addFriend Error: Could not update users' friends list.";
        }

        updateInfo._id = updateInfo._id.toString();
        
        return updateInfo;

    },


    /**
     * 
     * @param {*} id 
     * @param {*} friendId 
     */
    async removeFriend(id, friendId) {

        // Input validation.
        id = checkId(id, "removeFriend", "User");
        friendId = checkId(id, "removeFriend", "User");

        // Get the user associated with "id".
        // This function will throw an error if no user is found.
        const user = await this.getUserById(id);

        // Check if there is a user associated with "friendId".
        // This function will throw an error if no user is found.
        await this.getUserById(friendId);

        // Create updated friends list.
        const updatedUser = {
            friends: user.friends.filter((id) => id !== friendId)
        };
        
        // Get the Users collection.
        const userCollection = await users();

        // Update the user's friends list.
        const updateInfo = await userCollection.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: updatedUser},
            {returnDocument: 'after'}
        );

        if (!updateInfo) {
            throw "removeFriend Error: Could not update users' friends list.";
        }
        
        updateInfo._id = updateInfo._id.toString();
        
        return updateInfo;

    },


    async addGame() {

    },

    async removeGame() {

    }

};

export default exportedMethods;