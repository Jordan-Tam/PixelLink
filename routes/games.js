import {Router} from 'express';
import {checkString, checkDateReleased, checkForm, checkUserGameInfo, checkId} from '../helpers.js';
import games from '../data/games.js';
import users from "../data/users.js";

const router = Router();

router.route('/')
    .get(async (req, res) => {
        try {

            // Get list of all games.
            const gamesList = await games.getAllGames(true);

            // Get user document of the logged-in user.
            const user = await users.getUserById(req.session.user._id);

            // Add a property to all games that are already in the logged-in user's profile.
            for (let i = 0; i < gamesList.length; i++) {
                for (let userGame of user.games) {
                    if (gamesList[i].name === userGame.gameName) {
                        gamesList[i].game_added = true;
                        continue;
                    }
                }
            }

            return res.render('game-list', {
                games: gamesList,
                title: "Games List",
                stylesheet: "/public/css/game-list.css",
                user: req.session.user
            });
        } catch (error) {
            return res.status(error.status || 500).render("error", {
                status: error.status || 500,
                error_message: `${error.function}: ${error.error}`,
                title: `${error.status || 500} Error`,
                stylesheet: "/public/css/error.css"
            });
        }
    })
    .post(async (req, res) => {
        try {
            const {name, dateReleased, form} = req.body;
            name = checkString(name, "name", "POST game/list");
            dateReleased = checkDateReleased(dateReleased, "POST game/list");
            form = checkForm(form);
            if(!req.session.user || !req.session.user.admin){
                //Not logged in users and non-admins cannot add a game
                return res.status(403).json({error: "Permission Denied"});
            }
            const game = await games.createGame(name, dateReleased, form);
            const gamesList = await games.getAllGames();
            return res.render('game-list', {
                games: gamesList,
                title: "Games List",
                stylesheet: "/public/css/game-list.css"
            });
        } catch (error) {
            return res.status(error.status).render("error", {
                status: error.status,
                error_message: `${error.function}: ${error.error}`,
                title: `${error.status} Error`,
                stylesheet: "/public/css/error.css"
            });
        }
    })
    .delete()

router.route('/new')
    .get(async (req, res) => {
        try {
            if(!req.session.user || !req.session.user.admin){
                //Not logged in users and non-admins cannot see the create game form
                return res.status(403).render("error", {
                    status: 403,
                    error_message: "Permission Denied. Must be an admin.",
                    title: "403 Error",
                    stylesheet: "/public/css/error.css",
                    link: "/games/"
                  });
            }
            return res.render("add-game", {
                title: "Create a Game",
                stylesheet: "/public/css/add-game.css"
                //can add script later
            });
        } catch (error) {
            return res.status(error.status).render("error", {
                status: error.status,
                error_message: `${error.function}: ${error.error}`,
                title: `${error.status} Error`,
                stylesheet: "/public/css/error.css",
                link: "/games/"
            });
        }
    });

router.route('/:id')
    .get(async (req, res) => {
        try{
            const id = checkString(req.params.id, 'Game id','GET game/:id');
            const game = await games.getGameById(id);
            return res.render('game-page', {
                title: game.name,
                stylesheet: "/public/css/game-page.css",
                game: game
            });
        } catch (error) {
            return res.status(error.status).render("error", {
                status: error.status,
                error_message: `${error.function}: ${error.error}`,
                title: `${error.status} Error`,
                stylesheet: "/public/css/error.css"
            });
        }
    })
    .post() //addGame for the admin, renders add-gae view

// router.route('/:id/comment/:commentId')
//     .post()
//     .patch()
//     .delete()
    
