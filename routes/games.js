import {Router} from 'express';
import {checkString} from '../helpers.js';
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
                title: "Games List"
            });
        } catch (error) {
            return res.send(error);
        }
    })
    .post()

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
            return res.status(404).redirect("/error");
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
            return res.send(error);
        }
    })
    .post()

export default router;