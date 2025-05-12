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
  "Chess is a board game for two players. It is an abstract strategy game which involves no hidden information and no elements of chance. It is played on a square board containing 64 squares arranged in an 8x8 grid. The players, referred to as 'White' and 'Black', each control sixteen pieces: one king, one queen, two rooks, two bishops, two knights, and eight pawns; each type of piece has a different pattern of movement. An enemy piece may be captured (removed from the board) by moving one's own piece onto the square it occupies; the object of the game is to 'checkmate' (threaten with inescapable capture) the enemy king. There are also several ways a game can end in a draw.",
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
  "Balatro is a 2024 poker-themed roguelike deck-building game developed by LocalThunk and published by Playstack. It was released on Microsoft Windows, Nintendo Switch, PlayStation 4, PlayStation 5, Xbox One, and Xbox Series X/S on February 20, 2024, with a port to macOS on March 1. Ports for Android and iOS were released on September 26, 2024. In the game, the player plays poker hands from a starting 52-card deck to score points and defeat blinds in a limited number of turns. Subsequent blinds become more difficult to beat, but the player can acquire joker and other cards, purchased from a shop with randomized offerings between blinds, that provide unique effects that impact play and scoring or the means to change the composition of their deck to give themselves an advantage.",
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
  "Mario Kart 8 Deluxe is a 2017 kart racing game developed and published by Nintendo for the Nintendo Switch. It retains the gameplay of previous Mario Kart games, with players controlling a Mario character in races around tracks. Tracks are themed around locales from the Super Mario series populated with power-ups that help players gain advantages in races. Different difficulties are selectable prior to a race; harder difficulties make gameplay faster. In the new anti-gravity sequences, players drive on walls and ceilings. Mario Kart 8 Deluxe contains a variety of single-player and local and online multiplayer game modes, including Grand Prix racing and arena-based battle modes.",
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
  "Among Us is a 2018 online multiplayer social deduction game developed and published by American game studio Innersloth. The game allows for cross-platform play; it was released on iOS and Android devices in June 2018 and on Windows later that year in November. It was ported to the Nintendo Switch in December 2020 and on the PlayStation 4, PlayStation 5, Xbox One and Xbox Series X/S in December 2021. A virtual reality adaptation, Among Us VR, was released on November 10, 2022.",
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
  "Overwatch 2 is a 2023 first-person shooter video game produced by Blizzard Entertainment. As a sequel and replacement to the 2016 hero shooter Overwatch, the game included new gamemodes and a reduction in team size from six to five. The game is free-to-play on Nintendo Switch, PlayStation 4, PlayStation 5, Windows, Xbox One, and Xbox Series X/S and features full cross-platform play. Overwatch 2 was announced in 2019, released in early access in October 2022, and officially released in August 2023. The game was planned to feature more story-based cooperative modes, but these were scrapped in 2023 to focus on its player versus player (PvP) elements. Overwatch 2 received generally favorable reviews from critics.",
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
  "Minecraft is a 2011 sandbox game developed and published by the Swedish video game developer Mojang Studios. Originally created by Markus 'Notch' Persson using the Java programming language, the first public alpha build was released on 17 May 2009. The game was continuously developed from then on, receiving a full release on 18 November 2011. Afterwards, Persson left Mojang and gave Jens 'Jeb' Bergensten control over development. In the years since its release, it has been ported to several platforms, including smartphones, tablets, and various video game consoles. In 2014, Mojang and the Minecraft intellectual property were purchased by Microsoft for US$2.5 billion.",
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
  "Marvel Rivals is a third-person hero shooter video game developed and published by NetEase Games in collaboration with Marvel Games. The game was released for PlayStation 5, Windows, and Xbox Series X/S on December 6, 2024. The game is free-to-play with a current lineup of 38 characters from Marvel Comics, and features cross-play across all supported platforms. As of February 2025, the game has reached over 40 million players.",
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
  "Clash of Clans is a 2012 free-to-play mobile strategy video game developed and published by Supercell. The game was released for iOS platforms on 2 August 2012, and on Google Play for Android on 7 October 2013.",
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
  "Super Smash Bros. is a 1999 crossover fighting game developed by HAL Laboratory and published by Nintendo for the Nintendo 64. It is the first game in the Super Smash Bros. series and was released in Japan on January 21, 1999; in North America on April 26, 1999; and in Europe on November 19, 1999.",
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

// We can add more later, this just got kinda repetitive for me lol.

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

await users.addGame(gamer7._id, amongUs._id, [
  { field_name: "What role do you prefer?", value: "Crewmate" },
  { field_name: "Do you play with mods?", value: "Sometimes" },
  { field_name: "What platform do you play on?", value: "PC" }
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

await users.addGame(Josh6._id, overwatch2._id, [
  { field_name: "Who is your favorite hero?", value: "Brigitte" },
  { field_name: "What is your preferred role?", value: "Damage" },
  { field_name: "What platform do you play on?", value: "Playstation" }
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

//let removeUserGame = await users.removeGame(user1._id, balatro._id);

//console.log(await users.getUserById(user1._id));

await users.addFriend(batman._id, Jordan._id);

await users.addFriend(superman._id, Jordan._id);

await users.addFriend(Jordan._id, JamesMom._id);

await users.addFriend(Jordan._id, James12345._id);

await users.addFriend(Jordan._id, william._id);

await users.addFriend(Jordan._id, Josh6._id);

//console.log(await games.getRecommendations(Jordan._id))

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
  "Balatro",
  "Balatro is a 2024 poker-themed roguelike deck-building game developed by LocalThunk and published by Playstack. It was released on Microsoft Windows, Nintendo Switch, PlayStation 4, PlayStation 5, Xbox One, and Xbox Series X/S on February 20, 2024, with a port to macOS on March 1. Ports for Android and iOS were released on September 26, 2024. In the game, the player plays poker hands from a starting 52-card deck to score points and defeat blinds in a limited number of turns. Subsequent blinds become more difficult to beat, but the player can acquire joker and other cards, purchased from a shop with randomized offerings between blinds, that provide unique effects that impact play and scoring or the means to change the composition of their deck to give themselves an advantage.",
  "02/20/2024",
  updatedBalatroForm
);





console.log("Done seeding database.");

await closeConnection();
