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

let gamer8 = await users.updateUsername(gamer7._id, "gamer8")

gamer8 = await users.updatePassword(gamer8._id, "iAMAGAMER%2");

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
// *Descriptions taken from Wikipedia
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
const chess = await games.createGame(
  "Chess",
  "Chess is a two-player strategy board game. Each player takes turns moving pieces. A player wins if they successfully checkmate the opponent's king, or a stalemate can occur if not enough pieces are left on the board to perform a checkmate or a player is unable to move any of their pieces when it is their turn.",
  "N/A",
  chessForm);

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
const balatro = await games.createGame(
  "Balatro",
  "Balatro is a deck building game developed by LocalThunk and published by Playstack. It has been well-received by critics and has received numerous awards and nominations. EDIT THIS!!!!!!",
  "02/20/2024",
  balatroForm);

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
  "Mario Kart 8 Deluxe is a racing game and a spin-off of the Super Mario franchise developed by Nintendo. Players race as iconic Mario characters on tracks themed after familiar locations in the franchise. Up to 12 players can race at the same time. Play Grand Prix, Time Trials, or the revamped Battle Mode. Only available on the Nintendo Switch.",
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
const amongUs = await games.createGame("Among Us",
  "Among Us is a social deduction game. Players are either a crewmate or an imposter. The imposters' goal is to sabotage the spaceship or kill all the crewmates, while the crewmates' goal is to complete all their tasks or deduce who the imposters are.",
  "06/15/2018",
  amongUsForm);

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
  "Overwatch 2 is a first-person shooter video game produced by Blizzard Entertainment It is a sequel to their 2016 video game Overwatch.",
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
  "Minecraft is a sandbox game developed by Mojang. It is currently the best-selling video game of all time, with total sales around 350,000,000.",
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
  "Marvel Rivals is a shooter video game developed by NetEase Games. It features 38 playable characters based on characters from Marvel Comics.",
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
      "Electro Dragon",
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
  "Clash of Clans is a mobile game developed by Supercell, a Finnish company. In the game, you attack other bases to steal loot, which you can use to upgrade defenses and other buildings in your own base.",
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
  "Super Smash Bros is a fighting game published by Nintendo. It is the first game in the Smash Bros series, a franchise that would have 4 more sequels.",
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
  "I'm so sus!",
  "1/21/2024",
  "1:03 PM"
);

const balatro_comment1 = await comments.createComment(
  "game",
  balatro._id.toString(),
  owenTreanor._id.toString(),
  "I love this game.",
  "5/10/2025",
  "2:03 AM"
);

const balatro_comment2 = await comments.createComment(
  "game",
  balatro._id.toString(),
  user5._id.toString(),
  "Blueprint is the GOAT",
  "5/11/2025",
  "3:04 AM"
);

const chess_comment1 = await comments.createComment(
  "game",
  chess._id.toString(),
  owenTreanor._id.toString(),
  "I am the best.",
  "7/18/2024",
  "6:14 PM"
);

const chess_comment2 = await comments.createComment(
  "game",
  chess._id.toString(),
  superman._id.toString(),
  "Batman is awful at chess."
);

const clashOfClans_comment1 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  william._id.toString(),
  "I need a clan to join.",
  "2/2/2025",
  "12:03 PM"
);

const clashOfClans_comment2 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  Josh6._id.toString(),
  "You can join mine.",
  "2/2/2025",
  "12:04 PM"
);

const clashOfClans_comment3 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  william._id.toString(),
  "Thanks. What's the ID?",
  "2/2/2025",
  "12:05 PM"
);

const clashOfClans_comment4 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  Josh6._id.toString(),
  "I don't feel like putting it here. I'll DM it to you instead.",
  "2/2/2025",
  "12:06 PM"
);

const clashOfClans_comment5 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  william._id.toString(),
  "Thanks. DM where though?",
  "2/2/2025",
  "12:07 PM"
);

