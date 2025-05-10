import {Router} from 'express';
const router = Router();
import {reviewData} from '../data/index.js';
import {commentData} from '../data/index.js';
import {vacationSpotData} from '../data/index.js';
//import {toggleLike, toggleDislike} from '../data/reviews.js';
import {ObjectId} from 'mongodb';
import validation from '../validation.js'
import xss from 'xss';

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
//create a unique vacation spot
.post(async(req, res) => {
    const regBody = req.body;
    try{
        if (!regBody.name || !regBody.description || !regBody.city || !regBody.region || !regBody.country || !regBody.continent) {
            throw ('ERROR: Missing required fields.');
        }

        const name = validation.checkString(xss(regBody.name), 'name');
        const description = validation.checkString(xss(regBody.description), 'description');
        const city = validation.checkString(xss(regBody.city), 'city');
        const region = validation.checkString(xss(regBody.region), 'region');
        const country = validation.checkString(xss(regBody.country), 'country');
        const continent = validation.checkString(xss(regBody.continent), 'continent');
    

    
        const continents = [
            'africa',
            'antarctica',
            'asia',
            'europe',
            'north america',
            'south america',
            'australia'
        ];
        
        if (!(continents.includes(continent.toLowerCase()))) {
            throw "Continent not correct!"
        }
        continent=continent.toLowerCase();
        const makeSpot = await vacationSpotData.createLocation(
            name,
            city,
            region,
            country,
            continent,
            description,
            true  //BECAUSE ADMIN APPROVED REQUEST
          )
        if(!makeSpot){
            throw "couldn't create location"
        }
        res.redirect('/leaderboard')
    }catch(e){
        res.status(404).render('error', {error: e})
    }
})

router.route('/requestpost')
.get(async(req,res) => {
    try{
    if(!req.session.user){
        return res.redirect('/leaderboard');
    }
    if (req.session.user.role === 'admin') {
        res.redirect('/leaderboard')  
    }else{
        res.render('review/requestpost')
    }
    }catch(e){
        res.status(404).render('error', {error: e})
    }
})
//request a review from admin
.post(async(req, res) => {
    const regBody = req.body;
    try{
        if (!regBody.name || !regBody.description || !regBody.city || !regBody.region || !regBody.country || !regBody.continent) {
            throw ('ERROR: Missing required fields.');
        }
        const name = validation.checkString(xss(regBody.name), 'name');
        const description = validation.checkString(xss(regBody.description), 'description');
        const city = validation.checkString(xss(regBody.city), 'city');
        const region = validation.checkString(xss(regBody.region), 'region');
        const country = validation.checkString(xss(regBody.country), 'country');
        let continent = validation.checkString(xss(regBody.continent), 'continent');
        const continents = [
            'africa',
            'antarctica',
            'asia',
            'europe',
            'north america',
            'south america',
            'australia'
        ];
        
        if (!(continents.includes(continent.toLowerCase()))) {
            throw "Continent not correct!"
        }
        continent=continent.toLowerCase();
        const makeSpot = await vacationSpotData.createLocation(
            name,
            city,
            region,
            country,
            continent,
            description,
            false //BECAUSE IT IS REQUEST ADMIN DID NOT APPROVE
          )
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
        if(!req.params.id || typeof(req.params.id) !== "string" || !ObjectId.isValid(req.params.id)){
            throw "Invalid locationId"
        }

        let locationId = validation.checkId(xss(req.params.id), "locationId")
        let userId = validation.checkString(req.session.user.userId, "userId");
        let reviewText = validation.checkString(xss(regBody.review), 'review');
        let foodRating = xss(regBody.foodRating);
        let safetyRating = xss(regBody.safetyRating);
        let activityRating = xss(regBody.activityRating);
        let overallRating = xss(regBody.overallRating);
        const numberFields = { foodRating, safetyRating, activityRating, overallRating };
        for (const [key, value] of Object.entries(numberFields)) {
            const numValue = Number(value);
            if (isNaN(numValue)) {
                throw `ERROR: ${key} must be a valid number`;
            }
            if (numValue < 0 || numValue > 5) {
                throw `ERROR: ${key} must be between 0 and 5`;
            }
            //must be one decimal point
            const decimal = value.toString().split('.')[1];
            if (decimal && decimal.length > 1) {
                throw `ERROR: ${key} must have at most 1 decimal place`;
            }
            numberFields[key] = numValue;
        }
    
        //Make sure raintgs are stored as numbers in database
        foodRating = Number(foodRating)
        safetyRating = Number(safetyRating)
        activityRating = Number(activityRating)
        overallRating = Number(overallRating)
        if(reviewText.length < 3){
            throw "Too short of a review."
        }
        if(reviewText.length > 500){
            throw "Too long of a review."
        }
        //Use req.session.user.userId for the data function and req.params.id for the locationId
        const makeSpot = await reviewData.createReview(
            locationId,
            userId,
            foodRating,
            safetyRating,
            activityRating,
            overallRating,
            reviewText
          );
        if(!makeSpot){
            throw "couldn't create location"
        }
        
        res.redirect(`/vacation/${locationId}`);
    }catch(e){
        res.status(404).render('error', {error: e})
    }
})
router
    .route('/:id')
    .get(async (req,res) => {
        try{
        const getReview = await reviewData.getReviewById(xss(req.params.id));
        console.log(getReview.comments);
        res.render('review/review', {review: getReview, comments: getReview.comments});
        }catch(e){
            res.status(404).render('error', {error: e})
        }
    })
router.route('/:id/comment')
.post(async(req, res) => {
    const regBody = req.body;
    let reviewId = xss(req.params.id);
    try{
        if(!req.session.user){
            res.redirect('/user/login')
        }
       
        if(!reviewId || !userId || !comment) {
            throw ('ERROR: Missing required fields.');
        }
        reviewId = validation.checkId(reviewId, "Review ID");
        userId = validation.checkString(userId, "User ID");
        comment = validation.checkString(comment, 'comment');
        if (comment.length > 500 || comment.length < 3) {
            throw 'Comment cannot be greater than 500 characters or less than 3 characters.';
          }
        
        const makeComment = await commentData.createComment(reviewId, req.session.user.userId, xss(regBody.comment));
        if(!makeComment){
            throw "couldn't create comment"
        }
        
        res.redirect(`/review/${req.params.id}`);
    }catch(e){
        res.status(404).render('error', {error: e})
    }
});

function _requireLogin(req, res, next) {
    if (!req.session.user) {
      return res.status(403).json({error: 'You must log in to vote'});
    }
    next();
}
  
router.post('/:id/like', _requireLogin, async (req, res) => {
    try {
      const updated = await reviewData.toggleLike(xss(req.params.id), req.session.user.userId);
      res.json({ likes: updated.likes, dislikes: updated.dislikes });
    } catch (e) {
      res.status(400).json({ error: e.toString() });
    }
});
  
router.post('/:id/dislike', _requireLogin, async (req, res) => {
    try {
      const updated = await reviewData.toggleDislike(xss(req.params.id), req.session.user.userId);
      res.json({ likes: updated.likes, dislikes: updated.dislikes });
    } catch (e) {
      res.status(400).json({ error: e.toString() });
    }
});
  
export default router;