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

const user1Updated = await users.updateUser(
  user1._id,
  "JohnDoe2",
  "johndoe10@gmail.com",
  "Password123@",
  "my_picture.jpg",
  false
);

const user3 = await users.createUser(
  "gamer7",
  "gamer7@gmail.com",
  "iAMAGAMER%1",
  "iAMAGAMER%1",
  "pic.jpg",
  false
);

await users.removeUser(user3._id)

console.log(await users.getAllUsers());

console.log("Done seeding database.");

await closeConnection();