const clashOfClans_comment6 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  Josh6._id.toString(),
  "I don't feel like putting it here. I'll visit your house instead.",
  "2/2/2025",
  "12:08 PM"
);

const clashOfClans_comment7 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  william._id.toString(),
  "Thanks. How do you know where I live though?",
  "2/2/2025",
  "12:09 PM"
);

const clashOfClans_comment8 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  Josh6._id.toString(),
  "I don't. Can you give me your home address?",
  "2/2/2025",
  "12:10 PM"
);

const clashOfClans_comment9 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  william._id.toString(),
  "I don't feel like putting it here. I'll DM it to you instead.",
  "2/2/2025",
  "12:11 PM"
);

const clashOfClans_comment10 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  Josh6._id.toString(),
  "Thanks. DM where though?",
  "2/2/2025",
  "12:12 PM"
);

const clashOfClans_comment11 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  william._id.toString(),
  "I don't feel like putting it here. I'll visit your house instead.",
  "2/2/2025",
  "12:13 PM"
);

const clashOfClans_comment12 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  Josh6._id.toString(),
  "Thanks. How do you know where I live though?",
  "2/2/2025",
  "12:14 PM"
);

const clashOfClans_comment13 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  william._id.toString(),
  "I'm at your front porch. Open the door.",
  "2/2/2025",
  "12:15 PM"
);

const clashOfClans_comment14 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  Josh6._id.toString(),
  "??????",
  "2/2/2025",
  "12:16 PM"
);

const clashOfClans_comment15 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  Josh6._id.toString(),
  "ok it turns out my dad was just pranking me. i had no idea he was on this site.",
  "2/2/2025",
  "12:21 PM"
);

const clashOfClans_comment16 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  James12345._id.toString(),
  "I need a clan to join.",
  "2/2/2025",
  "1:45 PM"
);

const clashOfClans_comment17 = await comments.createComment(
  "game",
  clashOfClans._id.toString(),
  JamesMom._id.toString(),
  "James, I hope you've been applying for jobs.",
  "2/2/2025",
  "1:46 PM"
);

const minecraft_comment1 = await comments.createComment(
  "game",
  minecraft._id.toString(),
  william._id.toString(),
  "Chicken Jockey!!"
);

const minecraft_comment2 = await comments.createComment(
  "game",
  minecraft._id.toString(),
  JamesMom._id.toString(),
  "Chicken Jockey!!"
);

const minecraft_comment3 = await comments.createComment(
  "game",
  minecraft._id.toString(),
  william._id.toString(),
  "Chicken Jockey!!"
);

const minecraft_comment4 = await comments.createComment(
  "game",
  minecraft._id.toString(),
  JamesMom._id.toString(),
  "Chicken Jockey!!"
);

const minecraft_comment5 = await comments.createComment(
  "game",
  minecraft._id.toString(),
  stevens._id.toString(),
  "Stevens Institute of Technology"
);

const superSmashBros_comment1 = await comments.createComment(
  "game",
  superSmashBros._id.toString(),
  william._id.toString(),
  "I remember playing this game when I was a young lad."
);

const superSmashBros_comment2 = await comments.createComment(
  "game",
  superSmashBros._id.toString(),
  user5._id.toString(),
  "Later entries were definitely better, but this is still a fun one to revisit."
);

await comments.removeComment(minecraft_comment2._id, "game");

await comments.updateComment(minecraft_comment4._id, "game", "HEROBRINE!!!")

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
  "Hi friend."
);

const gamer7_comment1 = await comments.createComment(
  "user",
  Josh6._id.toString(),
  gamer7._id.toString(),
  "You are ugly."
);

const gamer7_comment2 = await comments.createComment(
  "user",
  gamer7._id.toString(),
  gamer7._id.toString(),
  "No I am not!"
);

const gamer7_comment3 = await comments.createComment(
  "user",
  owenTreanor._id.toString(),
  gamer7._id.toString(),
  "What's your steamID?"
);

