import {Router} from 'express';
import {checkString} from '../helpers.js';


const router = Router();

router.route('/')
    .get()
    .post()

router.route('/:id')
    .get()
    .post()

router.route('/:id/friends')
    .get()
    .post()

export default router;