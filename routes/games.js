import {Router} from 'express';
import {checkString, checkDateReleased, checkForm, checkUserGameInfo} from '../helpers.js';
import games from '../data/games.js';
import users from "../data/users.js";

const router = Router();

router.route('/')
    .get()
    .post()

router.route('/list')
    .get(async (req, res) => {
        try {
            const gamesList = await games.getAllGames(true);
            return res.render('game-list', {
                games: gamesList,
                title: "Games List",
                stylesheet: "/public/css/game-list.css"
            });
        } catch (error) {
            return res.status(error.status || 500).render("error", {
                status: error.status || 500,
                error_message: `${error.function}: ${error.error}`
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
                title: "Games List"
            });
        } catch (error) {
            return res.status(error.status).render("error", {
                status: error.status,
                error_message: `${error.function}: ${error.error}`
            });
        }
    })

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
                error_message: `${error.function}: ${error.error}`
            });
        }
    })
    .post() //addGame for the admin, renders add-gae view

router
  .route("/:id/form")
  .get(async (req, res) => {
    try {
      const id = checkString(req.params.id, "Game id", "GET game/:id/form");
      const game = await games.getGameById(id);
      return res.render("game-form", {
        game: game,
        title: `Add ${game.name} to profile`,
        script: "/public/js/gameForm.js"
      });
    } catch (error) {
      return res.status(error.status).render("error", {
        status: error.status,
        error_message: `${error.function}: ${error.error}`,
      });
    }
  })
  .post(async(req, res) => {
    try {
        const gameId = checkString(
            req.params.id,
            "Game id",
            "POST game/:id/form"
        );

        // I don't think I can easily send arrays to the server using a form, so I 
        // send the form as an object, and reformat it here for the checkUserGameInfo function
        let body = req.body;
        let userGameInfo = [];
        for(const elem in body){
            userGameInfo.push({field_name: elem, value: body[elem]});
        }
        const game = await games.getGameById(gameId);
        userGameInfo = checkUserGameInfo(userGameInfo, game, "Game form POST route");
        const result = await users.addGame(req.session.user._id, gameId, userGameInfo);
        if (!result || !result.gameAdded) {
            return res.status(500).render("error", {
            status: 500,
            error_message: "Internal Server Error"
            });
        }
        return res.redirect("/users/" + req.session.user._id);
        


    } catch (error) {
      return res.status(error.status).render("error", {
        status: error.status,
        error_message: `${error.function}: ${error.error}`,
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