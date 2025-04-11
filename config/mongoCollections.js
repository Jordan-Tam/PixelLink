import {databaseConnection} from "./mongoConnection.js";

const getCollectionFunction = (collection) => {
    let _col = undefined;
  
    return async () => {
      if (!_col) {
        const db = await databaseConnection();
        _col = await db.collection(collection);
      }
      return _col;
    };
};

export const users = getCollectionFunction("users");