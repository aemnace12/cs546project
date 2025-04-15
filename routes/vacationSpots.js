// make route for posting vacationSpots
import {Router} from 'express';
const router = Router();
import {vacationSpotData} from '../data/index.js';

router
    .route('/')
    .get(async (req,res) => {
        console.log('request received');
        //sample code
        res.render('partials/sample', {sample: 'hello'});
    });

export default router;