import {ObjectId} from 'mongodb';
import {users, games} from '../config/mongoCollections.js';
import {checkString, checkId} from '../helpers.js';

const exportedMethods = {

    /**
     * Adds a Comment subdocument to a User or Game document.
     * @param {string} type The document type this comment is a subdocument of.
     * @param {string} parentId ID of the user/game being commented on.
     * @param {string} userId ID of the user who made the comment.
     * @param {string} content The actual contents of the comment.
     * @returns {object} The newly created Comment subdocument (with the _id property converted to a string).
     */
    async createComment(
        type,
        parentId,
        userId,
        content
    ) {

        // Input validation.
        type = checkString(type, "type", "createComment");
        parentId = checkString(parentId, "parentId", "createComment");
        userId = checkString(userId, "userId", "createComment");
        content = checkString(content, "content", "createComment");

        // Get the current date.
        const d = new Date();
        const dateString = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

        // Get the current time.
        const timeString = `${d.toLocaleString('en-US', {
            hour: "numeric",
            minute: "numeric",
            hour12: true
        })}`;

        // Create the new Comment object.
        let newComment = {
            _id: new ObjectId(),
            userId,
            content,
            dateString,
            timeString
        }

        // Variables to store insertion information.
        let insertedCommentToUserInfo = undefined;
        let insertedCommentToGameInfo = undefined;
        
        // Add the Comment to a Users document if type is defined as "user".
        if (type === "user") {
            
            // Get users collection.
            const usersCollection = await users();
            
            // Append the Comment subdocument to the user's comments property. 
            insertedCommentToUserInfo = await usersCollection.findOneAndUpdate(
                {_id: new ObjectId(parentId)},
                {$push: {comments: newComment}},
                {returnDocument: 'after'}
            );

            // Throw an error if the update failed.
            if (!insertedCommentToUserInfo) {
                throw "createComment Error: Comment could not be added to user profile.";
            }

        // Add the Comment to a Games document if type is defined as "game".
        } else if (type === "game") {

            // Get games collection.
            const gamesCollection = await games();
            
            // Append the Comments subdocument to the game's comments property.
            insertedCommentToGameInfo = await gamesCollection.findOneAndUpdate(
              { _id: new ObjectId(parentId) },
              { $push: { comments: newComment } },
              { returnDocument: "after" }
            );

            // Throw an error if the update failed.
            if (!insertedCommentToGameInfo) {
                throw "createComment Error: Comment could not be added to game.";
            }
        
        // Throw an error if type is defined as anything else.
        } else {
            throw "createComment Error: The type parameter must be either 'user' or 'game'.";
        }

        // Convert the _id attribute to a string.
        newComment._id = newComment._id.toString();

        // Return the Comment object.
        return newComment;

    },


    /**
     * Finds the requested comment using a string representation of its ID.
     * @param {string} id ID of the comment
     * @param {string} type The document type this comment is a subdocument of.
     * @returns {object} The requested comment. 
     */
    async getCommentById(id, type) {

        // Input validation.
        id = checkString(id, "id", "getCommentById");

        if (!ObjectId.isValid(id)) {
            throw "getCommentById Error: Invalid Object ID.";
        }

        // If the comment was made under a user profile, search the Users collection for the comment.
        if (type === "user") {

            // Get the Users collection.
            const usersCollection = await users();

            // Search for a User containing a comment with the specified id.
            let user = await usersCollection.findOne(
                {"comments._id": new ObjectId(id)}
            );

            // If no user was found, the comment does not exist. Throw an error.
            if (!user) throw "getCommentById: Comment not found.";

            // Loop through the User's comments array for the desired comment.
            // Before returning the comment, convert the ObjectId to a string.
            for (let comment of user.comments) {
                if (comment._id.toString() === id) {
                    comment._id = comment._id.toString();
                    return comment;
                }
            }

            // The code should never reach this point.
            throw "getCommentById: Comment disappeared.";


        // If the comment was made under a game, search the Games collection for the comment.
        } else if (type === "game") {

            // Get the Games collection.
            const gamesCollection = await games();

            // Search for a Game containing a comment with the specified id.
            let game = await gamesCollection.findOne(
                {"comments._id": new ObjectId(id)}
            );

            // If no game was found, the comment does not exist. Throw an error.
            if (!game) throw "getCommentById: Comment not found.";

            // Loop through the Game's comments array for the desired comment.
            // Before returning the comment, convert the ObjectId to a string.
            for (let comment of game.comments) {
                if (comment._id.toString() === id) {
                    comment._id = comment._id.toString();
                    return comment;
                }
            }

            // The code should never reach this point.
            throw "getCommentById: Comment disappeared.";

        } else {

            throw "createComment Error: The type parameter must be either 'user' or 'game'.";

        }

    },


    /**
     * Deletes the requested comment using a string representation of its ID.
     * @param {string} id ID of the comment
     * @param {string} type The document type this comment is a subdocument of.
     * @returns {boolean} true 
     */
    async removeComment(id, type) {

        // Input validation.
        id = checkString(id, "id", "removeComment");

        if (!ObjectId.isValid(id)) {
            throw "removeComment Error: Invalid Object ID.";
        }

        if (type === "user") {

            // Get users collection.
            const usersCollection = await users();

            // Get the user associated with the comment.
            const user = await usersCollection.findOne(
                {"comments._id": new ObjectId(id)}
            );

            // Throw an error if the comment does not exist.
            if (!user) throw "removeComment Error: Comment not found.";

            // Delete the comment from the user's comments property.
            const deletionInfo = await usersCollection.findOneAndUpdate(
                {_id: user._id},
                {$pull: {comments: {"_id": new ObjectId(id)}}},
                {returnDocument: 'after'}
            )

            // Throw an error if the deletion failed.
            if (!deletionInfo) throw "removeComment Error: Comment could not be deleted.";

        } else if (type === "game") {
    
            // Get games collection.
            const gamesCollection = await games();

            // Get the game associated with the comment.
            const user = await gamesCollection.findOne(
                {"comments._id": new ObjectId(id)}
            );

            // Throw an error if the comment does not exist.
            if (!user) throw "removeComment Error: Comment not found.";

            // Delete the comment from the user's comments property.
            const deletionInfo = await gamesCollection.findOneAndUpdate(
                {_id: user._id},
                {$pull: {comments: {"_id": new ObjectId(id)}}},
                {returnDocument: 'after'}
            )

            // Throw an error if the deletion failed.
            if (!deletionInfo) throw "removeComment Error: Comment could not be deleted.";

        } else {
            
            throw "removeComment Error: The type parameter must be either 'user' or 'game'.";
        
        }

        return true;

    },

};

export default exportedMethods;