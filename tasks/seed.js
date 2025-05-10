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

let admin = await users.createUser("admin", "Admin!000", true);

let JohnDoe = await users.createUser("JohnDoe", "Password123@", false);

let owenTreanor = await users.createUser("owen-treanor", "D0nkeyK0ng!", false);

let gamer7 = await users.createUser("gamer7", "iAMAGAMER%1", false);

let Josh6 = await users.createUser("Josh6", "ABCabc123!", false);

let user5 = await users.createUser("user5", "!!3PPOOQQqq", false);

let James12345 = await users.createUser("James12345", "myPassword7%%", false);

let JamesMom = await users.createUser("JamesMom", "ABCabc123!", false);

let Jordan = await users.createUser("Jordan", "ABCabc123!", false);

let superman = await users.createUser("Superman", "ABCabc123!", false);

let batman = await users.createUser("BATMAN", "ABCabc123!", false);

let stevens = await users.createUser("Stevens", "ABCabc123!", false);

let william = await users.createUser("will.i.am", "ABCabc123!", false);


//////////////////////////////////////////////////////////////
// Games
//////////////////////////////////////////////////////////////
const chessForm = [
  {
    field: "Platform",
    type: "select",
    options: ["Chess.com", "Lichess"],
    domain: [],
  },
  {
    field: "Username on platform",
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
    field: "Favorite opening",
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

const clashOfClans_form = [
  {
    field: "Username",
    type: "text",
    options: [],
    domain: [],
  },
  {
    field: "Do you participate in Clan Wars?",
    type: "select",
    options: ["Yes", "No"],
    domain: [],
  },
  {
    field: "Town Hall level",
    type: "select",
    options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17"],
    domain: [],
  },
  {
    field: "Favorite elixir troop",
    type: "select",
    options: [
      "Barbarian",
      "Archer",
      "Giant",
      "Goblin",
      "Wall Breaker",
      "Balloon",
      "Wizard",
      "Healer",
      "Dragon",
      "P.E.K.K.A.",
      "Baby Dragon",
      "Miner",
      "Electo Dragon",
      "Yeti",
      "Dragon Rider",
      "Electro Titan",
      "Root Rider",
      "Thrower"
    ],
    domain: [],
  },
  {
    field: "Favorite dark elixir troop",
    type: "select",
    options: [
      "Minion",
      "Hog Rider",
      "Valkyrie",
      "Golem",
      "Witch",
      "Lava Hound",
      "Bowler",
      "Ice Golem",
      "Headhunter",
      "Apprentice Warden",
      "Druid",
      "Furnace"
    ],
    domain: [],
  },
  {
    field: "Favorite Hero",
    type: "select",
    options: [
      "Barbarian King",
      "Archer Queen",
      "Minion Prince",
      "Grand Warden",
      "Royal Champion"
    ],
    domain: [],
  }
];

const clashOfClans = await games.createGame(
  "Clash of Clans",
  "08/02/2012",
  clashOfClans_form
);

const superSmashBros_form = [
  {
    field: "Favorite Character",
    type: "select",
    options: [
      "Mario",
      "Yoshi",
      "Donkey Kong",
      "Link",
      "Samus",
      "Kirby",
      "Fox",
      "Pikachu",
      "Luigi",
      "Jigglypuff",
      "Captain Falcon",
      "Ness"
    ],
    domain: [],
  },
  {
    field: "Favorite Stage",
    type: "select",
    options: [
      "Peach's Castle",
      "Mushroom Kingdom",
      "Yoshi's Island",
      "Congo Jungle",
      "Hyrule Castle",
      "Planet Zebes",
      "Dream Land",
      "Sector Z",
      "Saffron City"
    ],
    domain: []
  }
];

const superSmashBros = await games.createGame(
  "Super Smash Bros.",
  "04/26/1999",
  superSmashBros_form
);

//////////////////////////////////////////////////////////////
// Game Comments
//////////////////////////////////////////////////////////////

const amongUs_comment1 = await comments.createComment(
  "game",
  amongUs._id.toString(),
  user5._id.toString(),
  "I'm so sus!"
);

const balatro_comment1 = await comments.createComment(
  "game",
  balatro._id.toString(),
  owenTreanor._id.toString(),
  "I love this game."
);

const balatro_comment2 = await comments.createComment(
  "game",
  balatro._id.toString(),
  user5._id.toString(),
  "Blueprint is the GOAT"
);

const chess_comment1 = await comments.createComment(
  "game",
  chess._id.toString(),
  owenTreanor._id.toString(),
  "I am the best."
);

const chess_comment2 = await comments.createComment(
  "game",
  chess._id.toString(),
  superman._id.toString(),
  "Batman is awful at chess."
);

const chess_comment3 = await comments.createComment(
  "game",
  chess._id.toString(),
  batman._id.toString(),
  "Superman's favorite thing to do is save people. His second favorite thing to do is lie to them."
);

const clashOfClans_comment1 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  william._id.toString(),
  "I need a clan to join."
);

const clashOfClans_comment2 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  Josh6._id.toString(),
  "You can join mine."
);

