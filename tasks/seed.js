import {
  databaseConnection,
  closeConnection,
} from "../config/mongoConnection.js";
import users from "../data/users.js";
import games from "../data/games.js";
import comments from "../data/comments.js";

const db = await databaseConnection();
await db.dropDatabase();

//////////////////////////////////////////////////////////////
// Users
//////////////////////////////////////////////////////////////

let user1 = await users.createUser("JohnDoe", "Password123@", false);

let user2 = await users.createUser("owen-treanor", "D0nkeyK0ng!", true);

let user3 = await users.createUser("gamer7", "iAMAGAMER%1", false);

let user4 = await users.createUser("Josh6", "ABCabc123!", false);

let user5 = await users.createUser("user5", "!!3PPOOQQqq", false);

let user6 = await users.createUser("James12345", "myPassword7%%", false);

let user7 = await users.createUser("admin", "Admin!000", true);

// console.log(await users.getAllUsers());

//////////////////////////////////////////////////////////////
// Games
//////////////////////////////////////////////////////////////
const chessForm = [
  {
    field: "Which site do you use?",
    type: "select",
    options: ["Chess.com", "Lichess"],
    domain: [],
  },
  {
    field: "Username on site",
    type: "text",
    options: [],
    domain: [],
  },
  {
    field: "Do you prefer playing as White or Black?",
    type: "select",
    options: ["White", "Black"],
    domain: [],
  },
  {
    field: "Bullet rating",
    type: "number",
    options: [],
    domain: ["0", "3000"],
  },
  {
    field: "Blitz rating",
    type: "number",
    options: [],
    domain: ["0", "3000"],
  },
  {
    field: "Rapid rating",
    type: "number",
    options: [],
    domain: ["0", "3000"],
  },
  {
    field: "What is your favorite opening?",
    type: "text",
    options: [],
    domain: [],
  },
];
const chess = await games.createGame("Chess", "N/A", chessForm);

const balatroForm = [
  {
    field: "What is your favorite hand?",
    type: "select",
    options: [
      "High Card",
      "Pair",
      "Two Pair",
      "Three of a Kind",
      "Straight",
      "Flush",
      "Full House",
      "Four of a Kind",
      "Straight Flush",
      "Five of a Kind",
      "Flush House",
      "Flush Five",
    ],
    domain: [],
  },
  {
    field: "What is your favorite legendary joker?",
    type: "select",
    options: ["Chicot", "Perkeo", "Canio", "Triboulet", "Yorick"],
    domain: [],
  },
  {
    field: "How many jokers do you have unlocked?",
    type: "number",
    options: [],
    domain: ["0", "150"],
  },
];
const balatro = await games.createGame("Balatro", "02/20/2024", balatroForm);

const marioKartForm = [
  {
    field: "Which is your favorite character to race as?",
    type: "text",
    options: [],
    domain: [],
  },
  {
    field: "What is your preferred vehicle type?",
    type: "select",
    options: ["Kart", "Bike"],
    domain: [],
  },
  {
    field: "Preferred CC",
    type: "select",
    options: ["50cc", "100cc", "150cc", "200cc"],
    domain: [],
  },
  {
    field: "Do you like playing in Mirror Mode?",
    type: "select",
    options: ["Yes", "No"],
    domain: [],
  },
];
const marioKart = await games.createGame(
  "Mario Kart 8 Deluxe",
  "04/28/2017",
  marioKartForm
);

const amongUsForm = [
  {
    field: "What role do you prefer?",
    type: "select",
    options: [
      "Impostor",
      "Crewmate",
      "Engineer",
      "Scientist",
      "Guardian Angel",
    ],
    domain: [],
  },
  {
    field: "Do you play with mods?",
    type: "select",
    options: ["Yes", "Sometimes", "No"],
    domain: [],
  },
  {
    field: "What platform do you play on?",
    type: "select",
    options: ["Mobile", "PC", "Switch", "Xbox", "Playstation"],
    domain: [],
  },
];
const amongUs = await games.createGame("Among Us", "06/15/2018", amongUsForm);

const overwatch2Form = [
  {
    field: "Who is your favorite hero?",
    type: "select",
    options: [
      "D.Va",
      "Doomfist",
      "Junker Queen",
      "Mauga",
      "Orisa",
      "Ramattra",
      "Reinhardt",
      "Roadhog",
      "Sigma",
      "Winston",
      "Wrecking Ball",
      "Zarya",
      "Ashe",
      "Bastion",
      "Cassidy",
      "Echo",
      "Genji",
      "Hanzo",
      "Junkrat",
      "Mei",
      "Pharah",
      "Reaper",
      "Sojourn",
      "Soldier: 76",
      "Sombra",
      "Symmetra",
      "Torbjörn",
      "Tracer",
      "Venture",
      "Widowmaker",
      "Ana",
      "Baptiste",
      "Brigitte",
      "Illari",
      "Kiriko",
      "Lifeweaver",
      "Lucio",
      "Mercy",
      "Moira",
      "Zenyatta",
    ],
    domain: [],
  },
  {
    field: "What is your preferred role?",
    type: "select",
    options: ["Tank", "Damage", "Support"],
    domain: [],
  },
  {
    field: "What platform do you play on?",
    type: "select",
    options: ["PC", "Switch", "Xbox", "Playstation"],
    domain: [],
  },
];
const overwatch2 = await games.createGame(
  "Overwatch 2",
  "08/10/2023",
  overwatch2Form
);

