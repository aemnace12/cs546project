import {vacationSpots} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

const exportedMethods = {
async createReview (
    locationId,
    userId,
    foodRating,
    safetyRating,
    activityRating,
    overallRating,
    review
) {
    //Basic error checking
    if (!locationId || !userId || !foodRating || !safetyRating || !activityRating || !overallRating || !review) {
        throw ('ERROR: Missing required fields.');
    }
    const stringFields = { locationId, userId, review };
    for (const [key, value] of Object.entries(stringFields)) {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw ('ERROR: string inputs must be a non-empty string');
        }
    }
    //Updated error checking function to ensure valid ratings
    const numberFields = { foodRating, safetyRating, activityRating, overallRating };
    for (const [key, value] of Object.entries(numberFields)) {
        const numValue = Number(value);
        if (isNaN(numValue)) {
            throw `ERROR: ${key} must be a valid number`;
        }
        if (numValue < 0 || numValue > 5) {
            throw `ERROR: ${key} must be between 0 and 5`;
        }
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
    locationId = locationId.trim();
    const locationCol = await vacationSpots();
    const location = await locationCol.findOne({_id: new ObjectId(locationId)});
    if(!locationId || !location){
        throw "ERROR: invalid location ID"
    }
    userId = userId.trim();
    review = review.trim();
    if (!ObjectId.isValid(locationId)) {
        throw ('ERROR: invalid location object ID');
    }

    let comments = [];
    const newReview = {
        _id: new ObjectId(),
        locationId,
        userId,
        foodRating,
        safetyRating,
        activityRating,
        overallRating,
        review,
        comments
    }
    //If reviews don't exist/empty, then make it empty array
    const reviewArray = location.reviews || [];
    const reviewNum = reviewArray.length;
    
    //Initialize Food Ratings
    let updatedFoodRating = 0;
    let updatedsafetyRating = 0;
    let updatedActivityRating = 0;
    let updatedOverallRating = 0;
    
    if (reviewNum === 0) {
        // If no reviews yet, just use this new review’s ratings directly
        updatedFoodRating = Number(foodRating);
        updatedsafetyRating = Number(safetyRating);
        updatedActivityRating = Number(activityRating);
        updatedOverallRating = Number(overallRating);
    } else {
        // Sum existing ratings from reviews array
        let totalFoodRating = 0;
        let totalSafetyRating = 0;
        let totalActivityRating = 0;
        let totalOverallRating = 0;
    
        for (let rev of reviewArray) {
            //Make sure all ratings are Number values and add to overall to give more refined result
            totalFoodRating += Number(rev.foodRating);
            totalSafetyRating += Number(rev.safetyRating);
            totalActivityRating += Number(rev.activityRating);
            totalOverallRating += Number(rev.overallRating);
        }
        //Updated Ratings calculations
        updatedFoodRating = (totalFoodRating + Number(foodRating)) / (reviewNum + 1);
        updatedsafetyRating = (totalSafetyRating + Number(safetyRating)) / (reviewNum + 1);
        updatedActivityRating = (totalActivityRating + Number(activityRating)) / (reviewNum + 1);
        updatedOverallRating = (totalOverallRating + Number(overallRating)) / (reviewNum + 1);
    }
    
    // Round to 1 decimal
    updatedFoodRating = Math.trunc(updatedFoodRating * 10) / 10;
    updatedsafetyRating = Math.trunc(updatedsafetyRating * 10) / 10;
    updatedActivityRating = Math.trunc(updatedActivityRating * 10) / 10;
    updatedOverallRating = Math.trunc(updatedOverallRating * 10) / 10;
    const updatedInfo = await locationCol.findOneAndUpdate(
        {_id: new ObjectId(locationId)}, 
        {
            $push: {reviews: newReview}, 
            $set: {foodRating: updatedFoodRating},
            $set: {safetyRating: updatedsafetyRating},
            $set: {activityRating: updatedActivityRating},
            $set: {overallRating: updatedOverallRating}
        }, 
        {returnDocument: 'after'}
    );

    if (!updatedInfo) {
        throw ('ERROR: could not insert review successfully');
    }

    return newReview;
},

async updateReview (
    reviewId,
    locationId,
    userId,
    foodRating,
    safetyRating,
    activityRating,
    overallRating,
    review
) {
    if (!reviewId || !locationId || !userId || !foodRating || !safetyRating || !activityRating || !overallRating || !review) {
        throw ('ERROR: Missing required fields.');
    }
    const stringFields = { reviewId, locationId, userId, review };
    for (const [key, value] of Object.entries(stringFields)) {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw ('ERROR: string inputs must be a non-empty string');
        }
    }
    const numberFields = { foodRating, safetyRating, activityRating, overallRating };
    for (const [key, value] of Object.entries(numberFields)) {
        if (typeof value !== 'number') {
            throw ('ERROR: ratings must be a number');
        }
        if (value < 0 && value > 5){
            throw ('ERROR: invalid rating (0 - 5)');
        }
    }
    reviewId = reviewId.trim();
    locationId = locationId.trim();
    userId = userId.trim();
    review = review.trim();
    if (!ObjectId.isValid(reviewId)) {
        throw ('ERROR: invalid review object ID');
    }
    if (!ObjectId.isValid(locationId)) {
        throw ('ERROR: invalid location object ID');
    }
    if (!ObjectId.isValid(userId)) {
        throw ('ERROR: invalid user object ID');
    }

    const locationCol = await vacationSpots();
    const location = await locationCol.findOne({_id: new ObjectId(locationId)});
    const reviewArray = location.reivews;
    let updatedFoodRating = 0;
    let updatedsafetyRating = 0;
    let updatedActivityRating = 0;
    let updatedOverallRating = 0;
    for (let i = 0; i < reviewArray.length; i++){
        if (reviewArray[i]._id !== reviewId){
            updatedFoodRating += reviewArray[i].foodRating;
            updatedsafetyRating += reviewArray[i].safetyRating;
            updatedActivityRating += reviewArray[i].activityRating;
            updatedOverallRating += reviewArray[i].overallRating;
        }
    }
    updatedFoodRating = (updatedFoodRating + foodRating) / (reviewArray.length);
    updatedFoodRating = Math.trunc(updatedFoodRating * 10) / 10;

    updatedsafetyRating = (updatedsafetyRating + safetyRating) / (reviewArray.length);
    updatedsafetyRating = Math.trunc(updatedsafetyRating * 10) / 10;

    updatedActivityRating = (updatedActivityRating + activityRating) / (reviewArray.length);
    updatedActivityRating = Math.trunc(updatedActivityRating * 10) / 10;

    updatedOverallRating = (updatedOverallRating + overallRating) / (reviewArray.length);
    updatedOverallRating = Math.trunc(updatedOverallRating * 10) / 10;

    const updatedReview = {
        locationId,
        userId,
        foodRating: updatedFoodRating,
        safetyRating: updatedsafetyRating,
        activityRating: updatedActivityRating,
        overallRating: updatedOverallRating,
        review,
    }

    const updatedInfo = await locationCol.findOneAndUpdate({_id: new ObjectId(locationId)}, {$set: updatedReview}, {returnDocument: 'after'});

    if (!updatedInfo) {
        throw ('ERROR: could not update review successfully');
    }

    updatedInfo._id = updatedInfo._id.toString();

    return updatedInfo;
},

