import { ObjectId } from "mongodb";
import { games } from "../config/mongoCollections.js";
import { getUserById } from "./users.js";
import {
  checkString,
  checkDateReleased,
  checkForm,
  checkId,
  checkRating
} from "../helpers.js";



const exportedMethods = {

  /**
   * Adds a Game document to the Games collection.
   * @param {string} name The name of the game.
   * @param {string} dateReleased The day the game was released.
   * @param {string[]} form The form fields that a user needs to fill out in order to add the game to their user profile.
   * @returns {object} The newly created Game document (with the _id property converted to a string).
   */
  async createGame(name, dateReleased, form) {

    // Input validation.
    name = checkString(name, "name", "createGame");
    dateReleased = checkDateReleased(dateReleased, "createGame");
    form = checkForm(form);

    // Create the new game object.
    let newGame = {
      name: name,
      dateReleased: dateReleased,
      numPlayers: 0,
      form: form,
      averageRating: 0,
      reviews: [],
      comments: [],
    };

    // Get the Games collection.
    const gamesCollection = await games();

    // Insert the new game object to the Games collection.
    const insertInfo = await gamesCollection.insertOne(newGame);

    // Check if the insertion was successful.
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw `createGame Error: Could not create game.`;
    }

    // Convert the _id attribute to a string.
    newGame["_id"] = insertInfo.insertedId.toString();

    return newGame;

  },


  /**
   * Returns an array containing all the Game documents in the Games collection.
   * @returns {object[]} An array of Game documents (with the _id properties converted to strings).
   */
  async getAllGames() {

    // Get games collection.
    const gamesCollection = await games();
    
    // Get all the documents in the games collection.
    let gameList = await gamesCollection.find({}).toArray();

    if (!gameList) {
      throw `createGame Error: Could not get game list`;
    }

    // Convert all the _id properties to strings.
    gameList = gameList.map((element) => {
      element._id = element._id.toString();
      return element;
    });

    return gameList;
  },


  /**
   * 
   * @param {string} id 
   * @returns {object} The requested Game document (with the _id property converted to a string).
   */
  async getGameById(id) {

    // Input validation.
    id = checkId(id, "getGameById", "Game");

    // Get games collection.
    const gamesCollection = await games();

    // Get the game document with the given ID.
    const game = await gamesCollection.findOne({ _id: new ObjectId(id) });
    
    if (!game) {
      throw `getGameById Error: No game with that id`;
    }

    // Convert the _id property to a string.
    game._id = game._id.toString();

    return game;
  
  },


  /**
   * 
   * @param {string} id 
   * @returns {boolean} true
   */
  async removeGame(id) {

    // Input validation.
    id = checkId(id, "removeGame", "Game");

    // Get games collection.
    const gamesCollection = await games();

    // Get the game document with the given ID.
    const deletionInfo = await gamesCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });

    if (!deletionInfo) {
      throw `removeGame Error: Could not remove game.`;
    }

    return true;

  },


  /**
   * TO BE IMPLEMENTED
   * @param {*} id 
   */
  async updateGame(id) {
    // Waiting to see how updating a game will work, since updating the questions
    // might cause some big issues in the user collection


  },


  /**
   * 
   * @param {string} gameId The ID of the game we are inserting the review into.
   * @param {string} userId The ID of the user who created the review.
   * @param {string} title The title of the review.
   * @param {string} content The contents of the review.
   * @param {number} rating The user's rating of the game. On a scale of 1-5.
   * @returns 
   */
  async addReview(gameId, userId, title, content, rating) {

    // Input validation.
    gameId = checkId(gameId, "addReview", "Game");
    userId = checkId(userId, "addReview", "User");
    title = checkString(title, "title", "addReview");
    content = checkString(content, "content", "addReview");
    rating = checkRating(rating, "addReview");

    // Get games collection.
    const gamesCollection = await games();

    // Check if user ID exists.
    // This function will throw an error if no user is found.
    await getUserById(userId);

    // Get game.
    let game = gamesCollection.findOne({
      _id: gameId
    });

    if (!game) {
      throw "addReview Error: Game not found.";
    }

    // Create the new review object.
    let newReview = {
      _id: new ObjectId(),
      userId,
      title,
      content,
      rating
    };

    // Append the Review subdocument to the game's reviews property. 
    insertReviewToGameInfo = await gamesCollection.findOneAndUpdate(
      {_id: new ObjectId(gameId)},
      {$push: {reviews: newReview}},
      {returnDocument: 'after'}
    );

    if (!insertReviewToGameInfo) {
      throw "addReview Error: Could not add review.";
    }

    // Update averageRating of game.
    let sum = 0;
    for (let r of insertReviewToGameInfo.reviews) {
      sum += r.rating;
    }
    let newAvg = sum / (insertReviewToGameInfo.reviews.length + 1);

    // Update the movie document's overall rating.
    const updatedGame = {
      averageRating: Number(newAvg.toString().substring(0,3))
    };

    const updateGame = gamesCollection.findOneAndUpdate(
      {_id: new ObjectId(gameId)},
      {$set: updatedGame},
      {returnDocument: 'after'}
    );

    if (!updateGame) {
      throw "addReview Error: Could not update average rating of game.";
    }

    return updateGame;

  },
  
};

export default exportedMethods;
