import {
  databaseConnection,
  closeConnection,
} from "../config/mongoConnection.js";
import users from "../data/users.js";
import games from "../data/games.js";
import comments from "../data/comments.js";

const db = await databaseConnection();
await db.dropDatabase();

const user1 = await users.createUser(
  "JohnDoe",
  "johndoe10@gmail.com",
  "Password123@",
  "Password123@",
  "my_picture.jpg",
  false
);

const user2 = await users.createUser(
  "owen-treanor",
  "owen-treanor@gmail.com",
  "D0nkeyK0ng!",
  "D0nkeyK0ng!",
  "picture.jpg",
  true
);


console.log("Done seeding database.");

await closeConnection();