const minecraftForm = [
  {
    field: "What is your favorite way to play?",
    type: "select",
    options: ["Survival", "Creative"],
    domain: [],
  },
  {
    field: "What is your favorite online server?",
    type: "text",
    options: [],
    domain: [],
  },
  {
    field: "What difficulty do you play on?",
    type: "select",
    options: ["Peaceful", "Easy", "Normal", "Hard", "Hardcore"],
    domain: [],
  },
  {
    field: "Bedrock or Java?",
    type: "select",
    options: ["Bedrock", "Java"],
    domain: [],
  },
];
const minecraft = await games.createGame(
  "Minecraft",
  "05/17/2009",
  minecraftForm
);

const marvelRivalsForm = [
  {
    field: "Which role do you usually play?",
    type: "select",
    options: ["Vanguard", "Duelist", "Strategist"],
    domain: [],
  },
  {
    field: "Who is your favorite hero to play?",
    type: "select",
    options: [
      "Adam Warlock",
      "Black Panther",
      "Black Widow",
      "Captain America",
      "Cloak and Dagger",
      "Doctor Strange",
      "Emma Frost",
      "Hawkeye",
      "Hela",
      "Hulk",
      "Human Torch",
      "Invisible Woman",
      "Iron Fist",
      "Iron Man",
      "Jeff the Land Shark",
      "Loki",
      "Luna Snow",
      "Magik",
      "Magneto",
      "Mantis",
      "Mister Fantastic",
      "Moon Knight",
      "Namor",
      "Peni Parker",
      "Psylocke",
      "The Punisher",
      "The Thing",
      "Rocket Raccoon",
      "Scarlet Witch",
      "Squirrel Girl",
      "Spider-Man",
      "Star-Lord",
      "Storm",
      "Thor",
      "Winter Soldier",
      "Wolverine",
      "Venom",
    ],
    domain: []
  },
  {
    field: "What platform do you play on?",
    type: "select",
    options: ["PC", "Xbox", "Playstation"],
    domain: [],
  },
];
const marvelRivals = await games.createGame(
  "Marvel Rivals",
  "12/06/2024",
  marvelRivalsForm
);

// const allGames = await games.getAllGames();
// console.log(allGames);

//////////////////////////////////////////////////////////////
// Game Comments
//////////////////////////////////////////////////////////////

const commentG1 = await comments.createComment(
  "game",
  chess._id.toString(),
  user2._id.toString(),
  "I am the best."
);

const commentG2 = await comments.createComment(
  "game",
  balatro._id.toString(),
  user2._id.toString(),
  "I love this game."
);

const commentG3 = await comments.createComment(
  "game",
  amongUs._id.toString(),
  user5._id.toString(),
  "I'm so sus!"
);

const commentG4 = await comments.createComment(
  "game",
  balatro._id.toString(),
  user7._id.toString(),
  "Blueprint is the GOAT"
);

const commentG5 = await comments.createComment(
  "game",
  minecraft._id.toString(),
  user1._id.toString(),
  "Chicken Jockey!!"
);

//////////////////////////////////////////////////////////////
// User Comments
//////////////////////////////////////////////////////////////

const commentU1 = await comments.createComment(
  "user",
  user2._id.toString(),
  user1._id.toString(),
  "I am so much better than you."
);

const commentU2 = await comments.createComment(
  "user",
  user4._id.toString(),
  user3._id.toString(),
  "Let's play Minecraft!"
);

const commentU3 = await comments.createComment(
  "user",
  user5._id.toString(),
  user6._id.toString(),
  "I like your profile picture."
);

const commentU4 = await comments.createComment(
  "user",
  user7._id.toString(),
  user1._id.toString(),
  "You are ugly."
);

const commentU5 = await comments.createComment(
  "user",
  user2._id.toString(),
  user5._id.toString(),
  "Hello"
);

const commentU6 = await comments.createComment(
  "user",
  user2._id.toString(),
  user5._id.toString(),
  "What's your steamID?"
);

// We can add more later, this just got kinda repetitive for me lol.

// console.log(await comments.getCommentById(commentG2._id.toString(), "game"));

// console.log(await comments.removeComment(commentG1._id.toString(), "game"));

//////////////////////////////////////////////////////////////
// Game Reviews
//////////////////////////////////////////////////////////////

const review1 = await games.addReview(
  chess._id,
  user1._id,
  "Lacking Content",
  "This game hasn't gotten any updates in centuries.",
  2
);

const review2 = await games.addReview(
  chess._id,
  user3._id,
  "I love rooks",
  "I love rooks",
  5
);

const review3 = await games.addReview(
  chess._id,
  user5._id,
  "Wait what is this",
  "i wanted to open google where am i",
  4
);


//////////////////////////////////////////////////////////////
// Add Games to User Profiles
//////////////////////////////////////////////////////////////

let user1ChessForm = [
  { field_name: "Which site do you use?", value: "Chess.com"},
  { field_name: "Username on site", value: "MagnusCarlsen"},
  { field_name: "Do you prefer playing as White or Black?", value: "White" },
  { field_name: "Bullet rating", value: "600" },
  { field_name: "Blitz rating", value: "600" },
  { field_name: "Rapid rating", value: "600" },
  { field_name: "What is your favorite opening?", value: "Queen's Gambit" },
];

let userGame1 = await users.addGame(user1._id, chess._id, user1ChessForm);

let user1BalatroForm = [
  { field_name: "What is your favorite hand?", value: "Flush" },
  { field_name: "What is your favorite legendary joker?", value: "Perkeo" },
  { field_name: "How many jokers do you have unlocked?", value: "150" },
];

let userGame2 = await users.addGame(user1._id, balatro._id, user1BalatroForm);


console.log("Done seeding database.");

await closeConnection();
