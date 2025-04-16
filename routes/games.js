import {Router} from 'express';
import {checkString} from '../helpers.js';


const router = Router();

router.route('/')
    .get()
    .post()

router.route('/list')
    .get()
    .post()

router.route('/:id')
    .get()
    .post()

router.route('/:id/form')
    .get()
    .post()

export default router;