const Jordan_comment1 = await comments.createComment(
  "user",
  Jordan._id.toString(),
  Josh6._id.toString(),
  "Jordan, did we have math homework today?"
);

const Jordan_comment2 = await comments.createComment(
  "user",
  Jordan._id.toString(),
  James12345._id.toString(),
  "Jordan, is the English essay due tomorrow or three weeks from now?"
);

const Jordan_comment3 = await comments.createComment(
  "user",
  Jordan._id.toString(),
  Jordan._id.toString(),
  "Please stop using my profile to send me personal messages."
);

await comments.removeComment(Jordan_comment3._id, "user");

await comments.updateComment(gamer7_comment3._id, "user", "Hi Jordan!");


// console.log(await comments.getCommentById(commentG2._id.toString(), "game"));

// console.log(await comments.removeComment(commentG1._id.toString(), "game"));

//////////////////////////////////////////////////////////////
// Game Reviews
//////////////////////////////////////////////////////////////

const amongUs_review1 = await games.addReview(
  amongUs._id,
  user5._id,
  "Friendships were lost",
  "I keep getting imposter even though I hate being imposter but I can't stop winning as imposter so my friends stopped inviting me to our get-togethers so they could get a chance to be imposter.",
  4
);

const amongUs_review2 = await games.addReview(
  amongUs._id,
  william._id,
  "Friendships were made",
  "I keep getting crewmate, which is awesome because I don't enjoy lying to people. And when I do get imposter, I immediately rat myself out because I simply cannot bear to lie to my friends. This made them appreciate me even more and now I'm best man for all six of my friends.",
  5
);

const balatro_review1 = await games.addReview(
  balatro._id,
  JamesMom._id,
  "Too addicting",
  "My son won't stop playing this and I need him to get a job.",
  1
)

const balatro_review2 = await games.addReview(
  balatro._id,
  James12345._id,
  "90% of Gambling Addicts Quit Right Before They're About to Hit it Big",
  "90% of Gambling Addicts Quit Right Before They're About to Hit it Big. 90% of Gambling Addicts Quit Right Before They're About to Hit it Big. 90% of Gambling Addicts Quit Right Before They're About to Hit it Big. 90% of Gambling Addicts Quit Right Before They're About to Hit it Big. 90% of Gambling Addicts Quit Right Before They're About to Hit it Big.",
  5
);

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
  "Chess is a challening and thought-provoking adventure",
  "It may take you several years to master the intricate mechanics of this board game, but the journey will be worth it. Take it from me, a man stuck at 500 elo. You will feel so satisfied when you first reach 500.",
  4
);

const chess_review4 = await games.addReview(
  chess._id,
  Jordan._id,
  "Obsessed",
  "I keep playing even when I don't have time for it.",
  5
);

const clashofClans_review1 = await games.addReview(
  clashOfClans._id,
  gamer7._id,
  "Upgrade times are insufferable",
  "Upgrade times are insufferable. Thank god they got rid of the timers for everything else because I hardly spend any time playing this game now.",
  3
);

const clashOfClans_review2 = await games.addReview(
  clashOfClans._id,
  Jordan._id,
  "Electro dragon spam",
  "I love spamming electro dragons. It's the only way I know how to play.",
  5
);

const clashOfClans_review3 = await games.addReview(
  clashOfClans._id,
  william._id,
  "I love the cannon",
  "I don't want to merge my cannons when I get to Town Hall 16. Supercell, please don't make me get rid of them.",
  4
);

const marioKart_review1 = await games.addReview(
  marioKart._id,
  Jordan._id,
  "Illumination Studios",
  "They referenced this game in the mario movie. The reference being that mario was in it.",
  5
);

const minecraft_review1 = await games.addReview(
  minecraft._id,
  user5._id,
  "I give this game 5 stars",
  "I give this game 5 stars",
  1
);

const minecraft_review2 = await games.addReview(
  minecraft._id,
  gamer7._id,
  "Did anyone get into this game because of the Minecraft movie?",
  "This game is nothing like the movie. My avatar looks nothing like Jack Black.",
  2
);

