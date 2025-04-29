import {Router} from 'express';
const router = Router();
import {reviewData} from '../data/index.js';
import {vacationSpotData} from '../data/index.js';

router
    .route('/')
    .get(async (req,res) => {
        console.log('request received');
        //sample code
        res.render('review/review', {sample: 'hello'});
    });
router.route('/createpost')
.get(async(req,res) => {
    try{
        res.render('review/createpost')
    }catch(e){
        res.status(404).render('error', {error: e})
    }
})
//make a new review
.post(async(req, res) => {
    const regBody = req.body;
    try{
        const makeSpot = await vacationSpotData.createLocation(regBody.location, regBody.name, regBody.description);
        if(!makeSpot){
            throw "couldn't create location"
        }
        res.redirect('/leaderboard')
    }catch(e){
        res.status(404).render('error', {error: e})
    }
})
export default router;