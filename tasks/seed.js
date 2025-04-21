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
//Users
//////////////////////////////////////////////////////////////

const user1 = await users.createUser(
  "JohnDoe",
  "johndoe10@gmail.com",
  "Password123@",
  "my_picture.jpg",
  false
);

const user2 = await users.createUser(
  "owen-treanor",
  "owen-treanor@gmail.com",
  "D0nkeyK0ng!",
  "picture.jpg",
  true
);

const user3 = await users.createUser(
  "gamer7",
  "gamer7@gmail.com",
  "iAMAGAMER%1",
  "pic.jpg",
  false
);

const user4 = await users.createUser(
  "Josh6",
  "josh7@gmail.com",
  "ABCabc123!",
  "pfp.jpg",
  false
);

const user5 = await users.createUser(
  "user5",
  "hello@gmail.com",
  "!!3PPOOQQqq",
  "p.jpg",
  false
);

const user6 = await users.createUser(
  "James12345",
  "jj@gmail.com",
  "myPassword7%%",
  "hello.jpg",
  false
);

const user7 = await users.createUser(
  "admin",
  "admin4PixelLink@gmail.com",
  "Admin!000",
  "admin.jpg",
  true
);

// console.log(await users.getAllUsers());

//////////////////////////////////////////////////////////////
//Games
//////////////////////////////////////////////////////////////
const chessForm = [
  {
    field: "Do you prefer to be white or black?",
    type: "select",
    options: ["White", "Black"],
  },
  {
    field: "What is your rating on Chess.com?",
    type: "text",
    options: [],
  },
  {
    field: "What is your favorite opening?",
    type: "text",
    options: [],
  },
];
const chess = await games.createGame("Chess", "unknown", chessForm);

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
  },
  {
    field: "What is your favorite legendary joker?",
    type: "select",
    options: ["Chicot", "Perkeo", "Canio", "Triboulet", "Yorick"],
  },
  {
    field: "What is your high score?",
    type: "text",
    options: [],
  },
];
const balatro = await games.createGame("Balatro", "02/20/2024", balatroForm);

const marioKartForm = [
  {
    field: "Which is your favorite character to race as?",
    type: "text",
    options: [],
  },
  {
    field: "What is your preferred vehicle type?",
    type: "select",
    options: ["Kart", "Bike"],
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
  },
  {
    field: "Do you play with mods?",
    type: "select",
    options: ["Yes", "Sometimes", "No"],
  },
  {
    field: "What platform do you play on?",
    type: "select",
    options: ["Mobile", "PC", "Switch", "Xbox", "Playstation"],
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
  },
  {
    field: "What is your preferred role?",
    type: "select",
    options: ["Tank", "Damage", "Support"],
  },
  {
    field: "What platform do you play on?",
    type: "select",
    options: ["PC", "Switch", "Xbox", "Playstation"],
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
  },
  {
    field: "What is your favorite online server?",
    type: "text",
    options: [],
  },
  {
    field: "What difficulty do you play on?",
    type: "select",
    options: ["Peaceful", "Easy", "Normal", "Hard", "Hardcore"],
  },
  {
    field: "Bedrock or Java?",
    type: "select",
    options: ["Bedrock", "Java"],
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
  },
  {
    field: "What platform do you play on?",
    type: "select",
    options: ["PC", "Xbox", "Playstation"],
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
//Comments
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

console.log("Done seeding database.");

await closeConnection();
