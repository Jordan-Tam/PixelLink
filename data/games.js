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
   * @param {string} description The description of the game.
   * @param {string} dateReleased The day the game was released.
   * @param {string[]} form The form fields that a user needs to fill out in order to add the game to their user profile.
   * @returns {object} The newly created Game document (with the _id property converted to a string).
   */
  async createGame(name, description, dateReleased, form) {

    // Input validation.
    name = checkString(name, "name", "createGame");
    description = checkString(description, "description", "createGame");
    dateReleased = checkDateReleased(dateReleased, "createGame");
    form = checkForm(form);

    // Create the new game object.
    let newGame = {
      name: name,
      description, description,
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
    // would need to iterate thru profiles and remove the corresponding gmae object from the games list


  },


  async updateAverageRating(gameId) {

    // Input validation.
    gameId = checkId(gameId, "updateAverageRating", "Game");

    // Get games collection.
    const gamesCollection = await games();

    // Get game.
    let game = await gamesCollection.findOne({
        _id: new ObjectId(gameId)
    });

    // Check if a game was found.
    if (!game) {
        throw {
            status: 500,
            function: "updateAverageRating",
            error: "Game not found."
        };
    }

    // Update averageRating of game.
    let sum = 0;
    for (let r of game.reviews) {
      sum += r.rating;
    }
    let newAvg = sum / (game.reviews.length);

    // Update the movie document's overall rating.
    const updatedGame = {
      averageRating: Number(newAvg.toString().substring(0,3))
    };

    const updateGame = gamesCollection.findOneAndUpdate(
      {_id: new ObjectId(gameId)},
      {$set: updatedGame},
      {returnDocument: 'after'}
    );

    // Check if the update was successful.
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
    let user = await userData.getUserById(userId);

    // Get game.
    let game = await gamesCollection.findOne({
      _id: new ObjectId(gameId),
    });

    // Check if a game was found.
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
      username: user.username,
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

    // Check if the insertion was successful.
    if (!insertReviewToGameInfo) {
      throw {
        status: 500,
        function: "addReview",
        error: "Could not add review to game."
      };
    }

    // Update the game's average rating and return the updated game object.
    return this.updateAverageRating(gameId);

  },

  async removeReview(reviewId) {

    // Input validation.
    reviewId = checkId(reviewId, "removeReview", "Review");

    // Get Games collection.
    const gamesCollection = await games();
    
    // Get game associated with the review.
    const game = gamesCollection.findOne({
      "reviews._id": new ObjectId(reviewId)
    });

    if (!game) {
      throw {
        status: 404,
        function: "removeReview",
        error: "Review not found."
      };
    }

    const deleteReviewInfo = await gamesCollection.findOneAndUpdate(
      {_id: game._id},
      {$pull: {reviews: {'_id': new ObjectId(reviewId)}}},
      {returnDocument: 'after'}
    );

    if (!deleteReviewInfo) {
      throw {
        status: 500,
        function: "removeReview",
        error: "Review could not be deleted."
      };
    }

    // Update the game's average rating.
    return this.updateAverageRating(deleteReviewInfo._id);
    
  },

  async updateReview(reviewId, title, content, rating) {

    // Input validation.
    reviewId = checkId(reviewId, "updateReview", "Review");
    title = checkString(title, "title", "updateReview");
    content = checkString(content, "content", "updateReview");
    rating = checkRating(rating, "updateReview");

    // Get games collection.
    const gamesCollection = await games();

    // Get game associated with the review.
    const game = gamesCollection.findOne({
      "reviews._id": new ObjectId(reviewId)
    });

    if (!game) {
      throw {
        status: 404,
        function: "removeReview",
        error: "Review not found."
      };
    }

    // Find the review associated with reviewId.
    for (let i = 0; i < game.reviews.length; i++) {
      if (game.reviews[i]._id.toString() === reviewId) {
        game.reviews[i].title = title;
        game.reviews[i].content = content;
        game.reviews[i].rating = rating;
        break;
      }
    }

    const updatedGame = {
      reviews: game.reviews
    };

    const updateReviewInfo = await gamesCollection.findOneAndUpdate(
      {_id: game._id},
      {$set: updatedGame},
      {returnDocument: 'after'}
    );

    if (!updateReviewInfo) {
      throw {
        status: 500,
        function: "updateReview",
        error: "Review could not be updated."
      };
    }

    // Return the updated game.
    return updateReviewInfo;

  },


  //Just an inital version: will modify 
  /**
   * An algorithm for picking up to 5 games to recommend to the user.
   * @param {string} userId The ID of the user receiving the game recommendations.
   * @returns {array} An array of 0 to 5 Game IDs.
   */
  async getRecommendations(userId) {
    
    //input validation
    userId = checkId(userId, "getRecommendations", "users");

    //user and game collections
    const user = await userData.getUserById(userId);
    const users_games = user.games; 
    let userCollection = await userData.getAllUsers();

    let user_array = [];

    //find users who have any games in common at all
    for (const u of userCollection) {
      for (const game of users_games) {
        if (u.games.some(g => g.name === game.name)) {
          user_array.push(otherUser._id.toString());
          break;
        }
      }
    }

    //remove dupes
    user_array = [...new Set(user_array)];

    //key: game title, value: number of occurences
    const gameFreq = {};

    const gameCollection = await this.getAllGames(); 

    //If the game is not in the users game collection it will be initalized into gameFreq
    for (const game of gameCollection) {
      if (!users_games.some(g => g.name === game.name)) {
        gameFreq[game.name] = 0;
      }
    }

    //for every user that had at least one similar game, it will 
    //increment the counter for every game they play in gameFreq
    for (const userId of user_array) {
      const u = await userData.getUserById(userId);

      for (const game of u.games) {
        if (!users_games.some(g => g.name === game.name)) {
          gameFreq[game.name] = (gameFreq[game.name] || 0) + 1;
        }
      }
    }

    //Sorts the recommendations from game frequency (descendign order) & only includes game names
    const sortedRecommendations = Object.entries(gameFreq)
      .sort((a, b) => b[1] - a[1]) 
      .map(({name, _}) => name); 

    //array of games to recommend
    const recommendations = [];

    //goes through recommendations and pushes the 5 highest frequencies
    if (sortedRecommendations.length >= 5){
      
      for(let i = 0; i < 5; i++){
        recommendations.push(sortedRecommendations[i]);
      }

    } else {

      //incase there is less than 5 games 
      for(let i = 0; i < sortedRecommendations.length ; i++){
        recommendations.push(sortedRecommendations[i]);
      }
    }

    return recommendations;
  
  }

};

export default exportedMethods;