const minecraft_review3 = await games.addReview(
  minecraft._id,
  Josh6._id,
  "THIS IS A GREAT GAME!!!",
  "You can do whatever you want in this game. It's amazing. I can build a house. I can mine diamonds. I can fight monsters. I can go to sleep. It's amazing. I can eat food. I can fly in the air. It's amazing. You can do whatever you want in this game.",
  5
);

const marvelRivals_review1 = await games.addReview(
  marvelRivals._id,
  gamer7._id,
  "Act like an angel and dress like crazy",
  "Da da da da",
  5
);

const superSmashBros_review1 = await games.addReview(
  superSmashBros._id,
  Jordan._id,
  "Bad",
  "Mr. Game and Watch isn't in this game. It is awful. Do not recommend.",
  2
);

const superSmashBros_review2 = await games.addReview(
  superSmashBros._id,
  JamesMom._id,
  "Nostalgia",
  "When I was younger, my siblings and I would settle our disagreements with a game of Super Smash Bros. Ahh, memories.",
  4
);

const superSmashBros_review3 = await games.addReview(
  superSmashBros._id,
  JohnDoe._id,
  "Pikachu!!!",
  "Kirby is so cute in this game. I like the plumber characters too lol.",
  5
);

const superSmashBrosUpdated = await games.getGameById(superSmashBros._id);

await games.removeReview(superSmashBrosUpdated.reviews[2]._id.toString());

await games.updateReview(superSmashBrosUpdated.reviews[0]._id.toString(), "So Fun!!", "I really love this game!", 5);


//////////////////////////////////////////////////////////////
// Add Games to User Profiles
//////////////////////////////////////////////////////////////

await users.addGame(admin._id, chess._id, [
  { field_name: "Platform", value: "Chess.com"},
  { field_name: "Username on platform", value: "Admin"},
  { field_name: "Do you prefer playing as White or Black?", value: "Black" },
  { field_name: "Bullet rating", value: "1200" },
  { field_name: "Blitz rating", value: "1500" },
  { field_name: "Rapid rating", value: "2000" },
  { field_name: "Favorite opening", value: "French Defense" },
]);

await users.addGame(JohnDoe._id, chess._id, [
  { field_name: "Platform", value: "Chess.com"},
  { field_name: "Username on platform", value: "MagnusCarlsen"},
  { field_name: "Do you prefer playing as White or Black?", value: "White" },
  { field_name: "Bullet rating", value: "600" },
  { field_name: "Blitz rating", value: "600" },
  { field_name: "Rapid rating", value: "600" },
  { field_name: "Favorite opening", value: "Queen's Gambit" },
]);

await users.addGame(Jordan._id, chess._id, [
  { field_name: "Platform", value: "Chess.com"},
  { field_name: "Username on platform", value: "Jordan"},
  { field_name: "Do you prefer playing as White or Black?", value: "Black" },
  { field_name: "Bullet rating", value: "1200" },
  { field_name: "Blitz rating", value: "1200" },
  { field_name: "Rapid rating", value: "1200" },
  { field_name: "Favorite opening", value: "Caro-Kann Defense" },
]);

await users.addGame(superman._id, chess._id, [
  { field_name: "Platform", value: "Lichess"},
  { field_name: "Username on platform", value: "Superman"},
  { field_name: "Do you prefer playing as White or Black?", value: "White" },
  { field_name: "Bullet rating", value: "3000" },
  { field_name: "Blitz rating", value: "2345" },
  { field_name: "Rapid rating", value: "2999" },
  { field_name: "Favorite opening", value: "London System" },
]);

await users.addGame(batman._id, chess._id, [
  { field_name: "Platform", value: "Lichess"},
  { field_name: "Username on platform", value: "Batman"},
  { field_name: "Do you prefer playing as White or Black?", value: "Black" },
  { field_name: "Bullet rating", value: "231" },
  { field_name: "Blitz rating", value: "447" },
  { field_name: "Rapid rating", value: "582" },
  { field_name: "Favorite opening", value: "Damiano Defence" },
]);

