import { ObjectId } from "mongodb";
import { games } from "../config/mongoCollections.js";
import { checkString, checkDateReleased, checkForm } from "../helpers.js";



const exportedMethods = {

  /**
   * Adds a Game document to the Games collection.
   * @param {string} name The name of the game.
   * @param {string} dateReleased The day the game was released.
   * @param {string[]} form The form fields that a user needs to fill out in order to add the game to their user profile.
   * @returns {object} The newly created Game document (with the _id property converted to a string).
   */
  async createGame(name, dateReleased, form) {

    // If any of the parameters were not provided, throw an error.
    if ((!name || !dateReleased || !form)) {
      throw `Error: name, dateReleased, and form must all be supplied to create a game!`;
    }

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
      comments: [],
    };

    // Get the Games collection.
    const gameCollection = await games();

    // Insert the new game object to the Games collection.
    const insertInfo = await gameCollection.insertOne(newGame);

    // Check if the insertion was successful.
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw `createGame Error: Could not create game.`;
    }

    // Convert the _id attribute to a string.
    newGame["_id"] = insertInfo.insertedId.toString();

    return newGame;

  },

  /**
   *
   * @returns {object[]} An array of Game documents (with the _id properties converted to strings).
   */
  async getAllGames() {
    const gameCollection = await games();
    let gameList = await gameCollection.find({}).toArray();
    if (!gameList) {
      throw `createGame Error: Could not get game list`;
    }
    gameList = gameList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return gameList;
  },

  /**
   * 
   * @param {*} id 
   * @returns 
   */
  async getGameById(id) {
    id = checkString(id, "id", "getGameById");

    if (!ObjectId.isValid(id)) {
      throw "getGameById Error: Invalid Object ID.";
    }

    const gameCollection = await games();

    const game = await gameCollection.findOne({ _id: new ObjectId(id) });
    if (!game) {
      throw `getGameById Error: No game with that id`;
    }
    game._id = game._id.toString();
    return game;
  },

  /**
   * 
   * @param {*} id 
   * @returns 
   */
  async removeGame(id) {
    id = checkString(id, "id", "removeGame");

    if (!ObjectId.isValid(id)) {
      throw `removeGame Error: Invalid Object ID.`;
    }

    const gameCollection = await games();
    const deletionInfo = await gameCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });
    if (!deletionInfo) {
      throw `removeGame Error: Could not remove game.`;
    }
    return deletionInfo;
  },

  /**
   * 
   * @param {*} id 
   */
  async updateGame(id) {
    // Waiting to see how updating a game will work, since updating the questions
    // might cause some big issues in the user collection


  },
  
};

export default exportedMethods;
