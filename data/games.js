import { ObjectId } from "mongodb";
import { games } from "../config/mongoCollections.js";
import userData from "./users.js";
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
      throw {
        status: 500,
        function: "createGame",
        error: "Could not add game."
      }
    }

    // Convert the _id attribute to a string.
    newGame["_id"] = insertInfo.insertedId.toString();

    return newGame;

  },


  /**
   * Returns an array containing all the Game documents in the Games collection.
   * @returns {object[]} An array of Game documents (with the _id properties converted to strings).
   */
  async getAllGames(sortAlphabetically = false) {

    // Get games collection.
    const gamesCollection = await games();
    
    // Get all the documents in the games collection.
    let gameList = await gamesCollection.find({}).toArray();

    if (!gameList) {
      throw {
        status: 500,
        function: "getAllGames",
        error: "Could not retrieve list of all games."
      };
    }

    // Convert all the _id properties to strings.
    gameList = gameList.map((element) => {
      element._id = element._id.toString();
      return element;
    });

    if (sortAlphabetically) {
      gameList.sort((game1, game2) => {
        if (game1.name < game2.name) return -1;
        if (game1.name === game2.name) return 0;
        return 1;
      });
    }

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
      throw {
        status: 404,
        function: "getGameById",
        error: "No game with that ID."
      };
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
      throw {
        status: 500,
        function: "removeGame",
        error: "Could not remove game."
      };
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
    await userData.getUserById(userId);

    // Get game.
    let game = gamesCollection.findOne({
      _id: gameId
    });

    if (!game) {
      throw {
        status: 404,
        function: "addReview",
        error: "Game not found."
      };
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
    let insertReviewToGameInfo = await gamesCollection.findOneAndUpdate(
      {_id: new ObjectId(gameId)},
      {$push: {reviews: newReview}},
      {returnDocument: 'after'}
    );

    if (!insertReviewToGameInfo) {
      throw {
        status: 500,
        function: "addReview",
        error: "Could not add review to game."
      };
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
      throw {
        status: 500,
        function: "addReview",
        error: "Could not update average rating of game."
      };
    }

    return updateGame;

  },


  /**
   * An algorithm for picking up to 5 games to recommend to the user.
   * 1) For each game in the user's profile, get a list of all users who also play that game. 
   * 2) Combine all the lists from Step 1 into a single set (remove duplicate users).
   * 3) Create an object that keeps track of how often the algorithm sees a new game (key: game name, value: number of times the algorithm sees it)
   * 4) For each user in the set, iterate through their games list and increment respective counters in the object.
   * 5) Convert the object to a list and sort the games by the number of times the algorithm has seen it.
   * 6) Go through the list in descending order. When the algorithm sees a game that isn't in the user's profile, add it to the recommendations list.
   * 7) Keep doing this until either 5 games were added to the recommendations list or the entire list has been run through.
   * @param {string} userId The ID of the user receiving the game recommendations.
   * @returns {array} An array of 0 to 5 Game IDs.
   */
  async getRecommendations(userId) {
    return;
  },
  
};

export default exportedMethods;