await users.addGame(JohnDoe._id, balatro._id, [
  { field_name: "What is your favorite hand?", value: "Flush" },
  { field_name: "What is your favorite legendary joker?", value: "Perkeo" },
  { field_name: "How many jokers do you have unlocked?", value: "150" },
]);

await users.addGame(Jordan._id, marioKart._id, [
  { field_name: "Which is your favorite character to race as?", value: "Shy Guy" },
  { field_name: "What is your preferred vehicle type?", value: "Kart" },
  { field_name: "Preferred CC", value: "200cc" },
  { field_name: "Do you like playing in Mirror Mode?", value: "Yes" }
]);

await users.addGame(gamer7._id, marioKart._id, [
  { field_name: "Which is your favorite character to race as?", value: "Baby Luigi" },
  { field_name: "What is your preferred vehicle type?", value: "Bike" },
  { field_name: "Preferred CC", value: "50cc" },
  { field_name: "Do you like playing in Mirror Mode?", value: "No" }
]);

await users.addGame(James12345._id, marioKart._id, [
  { field_name: "Which is your favorite character to race as?", value: "Wario" },
  { field_name: "What is your preferred vehicle type?", value: "Bike" },
  { field_name: "Preferred CC", value: "150cc" },
  { field_name: "Do you like playing in Mirror Mode?", value: "No" }
]);

await users.addGame(admin._id, marioKart._id, [
  { field_name: "Which is your favorite character to race as?", value: "Waluigi" },
  { field_name: "What is your preferred vehicle type?", value: "Kart" },
  { field_name: "Preferred CC", value: "150cc" },
  { field_name: "Do you like playing in Mirror Mode?", value: "No" }
]);

await users.addGame(stevens._id, marioKart._id, [
  {
    field_name: "Which is your favorite character to race as?",
    value: "Funky Kong",
  },
  { field_name: "What is your preferred vehicle type?", value: "Bike" },
]);

await users.addGame(gamer7._id, amongUs._id, [
  { field_name: "What role do you prefer?", value: "Crewmate" },
  { field_name: "Do you play with mods?", value: "Sometimes" },
  { field_name: "What platform do you play on?", value: "PC" }
]);

await users.addGame(stevens._id, amongUs._id, [
  { field_name: "What role do you prefer?", value: "Impostor" },
  { field_name: "Do you play with mods?", value: "No" },
  { field_name: "What platform do you play on?", value: "Xbox" },
]);

await users.addGame(gamer7._id, overwatch2._id, [
  { field_name: "Who is your favorite hero?", value: "Lucio" },
  { field_name: "What is your preferred role?", value: "Tank" },
  { field_name: "What platform do you play on?", value: "Switch" }
]);

await users.addGame(william._id, overwatch2._id, [
  { field_name: "Who is your favorite hero?", value: "Lucio" },
  { field_name: "What is your preferred role?", value: "Support" },
  { field_name: "What platform do you play on?", value: "Xbox" }
]);

await users.addGame(JamesMom._id, overwatch2._id, [
  { field_name: "Who is your favorite hero?", value: "Junkrat" },
  { field_name: "What is your preferred role?", value: "Damage" },
  { field_name: "What platform do you play on?", value: "PC" },
]);

await users.addGame(Josh6._id, overwatch2._id, [
  { field_name: "Who is your favorite hero?", value: "Brigitte" },
  { field_name: "What is your preferred role?", value: "Damage" },
  { field_name: "What platform do you play on?", value: "Playstation" }
]);

await users.addGame(James12345._id, overwatch2._id, [
  { field_name: "Who is your favorite hero?", value: "Tracer" },
  { field_name: "What is your preferred role?", value: "Damage" },
  { field_name: "What platform do you play on?", value: "Playstation" },
]);



