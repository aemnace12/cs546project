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
    if(req.session.user){
        return res.redirect('/leaderboard');
    }
    let isAdmin = false;
    if (req.session.user && req.session.user.role === 'admin') {
        isAdmin = true;      
        res.render('review/createpost')
    }
    return res.redirect('/leaderboard');
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
router.route('/createreview')
.get(async(req,res) => {
    try{
        res.render('review/createreview')
    }catch(e){
        res.status(404).render('error', {error: e})
    }
})
//make a new review
.post(async(req, res) => {
    const regBody = req.body;
    try{
        const makeSpot = await reviewData.createReview(regBody.locationName, regBody.userId, regBody.foodRating, regBody.safetyRating, regBody.activityRating, regBody.overallRating,regBody.review);
        if(!makeSpot){
            throw "couldn't create location"
        }
        res.redirect('/leaderboard')
    }catch(e){
        res.status(404).render('error', {error: e})
    }
})
export default router;