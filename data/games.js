import { ObjectId } from "mongodb";
import { games } from "../config/mongoCollections.js";
import { checkString, checkDateReleased, checkForm } from "../helpers.js";


// I still have not tested these functions, but I have the general
// idea of them set up.

const exportedMethods = {
  async createGame(name, dateReleased, form) {
    if ((!name, dateReleased, questions)) {
      throw `Error: name, dateReleased, and form must all be supplied to create a game!`;
    }
    name = checkString(name, "name", "createGame");

    dateReleased = checkDateReleased(dateReleased, "createGame");

    form = checkForm(form);

    let newGame = {
      name: name,
      dateReleased: dateReleased,
      numPlayers: 0,
      form: form,
      comments: [],
    };

    const gameCollection = await games();
    const insertInfo = await gameCollection.insertOne(newGame);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw `createGame Error: Could not create game.`;
    }
    newGame["_id"] = insertInfo.insertedId.toString();

    return newGame;
  },

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

  async updateGame(id) {
    // Waiting to see how updating a game will work, since updating the questions
    // might cause some big issues in the user collection


  },
};

export default exportedMethods;