await users.addGame(Josh6._id, minecraft._id, [
  { field_name: "What is your favorite way to play?", value: "Creative" },
  /* { field_name: "What is your favorite online server?", value: "" }, */
  { field_name: "What difficulty do you play on?", value: "Peaceful" },
  { field_name: "Bedrock or Java?", value: "Java" }
]);

await users.addGame(admin._id, clashOfClans._id, [
  { field_name: "Username", value: "admin1" },
  { field_name: "Do you participate in Clan Wars?", value: "No" },
  { field_name: "Town Hall level", value: "17" },
  { field_name: "Favorite elixir troop", value: "Barbarian" },
  { field_name: "Favorite dark elixir troop", value: "Minion" },
  { field_name: "Favorite Hero", value: "Barbarian King" }
]);

await users.addGame(gamer7._id, clashOfClans._id, [
  { field_name: "Username", value: "Supercell" },
  { field_name: "Do you participate in Clan Wars?", value: "No" },
  { field_name: "Town Hall level", value: "12" },
  { field_name: "Favorite elixir troop", value: "Goblin" },
  { field_name: "Favorite dark elixir troop", value: "Valkyrie" },
  { field_name: "Favorite Hero", value: "Minion Prince" }
]);

await users.addGame(user5._id, clashOfClans._id, [
  { field_name: "Username", value: "User 5" },
  { field_name: "Do you participate in Clan Wars?", value: "Yes" },
  { field_name: "Town Hall level", value: "10" },
  { field_name: "Favorite elixir troop", value: "Wizard" },
  { field_name: "Favorite dark elixir troop", value: "Hog Rider" },
  { field_name: "Favorite Hero", value: "Royal Champion" }
]);

await users.addGame(JamesMom._id, clashOfClans._id, [
  { field_name: "Username", value: "James's Mom" },
  { field_name: "Do you participate in Clan Wars?", value: "Yes" },
  { field_name: "Town Hall level", value: "16" },
  { field_name: "Favorite elixir troop", value: "Dragon Rider" },
  { field_name: "Favorite dark elixir troop", value: "Apprentice Warden" },
  { field_name: "Favorite Hero", value: "Barbarian King" }
]);

await users.addGame(superman._id, clashOfClans._id, [
  { field_name: "Username", value: "Batman" },
  { field_name: "Do you participate in Clan Wars?", value: "Yes" },
  { field_name: "Town Hall level", value: "17" },
  { field_name: "Favorite elixir troop", value: "Yeti" },
  { field_name: "Favorite dark elixir troop", value: "Headhunter" },
  { field_name: "Favorite Hero", value: "Grand Warden" }
]);

await users.addGame(batman._id, clashOfClans._id, [
  { field_name: "Username", value: "Superman" },
  { field_name: "Do you participate in Clan Wars?", value: "No" },
  { field_name: "Town Hall level", value: "11" },
  { field_name: "Favorite elixir troop", value: "Electro Dragon" },
  { field_name: "Favorite dark elixir troop", value: "Hog Rider" },
  { field_name: "Favorite Hero", value: "Archer Queen" }
]);

await users.addGame(batman._id, superSmashBros._id, [
  { field_name: "Favorite Character", value: "Kirby" },
  { field_name: "Favorite Stage", value: "Dream Land" }
]);

await users.addGame(superman._id, superSmashBros._id, [
  { field_name: "Favorite Character", value: "Captain Falcon" },
  { field_name: "Favorite Stage", value: "Hyrule Castle" }
]);

await users.addGame(JohnDoe._id, superSmashBros._id, [
  { field_name: "Favorite Character", value: "Pikachu" },
  { field_name: "Favorite Stage", value: "Dream Land" }
]);

await users.addGame(gamer7._id, marvelRivals._id, [
  { field_name: "Which role do you usually play?", value: "Vanguard" },
  { field_name: "Who is your favorite hero to play?", value: "Adam Warlock" },
  { field_name: "What platform do you play on?", value: "PC" },
]);

