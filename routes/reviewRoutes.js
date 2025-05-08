import {Router} from 'express';
const router = Router();
import {reviewData} from '../data/index.js';
import {commentData} from '../data/index.js';
import {vacationSpotData} from '../data/index.js';
import {ObjectId} from 'mongodb';

router
    .route('/')
    .get(async (req,res) => {
        //sample code
        res.redirect('homepage');
    });
router.route('/createpost')
.get(async(req,res) => {
    try{
    if(!req.session.user){
        return res.redirect('/leaderboard');
    }
    let isAdmin = false;
    if (req.session.user && req.session.user.role === 'admin') {
        isAdmin = true;    
        res.render('review/createpost')  
    }else{
    res.redirect('/leaderboard');
    }
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
router.route('/createreview/:id')
.get(async(req,res) => {
    try{
        //CreateReview only accessible by ID now, use params.id to get the spot the review is for
        const spotId = req.params.id;
        const spotData = await vacationSpotData.getLocationById(spotId);
        //Pass in user and spot data to the handlebar so the signed in user doesn't need to manually input anything
        res.render('review/createreview', {user: req.session.user, spot: spotData})
    }catch(e){
        res.status(404).render('error', {error: e})
    }
})
//make a new review
.post(async(req, res) => {
    const regBody = req.body;
    try{
        if(!req.session.user){
            throw "You have to be signed in to post review";
        }
        //Make sure the id is valid of the user
        if(!req.params.id || !ObjectId.isValid(req.params.id)){
            throw "Invalid locationId"
        }
        //Use req.session.user.userId for the data function and req.params.id for the locationId
        const makeSpot = await reviewData.createReview(req.params.id, req.session.user.userId, regBody.foodRating, regBody.safetyRating, regBody.activityRating, regBody.overallRating,regBody.review);
        if(!makeSpot){
            throw "couldn't create location"
        }
        
        res.redirect(`/vacation/${req.params.id}`);
    }catch(e){
        res.status(404).render('error', {error: e})
    }
})
router
    .route('/:id')
    .get(async (req,res) => {
        try{
        //sample code
        const getReview = await reviewData.getReviewById(req.params.id);
        
        //getReview._id = getReview._id.toString();
        console.log(getReview.comments);
        res.render('review/review', {review: getReview, comments: getReview.comments});
        }catch(e){
            res.status(404).render('error', {error: e})
        }
    })
router.route('/:id/comment')
.post(async(req, res) => {
    const regBody = req.body;
    const reviewId = req.params.id;
    try{
        if(!req.session.user){
            throw "You have to be signed in to post a comment";
        }
       
        if(!reviewId|| !ObjectId.isValid(reviewId)){
            throw "Invalid review ID"
        }
        
        const makeComment = await commentData.createComment(reviewId, req.session.user.userId, regBody.comment);
        if(!makeComment){
            throw "couldn't create comment"
        }
        
        res.redirect(`/review/${req.params.id}`);
    }catch(e){
        res.status(404).render('error', {error: e})
    }
});
export default router;