async getReviewById (reviewId) {
    if (!reviewId){
        throw ('ERROR: You must provide an id to search for');
    }
    if (typeof reviewId !== 'string'){
        throw ('ERROR: Id must be a string');
    }
    if (reviewId.trim().length === 0){
        throw ('ERROR: id cannot be an empty string or just spaces');
    }
    reviewId = reviewId.trim();
    if (!ObjectId.isValid(reviewId)){
        throw ('ERROR: invalid review object ID');
    }
    const locationCol = await vacationSpots();
    const location = await locationCol.findOne({"reviews._id": new ObjectId(reviewId)});
    if (!location) {
        throw ('ERROR: could not find review with given id');
    }
    review._id = reviewId.toString();

    return review;
},


async removeReview (reviewId) {
    if (!reviewId){
        throw ('ERROR: You must provide an id to search for');
    }
    if (typeof reviewId !== 'string'){
        throw ('ERROR: Id must be a string');
    }
    if (reviewId.trim().length === 0){
        throw ('ERROR: id cannot be an empty string or just spaces');
    }
    reviewId = reviewId.trim();
    if (!ObjectId.isValid(reviewId)){
        throw ('ERROR: invalid review object ID');
    }

    const locationCol = await vacationSpots();
    const location = await locationCol.findOne({"reviews._id": new ObjectId(reviewId)});
    if (!location) {
        throw ('ERROR: could not find review with given id');
    }
    const deletedReview = location.reviews.find(review => review._id.toString() === reviewId);
    const deletedFoodRating = deletedReview.foodRating;
    const deletedSafetyRating = deletedReview.safetyRating;
    const deletedActivityRating = deletedReview.activityRating;
    const deletedOverallRating = deletedReview.overallRating;
    const deletionInfo = await locationCol.updateOne({"reviews._id": new ObjectId(reviewId)}, {$pull: {reviews: {_id: new ObjectId(reviewId)}}});

    if (!deletionInfo) {
        throw ('ERROR: could not delete review with given id');
    }

    const reviewArray = location.reviews;
    let updatedFoodRating = 0;
    let updatedsafetyRating = 0;
    let updatedActivityRating = 0;
    let updatedOverallRating = 0;
    if (reviewArray.length - 1 > 0){
        for (let i = 0; i < reviewArray.length; i++){
            updatedFoodRating += reviewArray[i].foodRating;
            updatedsafetyRating += reviewArray[i].safetyRating;
            updatedActivityRating += reviewArray[i].activityRating;
            updatedOverallRating += reviewArray[i].overallRating;
        }
        updatedFoodRating = (updatedFoodRating - deletedFoodRating) / (reviewArray.length - 1);
        updatedFoodRating = Math.trunc(updatedFoodRating * 10) / 10;

        updatedsafetyRating = (updatedsafetyRating - deletedSafetyRating) / (reviewArray.length - 1);
        updatedsafetyRating = Math.trunc(updatedsafetyRating * 10) / 10;

        updatedActivityRating = (updatedActivityRating - deletedActivityRating) / (reviewArray.length - 1);
        updatedActivityRating = Math.trunc(updatedActivityRating * 10) / 10;

        updatedOverallRating = (updatedOverallRating - deletedOverallRating) / (reviewArray.length - 1);
        updatedOverallRating = Math.trunc(updatedOverallRating * 10) / 10;
    }

    const updatedInfo = await locationCol.findOneAndUpdate(
        {_id: new ObjectId(location._id)}, 
        {   
            $set: {foodRating: updatedFoodRating},
            $set: {safetyRating: updatedsafetyRating},
            $set: {activityRating: updatedActivityRating},
            $set: {overallRating: updatedOverallRating}
        }, 
        {returnDocument: 'after'}
    );

    if (!updatedInfo) {
        throw ('ERROR: could not update location successfully');
    }
    return updatedInfo;
}
};

export default exportedMethods;