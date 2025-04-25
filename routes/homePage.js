import {Router} from 'express';
const router = Router();


router
    .route('/')
    .get(async (req,res) => {
        console.log('request received');
        //sample code
        res.render('partials/homepage', {sample: 'hello'});
    });

export default router;