const clashOfClans_comment3 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  william._id.toString(),
  "Thanks. What's the ID?"
);

const clashOfClans_comment4 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  Josh6._id.toString(),
  "I don't feel like putting it here. I'll DM it to you instead."
);

const clashOfClans_comment5 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  william._id.toString(),
  "Thanks. DM where though?"
);

const clashOfClans_comment6 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  Josh6._id.toString(),
  "I don't feel like putting it here. I'll visit your house instead."
);

const clashOfClans_comment7 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  william._id.toString(),
  "Thanks. How do you know where I live though?"
);

const clashOfClans_comment8 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  Josh6._id.toString(),
  "I don't. Can you give me your home address?"
);

const clashOfClans_comment9 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  william._id.toString(),
  "I don't feel like putting it here. I'll DM it to you instead."
);

const clashOfClans_comment10 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  Josh6._id.toString(),
  "Thanks. DM where though?"
);

const clashOfClans_comment11 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  william._id.toString(),
  "I don't feel like putting it here. I'll visit your house instead."
);

const clashOfClans_comment12 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  Josh6._id.toString(),
  "Thanks. How do you know where I live though?"
);

const clashOfClans_comment13 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  william._id.toString(),
  "I'm at your front porch. Open the door."
);

const clashOfClans_comment14 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  Josh6._id.toString(),
  "??????"
);

const clashOfClans_comment15 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  Josh6._id.toString(),
  "ok it turns out my dad was just pranking me. i had no idea he was on this site."
);

const clashOfClans_comment16 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  James12345._id.toString(),
  "I need a clan to join."
);

const clashOfClans_comment17 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  JamesMom._id.toString(),
  "James, I hope you've been applying for jobs."
);

const minecraft_comment1 = await comments.createComment(
  "game",
  minecraft._id.toString(),
  william._id.toString(),
  "Chicken Jockey!!"
);

//////////////////////////////////////////////////////////////
// User Comments
//////////////////////////////////////////////////////////////

const owenTreanor_comment1 = await comments.createComment(
  "user",
  owenTreanor._id.toString(),
  JohnDoe._id.toString(),
  "I am so much better than you."
);

const Josh6_comment1 = await comments.createComment(
  "user",
  Josh6._id.toString(),
  gamer7._id.toString(),
  "Let's play Minecraft!"
);

const James12345_comment1 = await comments.createComment(
  "user",
  James12345._id.toString(),
  Jordan._id.toString(),
  "I like your profile picture."
);

const gamer7_comment1 = await comments.createComment(
  "user",
  gamer7._id.toString(),
  gamer7._id.toString(),
  "You are ugly."
);

const gamer7_comment2 = await comments.createComment(
  "user",
  gamer7._id.toString(),
  gamer7._id.toString(),
  "Hello"
);

const gamer7_comment3 = await comments.createComment(
  "user",
  gamer7._id.toString(),
  gamer7._id.toString(),
  "What's your steamID?"
);

// We can add more later, this just got kinda repetitive for me lol.

// console.log(await comments.getCommentById(commentG2._id.toString(), "game"));

// console.log(await comments.removeComment(commentG1._id.toString(), "game"));

//////////////////////////////////////////////////////////////
// Game Reviews
//////////////////////////////////////////////////////////////

const chess_review1 = await games.addReview(
  chess._id,
  JohnDoe._id,
  "Lacking Content",
  "This game hasn't gotten any updates in centuries.",
  2
);

const chess_review2 = await games.addReview(
  chess._id,
  gamer7._id,
  "I love rooks",
  "I love rooks",
  5
);

const chess_review3 = await games.addReview(
  chess._id,
  user5._id,
  "Wait what is this",
  "i wanted to open google where am i",
  4
);


//////////////////////////////////////////////////////////////
// Add Games to User Profiles
//////////////////////////////////////////////////////////////

let JohnDoe_form_chess = [
  { field_name: "Platform", value: "Chess.com"},
  { field_name: "Username on platform", value: "MagnusCarlsen"},
  { field_name: "Do you prefer playing as White or Black?", value: "White" },
  { field_name: "Bullet rating", value: "600" },
  { field_name: "Blitz rating", value: "600" },
  { field_name: "Rapid rating", value: "600" },
  { field_name: "Favorite opening", value: "Queen's Gambit" },
];

let JohnDoe_game_chess = await users.addGame(JohnDoe._id, chess._id, JohnDoe_form_chess);

let JohnDoe_form_balatro = [
  { field_name: "What is your favorite hand?", value: "Flush" },
  { field_name: "What is your favorite legendary joker?", value: "Perkeo" },
  { field_name: "How many jokers do you have unlocked?", value: "150" },
];

let JohnDoe_game_balatro = await users.addGame(JohnDoe._id, balatro._id, JohnDoe_form_balatro);

//let removeUserGame = await users.removeGame(user1._id, balatro._id);

//console.log(await users.getUserById(user1._id));


console.log("Done seeding database.");

await closeConnection();
