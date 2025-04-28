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
            return res.render('game-list', {games: gamesList});
        } catch (error) {
            return res.send(error);
        }
    })
    .post()

router.route('/:id')
    .get(async (req, res) => {
        try{
            if(!req.params.id){
                return res.status(400).json({error: "Invalid game id"});
            }
            const game = await games.getGameById(req.params.id);
            return res.render('game-page', {game: game});
        } catch (error) {
            return res.send(error);
        }
    })
    .post()

router.route('/:id/form')
    .get(async (req, res) => {
        try{
            if(!req.params.id){
                return res.status(400).json({error: "Invalid game id"});
            }
            const game = await games.getGameById(req.params.id);
            return res.render('game-form', {game: game});
        } catch (error) {
            return res.send(error);
        }
    })
    .post()

export default router;