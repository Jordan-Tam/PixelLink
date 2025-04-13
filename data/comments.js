import {ObjectId} from 'mongodb';
import {users, games, comments} from '../config/mongoCollections.js';
import {checkString} from '../helpers.js';

const exportedMethods = {
    async createComment(
        type, // string: Specifies what collection this comment belongs to.
        parentId, // string: _id of the user/game being commented on.
        userId, // string: _id of the user who made the comment.
        content // string: The contents of the comment.
    ) {

        // Input validation.
        type = checkString(type, "type", "createComment");
        parentId = checkString(parentId, "parentId", "createComment");
        userId = checkString(userId, "userId", "createComment");
        content = checkString(content, "content", "createComment");

        // Get the date.
        const d = new Date();
        const dateString = `${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`;

        // Get the time
        const timeString = `${d.toLocaleString('en-US', {
            hour: "numeric",
            minute: "numeric",
            hour12: true
        })}`;

        // Create the new Comment object.
        let newComment = {
            userId,
            content,
            dateString,
            timeString
        }

        // Get Comments collection.
        const commentsCollection = await comments();

        // Add the comment to the Comments collection.
        let insertCommentInfo = await commentsCollection.insertOne(newComment);
        if (!insertCommentInfo.acknowledged || !insertCommentInfo.insertedId) {
            throw "createComment Error: Could not add comment.";
        }

        // Scoping
        let insertCommentToUserInfo = undefined;
        let insertCommentToGameInfo = undefined;
        
        if (type === "user") {
            
            const usersCollection = await users();
            insertCommentToUserInfo = await usersCollection.findOneAndUpdate(
                {_id: new ObjectId(parentId)},
                {$push: {comments: insertCommentInfo._id.toString()}},
                {returnDocument: 'after'}
            );

            if (!insertCommentToUserInfo) {
                throw "createComment Error: Comment could not be added to user profile.";
            }

        } else if (type === "game") {

            const gamesCollection = await games();
            insertCommentToGameInfo = await gamesCollection.findOneAndUpdate(
                {_id: new ObjectId(parentId)},
                {$push: {comments: insertCommentInfo._id.toString()}},
                {returnDocument: 'after'}
            );

            if (!insertCommentToGameInfo) {
                throw "createComment Error: Comment could not be added to game.";
            }
        
        } else {
            throw "createComment Error: The type parameter must be either 'user' or 'game'.";
        }

        let newCommentId = ((insertCommentToUserInfo) ? insertCommentToUserInfo._id : insertCommentToGameInfo._id).toString();

        // Return the newly added comment.
        return this.getCommentById(newCommentId);

    },

    async getCommentById(id) {

        id = checkString(id, "id", "getCommentById");

        if (!ObjectId.isValid(id)) {
            throw "getCommentById Error: Invalid Object ID.";
        }

        const commentsCollection = await comments();

        const comment = await commentsCollection.findOne({
            _id: new ObjectId(id)
        });

        if (!comment) {
            throw "getCommentById Error: No comment with that id.";
        }

        comment._id = comment._id.toString();
        
        return comment;

    },

    async removeComment(id) {

        id = checkString(id, "id", "removeComment");

        if (!ObjectId.isValid(id)) {
            throw "getCommentById Error: Invalid Object ID.";
        }

        const commentsCollection = await comments();

        const deletionInfo = await commentsCollection.findOneAndDelete({
            _id: new ObjectId(id)
        });

        if (!deletionInfo) {
            throw "removeComment Error: Could not delete comment.";
        }

        deletionInfo._id = deletionInfo._id.toString();

        return deletionInfo;

    },

    async updateComment(id) {

    }
};

export default exportedMethods;