router
  .route("/:id/form")
  .get(async (req, res) => {
    try {
      const id = checkString(req.params.id, "Game id", "GET game/:id/form");

      const user = await users.getUserById(req.session.user._id); 
      const game = await games.getGameById(id);
      const userGames = user.games;
      const gameNames = [];

      for(let i = 0; i < userGames.length; i++){
        gameNames.push(userGames[i].gameName);
      } 
      //If the game is in the users data already then it will load the form with PATCH method
      //Todo: get the users answers on the screen
      if (!gameNames.includes(game.name)){
        console.log('2')
        return res.render("game-form", {
            update: false,
            game: game,
            title: `Add ${game.name} to profile`,
            script: "/public/js/gameForm.js"
        });

      } else {

        console.log('1')
        return res.render("game-form", {
            update: true,
            game: game,
            title: `Edit ${game.name}`,
            script: "/public/js/gameForm.js"
        });

      }
    } catch (error) {
      return res.status(error.status).render("error", {
        status: error.status,
        error_message: `${error.function}: ${error.error}`,
        title: `${error.status} Error`,
        stylesheet: "/public/css/error.css"
      });
    }
  })
  .post(async(req, res) => {
    try {
        const gameId = checkString(
            req.params.id,
            "Game id",
            "POST games/:id/form"
        );

        let body = req.body;
        let userGameInfo = [];
        for(const elem in body){        // Fill in the userGameInfo array using the req.body values
            userGameInfo.push({field_name: elem, value: body[elem]});
        }
        const game = await games.getGameById(gameId);
        userGameInfo = checkUserGameInfo(userGameInfo, game, "Game form POST route");
        const result = await users.addGame(req.session.user._id, gameId, userGameInfo);
        if (!result || !result.gameAdded) {
            return res.status(500).render("error", {
                status: 500,
                error_message: "Internal Server Error",
                title: `500 Error`,
                stylesheet: "/public/css/error.css"
            });
        }
        return res.redirect("/users/" + req.session.user._id);
        


    } catch (error) {
      return res.status(error.status).render("error", {
        status: error.status,
        error_message: `${error.function}: ${error.error}`,
        title: `${error.status} Error`,
        stylesheet: "/public/css/error.css"
      });
    }
  })
    //DELETE AND PATCH BELOW
  .delete(async (req, res) => {

    try {
        
        req.params.id = checkId(req.params.id, "DELETE /game/:gameId/form", "game");

        if(!req.session.user){ 
            return res.status(403).json({error: "Permission Denied"});
        }


    } catch (e) {
        return res.status(500).json({error: e.error});
    }

    try {

        const uid = req.session.user._id;

        const user = await users.getUserById(uid);
        const game = await games.getGameById(req.params.id);

        const userGames = user.games;

        //Looks for the game in the users lists of games 
        let gameSearch = false;
        for(let i in userGames){
            if (userGames[i].gameId.toString() === req.params.id.toString()){
                gameSearch = true; 
                break;
            } 
        }

        if (!gameSearch){
            return res.status(404).json({error: "Game Not Found"});
        }

        //Will throw error if something goes wrong
        const result = await users.removeGame(uid, req.params.id);
        if (!result || !result.gameRemoved) {
            return res.status(500).render("error", {
                status: 500,
                error_message: "Internal Server Error",
                title: `500 Error`,
                stylesheet: "/public/css/error.css"
            });
        }

        const updatedUser = await users.getUserById(req.session.user._id)
        return res.redirect(`/users/${req.session.user._id}`);
    } catch (error) {

        return res.status(error.status).render("error", {
            status: error.status,
            error_message: `${error.function}: ${error.error}`,
            title: `${error.status} Error`,
            stylesheet: "/public/css/error.css"
          });

    }
  })
  .patch(async (req, res) => {
    try {
        req.params.gameId = checkId(req.params.id, "PATCH /game/:gameId", "game");
    } catch (e) {
        return res.status(500).json({error: e.error});
    }

    try  {

        let userGameInfo = [];

        for(const elem in req.body){
            userGameInfo.push({field_name: elem, value: req.body[elem]});
        }


        const uid = req.session.user._id;

        const user = await users.getUserById(uid);

        const game = await games.getGameById(req.params.gameId);
        userGameInfo = checkUserGameInfo(userGameInfo, game, "Game form PATCH route");

        const result = await users.updateGame(user._id, game._id, userGameInfo);

        if (!result || !result.gameUpdated) {
            return res.status(500).render("error", {
                status: 500,
                error_message: "Internal Server Error",
                title: `500 Error`,
                stylesheet: "/public/css/error.css"
            });
        }

        const updatedUser = await users.getUserById(uid);
        return res.redirect("/users/" + req.session.user._id);

    } catch (error){

        return res.status(error.status).render("error", {
            status: error.status,
            error_message: `${error.function}: ${error.error}`,
            title: `${error.status} Error`,
            stylesheet: "/public/css/error.css"
          });

    }
  });

router
    .route("/:id/reviews")
    .post(async (req, res) => {
        try {
            const gameId = checkId(req.params.id, "POST /:id/review", "Game");
            if(!req.session.user){ //get user, check if logged in
               return res.status(403).render("error", {
                status: 403,
                error_message: "Permission Denied. Must be logged in to post a review.",
                stylesheet: "/public/css/error.css",
                title: "403 Error"
               });
            }
            const userId = checkString(req.session.user._id, "POST /:id/review", "User");
            let {title, content, rating} = req.body; //input validation
            title = checkString(title, "title", "addReview");
            content = checkString(content, "content", "addReview");
            rating = checkRating(rating, "addReview");
            const updatedGame = await games.addReview(gameId, userId, title, content, rating);
            return res.render('game-page', {
                title: updatedGame.name,
                stylesheet: "/public/css/game-page.css",
                game: updatedGame
            });
        } catch (error) {
            return res.status(error.status || 500).render("error", {
                status: error.status || 500,
                error_message: error.error,
                stylesheet: "/public/css/error.css",
                title: `${error.status || 500} Error`
            });
        }
    });
router
    .route("/:gameId/reviews/:reviewId")
    .patch()
    .delete(async (req, res) => {
        try {
            const gameId = checkId(req.params.gameId, "DELETE /:gameId/reviews/:reviewId", "Game");
            const reviewId = checkId(req.params.reviewId, "DELETE /:gameId/reviews/:reviewId", "Review");
            if(!req.session.user || !req.session.user.admin){ //get user, check if logged in
                return res.status(403).render("error", {
                    status: 403,
                    error_message: "Permission Denied. Must be logged in as an admin to delete a review.",
                    stylesheet: "/public/css/error.css",
                    title: "403 Error"
                });
            }
            const updatedGame = await games.deleteReview(gameId, reviewId); //assuming dat function named deleteReview

            return res.render("game-page", {
                title: updatedGame.name,
                stylesheet: "/public/css/game-page.css",
                game: updatedGame
            });
        } catch (error) {
            return res.status(error.status || 500).render("error", {
                status: error.status || 500,
                error_message: error.error,
                stylesheet: "/public/css/error.css",
                title: `${error.status || 500} Error`
            });
        }
    });
export default router;