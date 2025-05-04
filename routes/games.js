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
            return res.status(error.status).render("error", {
                status: error.status,
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
            if(!req.session.user && !req.session.user.admin){
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
                game: game,
                title: game.title
            });
        } catch (error) {
            return res.status(error.status).render("error", {
                status: error.status,
                error_message: `${error.function}: ${error.error}`
            });
        }
    })
    .post()

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
        


      // console.log(form);
    } catch (error) {
      return res.status(error.status).render("error", {
        status: error.status,
        error_message: `${error.function}: ${error.error}`,
      });
    }
  });

export default router;