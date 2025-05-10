import {ObjectId} from 'mongodb';

import bcrypt from 'bcryptjs';
const saltRounds = 10;

import {users, games} from '../config/mongoCollections.js'

import gamesDataFunctions from './games.js';

import {
    checkUsername,
    checkPassword,
    checkAdmin,
    checkId,
    checkUserGameInfo
} from "../helpers.js";


const exportedMethods = {

    /**
     * Adds a User document to the Users collection.
     * Analogous to a "register" function.
     * @param {string} username The username of the new account. It must be between 8-30 characters long; must contain only letters, numbers, underscores, periods, and hyphens; and cannot start or end with a period.
     * @param {string} password The plain text password of the new account. It must be at least 8 characters long; contain at least 1 uppercase letter, 1 lowercase number, 1 number, and 1 special character.
     * @param {boolean} admin A boolean determining whether the user will have administrative privileges, which would allow them to add, update, and remove games from the pre-determined list of games.
     * @returns {object} The newly created User document (with the _id property converted to a string).
     */
    async createUser (username, password, admin) {

        // Input validation.
        username = checkUsername(username, "createUser");
        password = checkPassword(password, "createUser");
        admin = checkAdmin(admin, "createUser");
    
        // Check if username is already taken.
        let takenUsernames = await this.getTakenUsernames();
        if (takenUsernames.includes(username.toLowerCase())) {
            throw {
                status: 400,
                function: "createUser",
                error: "Username already taken."
            };
        }

        // Hash the password.
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Create the new user object.
        let newUser = {
            username,
            password: hashedPassword,
            admin,
            friends: [], // This should be renamed to "following", but is kept as "friends" to avoid breaking existing code.
            followers: [],
            games: [],
            comments: []
        }

        // Get the users collection.
        const userCollection = await users();

        // Insert the new user to the users database.
        const insertInfo = await userCollection.insertOne(newUser);
        
        if (!insertInfo.acknowledged || !insertInfo.insertedId) {
            throw {
                status: 500,
                function: "createUser",
                error: "Could not add user."
            };
        }
        
        // Get the new user's ID and convert it to a string. 
        const newId = insertInfo.insertedId.toString();
        
        newUser._id = newId;
    
        return newUser;

    },


    /**
     * 
     * @param {*} username 
     * @param {*} password 
     * @returns {object} 
     */
    async login (username, password) {

        // Input validation.
        username = checkUsername(username, "login");
        password = checkPassword(password, "login");

        // Get users collection.
        const usersCollection = await users();

        // Get user associated with the username.
        let userList = await this.getAllUsers();

        let user;
        for (let u of userList) {
            if (u.username.toLowerCase() === username.toLowerCase()) {
                user = u;
                break;
            }
        }

        if (!user) {
            throw {
                status: 400,
                function: "login",
                error: "Either the username or password is wrong."
            };
        }

        let compare = await bcrypt.compare(password, user.password);

        if (!compare) {
            throw {
                status: 400,
                function: "login",
                error: "Either the username or password is wrong."
            };
        }

        return {
            username: user.username,
            _id: user._id.toString(),
            admin: user.admin
            // All other user info to add to the cookie.
        };

    },


    /**
     * 
     * @param {*} id 
     * @param {*} username 
     * @returns 
     */
    async updateUsername(id, username) {

        // Input validation.
        id = checkId(id, "updateUsername", "User");
        username = checkUsername(username, "updateUsername");

        // Check if the user ID exists.
        // This function will throw an error if no user is found.
        await this.getUserById(id);

        // Make sure the new username is not taken.
        let takenUsernames = await this.getTakenUsernames();
        if (takenUsernames.includes(username.toLowerCase())) {
            throw {
                status: 400,
                function: "updateUsername",
                error: "Username already taken."
            };
        }

        const updatedUser = {
            username
        };

        const usersCollection = await users();
        const updateInfo = await usersCollection.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: updatedUser},
            {returnDocument: 'after'}
        );

        if (!updateInfo) {
            throw {
                status: 500,
                function: "updateUsername",
                error: `Could not update user with ID of ${id}.`
            };
        }

        // Update all the comments.
        let usersList = await this.getAllUsers();

        for (let user of usersList) {
            for (let i = 0; i < user.comments.length; i++) {
                if (user.comments[i].userId === id) {
                    user.comments[i].username = username;
                }
            }

            const updateCommentsInfo = await usersCollection.findOneAndUpdate(
                {_id: new ObjectId(user._id)},
                {$set: {comments: user.comments}},
                {returnDocument: 'after'}
            )

            if (!updateCommentsInfo) {
                throw {
                    status: 500,
                    function: "updateUsername",
                    error: "Could not update username of user's previous comments."
                };
            }
        }

        // TODO: let gamesList = await gamesDataFunctions.getAllGames();
        // TODO: change reviews AND comments


        updateInfo._id = updateInfo._id.toString();
        
        return updateInfo;

    },

    async updatePassword(id, password) {

        // Input validation.
        id = checkId(id, "updatePassword", "User");
        password = checkPassword(password, "updatePassword");

        // Check if the user ID exists.
        // This function will throw an error if no user is found.
        await this.getUserById(id);

        const updatedUser = {
            password
        };

        const userCollection = await users();
        const updateInfo = await userCollection.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: updatedUser},
            {returnDocument: 'after'}
        );

        if (!updateInfo) {
            throw {
                status: 500,
                function: "updatePassword",
                error: `Could not update user with ID of ${id}.`
            };
        }

        updateInfo._id = updateInfo._id.toString();
        
        return updateInfo;

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
            throw {
                status: 500,
                function: "removeUser",
                error: `Could not delete user with ID of ${id}`
            };
        }

        return true;
    
    },


    /**
     * 
     * @param {*} sortAlphabetically 
     * @returns 
     */
    async getAllUsers (sortAlphabetically = false) {

        const userCollection = await users();
        
        let userList = await userCollection.find({}).toArray();
        
        if (!userList) {
            throw {
                status: 500,
                function: "getAllUsers",
                error: "Could not retrieve list of all users."
            };
        }
        
        userList = userList.map((element) => {
            element._id = element._id.toString();
            return element;
        });

        if (sortAlphabetically) {
            userList.sort((user1, user2) => {
                if (user1.username < user2.username) return -1;
                if (user1.username === user2.username) return 0;
                return 1;
            });
        }
        
        return userList;
    
    },


    /**
     * 
     * @param {string} id 
     * @returns {object} The requested User document (with the _id property converted to a string).
     */
    async getUserById (id) {

        // Input validation.
        id = checkId(id, "getUserById", "User");

        // Get users collection.
        const userCollection = await users();

        // Find the user with the given ID.
        const user = await userCollection.findOne({ _id: new ObjectId(id) });

        if (user === null) {
            throw {
                status: 404,
                function: "getUserById",
                error: "No user with that ID."
            }
        }

        // Return the user object with the _id property converted to a string.
        user._id = user._id.toString();
        return user;
      
    },


    /**
     * 
     * @param {string} username 
     * @returns {object} The requested User document (with the _id property converted to a string).
     */
    async getUserByUsername(username) {

        // Input validation.
        username = checkUsername(username, "getUserByUsername");

        // Get users collection.
        const userCollection = await users();

        // Find the user with the given ID.
        const user = await userCollection.findOne(
            { username: username }
        );

        if (user === null) {
            throw {
                status: 404,
                function: "getUserByUsername",
                error: "No user with that username."
            }
        }

        // Return the user object with the _id property converted to a string.
        user._id = user._id.toString();
        return user;

    },


    /**
     * 
     * @returns A list of all usernames in the Users collection.
     */
    async getTakenUsernames() {
        
        // Get the users collection.
        const userCollection = await users();

        // Get all users in the database.
        let userList = await this.getAllUsers();

        let usernames = userList.map((user) => user.username.toLowerCase());

        return usernames
    
    },
    

    /**
     * Appends a user ID to the friends property of another user.
     * @param {string} id The ID of the user who wants to add a friend.
     * @param {string} friendId The ID of the friend.
     * @returns {boolean} true
     */
    async addFriend(id, friendId) {

        // Input validation.
        id = checkId(id, "addFriend", "User");
        friendId = checkId(friendId, "addFriend", "User");

        // Get the user associated with "id".
        // This function will throw an error if no user is found.
        const user = await this.getUserById(id);
        
        // Check if there is a user associated with "friendId".
        // This function will throw an error if no user is found.
        const user_to_friend = await this.getUserById(friendId);

        // Check if the user associated with "id" is already friends with the user associated with "friendId".
        for (let friend of user.friends) {
            if (friend === friendId) {
                throw {
                    status: 500,
                    function: "addFriend",
                    error: "User is already a friend."
                };
            }
        }

        //user.friends.push(friendId);
        
        // Get the Users collection.
        const userCollection = await users();

        // Update the user's friends list.
        const updateInfo = await userCollection.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$push: {friends: friendId}},
            {returnDocument: 'after'}
        );

        if (!updateInfo) {
            throw {
                status: 500,
                function: "addFriend",
                error: `Could not update user's friends list`
            };
        }

        // Update the user_to_friend's followers list.
        const updateInfo2 = await userCollection.findOneAndUpdate(
            {_id: new ObjectId(friendId)},
            {$push: {followers: id}},
            {returnDocument: 'after'}
        );

        if (!updateInfo2) {
            throw {
                status: 500,
                function: "addFriend",
                error: `Could not update follower list of user who is being friended.`
            };
        }
        
        return true;

    },


    /**
     * 
     * @param {*} id 
     * @param {*} friendId 
     */
    async removeFriend(id, friendId) {

        // Input validation.
        id = checkId(id, "removeFriend", "User");
        friendId = checkId(friendId, "removeFriend", "User");
 
 
        // Get the user associated with "id".
        // This function will throw an error if no user is found.
        const user = await this.getUserById(id);
 
 
        // Check if there is a user associated with "friendId".
        // This function will throw an error if no user is found.
        await this.getUserById(friendId);

        
        // Get the Users collection.
        const userCollection = await users();

        // Update the user's friends list.
        const updateInfo = await userCollection.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$pull: {friends: friendId}},
            {returnDocument: 'after'}
        );

        //Error
        if (!updateInfo) {
            throw {
                status: 500,
                function: "removeFriend",
                error: `Could not update user's friends list`
            };
        }

        updateInfo._id = updateInfo._id.toString();
        
        return updateInfo;

    },


   /**
     * 
     * @param {*} userId 
     * @param {*} gameId 
     * @param {*} userGameInfo 
     * @returns 
     */
    async addGame(userId, gameId, userGameInfo) {

        // Input validation for the ID parameters.
        userId = checkId(userId, "addGame", "User");
        gameId = checkId(gameId, "addGame", "Game");

        // Get the users and games collections.
        const usersCollection = await users();
        const gamesCollection = await games();

        // Check if user ID exists.
        await this.getUserById(userId);

        // Check if game ID exists.
        let game = await gamesCollection.findOne({
            _id: new ObjectId(gameId)
        });

        if (!game) {
            throw {
                status: 404,
                function: "addGame",
                error: "No game with that ID."
            };
        }

        // Now that we know that the game exists, we can do input validation for the userGameInfo parameter.
        userGameInfo = checkUserGameInfo(userGameInfo, game, "addGame");

        // Insert the userGameInfo subdocument to User document.
        let updatedUser = await usersCollection.findOneAndUpdate(
          { _id: new ObjectId(userId) },
          {
            $push: {
              games: {
                gameName: game.name,
                gameId: new ObjectId(gameId),
                userGameInfo: userGameInfo,
              },
            },
          },
          { returnDocument: "after" }
        );

        if (!updatedUser) {
            throw {
                status: 500,
                function: "addGame",
                error: "User profile could not updated to include new game."
            };
        }

        // Update the numPlayers counter of the game.
        let updatedGame = await gamesCollection.findOneAndUpdate(
            {_id: new ObjectId(gameId)},
            {$set: {numPlayers: ++game.numPlayers}},
            {returnDocument:'after'}
        );

        if (!updatedGame) {
            throw {
                status: 500,
                function: "addGame",
                error: "The player count of the added game could not be updated."
            }
        }


        return {gameAdded: true};

    },

    async updateGame(userId, gameId, userGameInfo) {

        userId = checkId(userId, 'updateGame', 'user');
        gameId = checkId(gameId, 'updateGame', 'game');

        const userCollection = await users();

        //throws error if user/game does not exist
        const user = await this.getUserById(userId);
        const game = await gamesDataFunctions.getGameById(gameId);

        userGameInfo = checkUserGameInfo(userGameInfo, game, 'updateGame');

        // const newInfo = {
        //     id: gameId,
        //     name: game.name,
        //     userGameInfo: userGameInfo
        // }

        const userGames = user.games;

        for (let i = 0; i < userGames.length; i++){
            if (userGames[i].gameId.toString() === gameId.toString()){
                userGames[i].userGameInfo = userGameInfo;
            }
        }

        const updateInfo = await userCollection.findOneAndUpdate(
            {_id: new ObjectId(userId)},
            {$set: {games: userGames}},
            {returnDocument: 'after'}
        );

        //console.log(updateInfo.games[0]);
        
        //Error
        if (!updateInfo) {
            throw {
                status: 500,
                function: "updateGame",
                error: `Could not update user's game form`
            };
        }
        
        return {gameUpdated: true};

    },

    async removeGame(userId, gameId) {

        //Input validation
        userId = checkId(userId, 'removeGame', 'user');
        gameId = checkId(gameId, 'removeGame', 'game');


        const userCollection = await users();

        //throws error if user/game does not exist
        const user = await this.getUserById(userId);
        const game = await gamesDataFunctions.getGameById(gameId);

        //Delete game from user
        const updateInfo = await userCollection.findOneAndUpdate(
            {_id: new ObjectId(userId)},
            {$pull: {games: {gameId: new ObjectId(gameId) }}},
            {returnDocument: 'after'}
        );

        //Error
        if (!updateInfo) {
            throw {
                status: 500,
                function: "removeGame",
                error: `Could not update user's game list`
            };
        }

        const gamesCollection = await games();
        
        let updatedGame = await gamesCollection.findOneAndUpdate(
            {_id: new ObjectId(gameId)},
            {$set: {numPlayers: game.numPlayers - 1}},
            {returnDocument:'after'}
        );
        if (!updatedGame) {
            throw {
                status: 500,
                function: "removeGame",
                error: `Could not update games player count`
            };
        }

        return {gameRemoved: true};

    },


    /**
     * 
     * @param {*} userId The ID of the user making the query; used to prevent the user's own profile from showing up in the filtered results.
     * @param {*} gameId The ID of the game the user wants to search.
     */
    async filterUsersByGame(userId, gameId){
        // Get list of all user objects.
        const usersList = await this.getAllUsers();

        // Initialize a list to store all users that fit the filter requirements.
        let filteredUsersList = [];

        // For each user...
        for (let user of usersList) {

            if (user._id === userId) continue;

            // ..go through their list of games..
            for (let game of user.games) {

                // ...to see if they play the game associated with "gameId"...
                if (game.gameId.toString() === gameId) {
                    // ...if so, add the user to the filtered list.
                    filteredUsersList.push(user.username);
                }
            }
        }

        return filteredUsersList;

    },



    /**
     * 
     * @param {*} userId The ID of the user making the query; used to prevent the user's own profile from showing up in the filtered results.
     * @param {*} gameId The ID of the game the user wants to search.
     * @param {*} field The field
     * @param {*} value The value 
     */
    async filterUsersByText(userId, gameId, field_name, value) {

        // Get list of all user objects.
        const usersList = await this.getAllUsers();

        // Initialize a list to store all users that fit the filter requirements.
        let filteredUsersList = [];

        // For each user...
        for (let user of usersList) {

            if (user._id === userId) continue;

            // ..go through their list of games..
            for (let game of user.games) {

                // ...to see if they play the game associated with "gameId"...
                if (game.gameId.toString() === gameId) {

                    // ...if they do, go through their list of fields...
                    for (let field of game.userGameInfo) {

                        // ...to see if they filled out the field specified by "field"...
                        if (field_name === field.field_name) {

                            // ...if they do, compare the field's value with "value"...
                            if (value.toLowerCase() === field.value.toLowerCase()) {

                                // ...if they match, add the user to the filtered list.
                                filteredUsersList.push(user.username);

                            }
                        }
                    }
                }
            }
        }

        return filteredUsersList;

    },

    

    /**
     * 
     * @param {*} userId 
     * @param {*} gameId 
     * @param {*} field_name 
     * @param {*} value 
     * @param {*} operator 
     * @returns 
     */
    async filterUsersByNumber(userId, gameId, field_name, value, operator) {

        const usersList = await this.getAllUsers();

        let filteredUsersList = [];

        for (let user of usersList) {

            if (user._id === userId) continue;

            for (let game of user.games) {

                if (game.gameId.toString() === gameId) {

                    for (let field of game.userGameInfo) {

                        if (field_name === field.field_name) {

                            switch(operator) {
                                case "Equal To":
                                    if (field.value === value) {
                                        filteredUsersList.push(user.username);
                                    }
                                    break;
                                case "Greater Than":
                                    if (field.value > value) {
                                        filteredUsersList.push(user.username);
                                    }
                                    break;
                                case "Less Than":
                                    if (field.value < value) {
                                        filteredUsersList.push(user.username);
                                    }
                                    break;
                                default:
                                    throw {
                                        status: 500,
                                        function: "filterUsersByNumber",
                                        error: "Operator must be either 'Equal To', 'Greater Than', or 'Less Than'."
                                    };
                            }

                        }

                    }

                }

            }

        }

        return filteredUsersList;

    },

    /**
     * Nearly identical to filterUsersByText(), but case sensitive.
     * This doesn't change a whole lot anyways since the user isn't typing the value themselves, but selecting it from a dropdown menu instead, so this mostly serves to double check that we're passing the correct values to this function.
     * @param {*} userId 
     * @param {*} gameId 
     * @param {*} field_name 
     * @param {*} value 
     * @returns 
     */
    async filterUsersBySelect(userId, gameId, field_name, value) {

        const usersList = await this.getAllUsers();

        let filteredUsersList = [];

        for (let user of usersList) {

            if (user._id === userId) continue;

            for (let game of user.games) {

                if (game.gameId.toString() === gameId) {

                    for (let field of game.userGameInfo) {

                        if (field_name === field.field_name) {

                            if (value === field.value) {

                                filteredUsersList.push(user.username);

                            }

                        }

                    }

                }

            }

        }

        return filteredUsersList;

    },

    //* Data functions for comments are implemented in "./comments.js"

};

export default exportedMethods;