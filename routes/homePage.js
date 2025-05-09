import {Router} from 'express';
const router = Router();


router
    .route('/')
    .get(async (req,res) => {
        res.render('partials/homepage');
    });

export default router;