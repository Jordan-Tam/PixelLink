import {Router} from 'express';
import {checkString, checkDateReleased, checkForm} from '../helpers.js';
import games from '../data/games.js';

const router = Router();

router.route('/')
    .get()
    .post()

router.route('/list')
    .get(async (req, res) => {
        try {
            const gamesList = await games.getAllGames();
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

router.route('/:id/form')
    .get(async (req, res) => {
        try{
            const id = checkString(req.params.id, 'Game id','GET game/:id/form');
            const game = await games.getGameById(id);
            return res.render('game-form', {
                game: game,
                title: `Add ${game.title} to profile`
            });
        } catch (error) {
            return res.status(error.status).render("error", {
                status: error.status,
                error_message: `${error.function}: ${error.error}`
            });
        }
    })
    .post()

export default router;