//let removeUserGame = await users.removeGame(user1._id, balatro._id);

//console.log(await users.getUserById(user1._id));

await users.addFriend(batman._id, Jordan._id);

await users.addFriend(superman._id, Jordan._id);

await users.addFriend(Jordan._id, JamesMom._id);

await users.addFriend(Jordan._id, James12345._id);

await users.addFriend(Jordan._id, william._id);

await users.addFriend(Jordan._id, Josh6._id);

await users.addFriend(Jordan._id, superman._id);

await users.addFriend(owenTreanor._id, admin._id);

await users.addFriend(admin._id, JamesMom._id);

await users.addFriend(owenTreanor._id, JamesMom._id);

await users.addFriend(owenTreanor._id, James12345._id);

await users.addFriend(stevens._id, superman._id);

await users.addFriend(stevens._id, william._id);

await users.addFriend(gamer8._id, Josh6._id);

await users.addFriend(user5._id, JohnDoe._id);

await users.addFriend(admin._id, Josh6._id);

await users.addFriend(admin._id, JohnDoe._id);

await users.addFriend(admin._id, stevens._id);

await users.addFriend(admin._id, gamer8._id);

await users.addFriend(James12345._id, JohnDoe._id);

await users.addFriend(James12345._id, stevens._id);

await users.addFriend(JamesMom._id, gamer8._id);

await users.addFriend(JamesMom._id, user5._id);

await users.addFriend(JamesMom._id, Josh6._id);

await users.addFriend(batman._id, JohnDoe._id);

await users.addFriend(batman._id, user5._id);

await users.addFriend(batman._id, william._id);

await users.addFriend(superman._id, JamesMom._id);

await users.addFriend(superman._id, user5._id);

await users.addFriend(superman._id, gamer8._id);

await users.addFriend(owenTreanor._id, user5._id);

await users.addFriend(owenTreanor._id, Josh6._id);

await users.addFriend(stevens._id, user5._id);

await users.addFriend(stevens._id, Josh6._id);

await users.addFriend(william._id, gamer8._id);

await users.addFriend(admin._id, James12345._id);

await users.addFriend(JohnDoe._id, stevens._id);

await users.addFriend(gamer8._id, user5._id);

await users.addFriend(Josh6._id, superman._id);

await users.addFriend(user5._id, william._id);

await users.addFriend(James12345._id, batman._id);

await users.addFriend(JamesMom._id, JohnDoe._id);

await users.addFriend(superman._id, JohnDoe._id);

await users.addFriend(batman._id, James12345._id);

await users.addFriend(stevens._id, gamer8._id);

await users.addFriend(william._id, Josh6._id);

await users.removeFriend(william._id, Josh6._id);


const updatedBalatroForm = [
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
    ],
    domain: [],
  },
  {
    field: "What is your most used joker?",
    type: "text",
    options: [],
    domain: [],
  },
  {
    field: "How many jokers do you have unlocked?",
    type: "number",
    options: [],
    domain: ["1", "150"],
  },
];
const updatedBalatro = await games.updateGame(
  balatro._id,
  "Balatro is a deck building game developed by LocalThunk and published by Playstack. It has been well-received by critics and has received numerous awards and nominations.",
  "02/20/2024",
  updatedBalatroForm
);

await users.addGame(owenTreanor._id, balatro._id, [
  { field_name: "What is your favorite hand?", value: "Pair" },
  { field_name: "What is your most used joker?", value: "Abstract Joker" },
  { field_name: "How many jokers do you have unlocked?", value: "130" },
]);

await users.updateGame(JohnDoe._id, balatro._id, [
  { field_name: "What is your favorite hand?", value: "Two Pair" },
  { field_name: "What is your most used joker?", value: "Blueprint" },
  { field_name: "How many jokers do you have unlocked?", value: "110" },
]);

await users.removeGame(Josh6._id, overwatch2._id);



console.log("Done seeding database.");

await closeConnection();
