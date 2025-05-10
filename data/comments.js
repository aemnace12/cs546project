import {vacationSpots} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

const exportedMethods = {
async createComment (
    reviewId,
    userId,
    comment
) {
    if (!reviewId || !userId || !comment) {
        throw ('ERROR: Missing required fields.');
    }
    const stringFields = { reviewId, userId, comment };
    for (const [key, value] of Object.entries(stringFields)) {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw ('ERROR: string inputs must be a non-empty string');
        }
    }
    reviewId = reviewId.trim();
    userId = userId.trim();
    comment = comment.trim();
    if (!ObjectId.isValid(reviewId)) {
        throw ('ERROR: invalid review object ID');
    }

    const newComment = {
        _id: new ObjectId(),
        reviewId,
        userId,
        comment
    }

    const locationCol = await vacationSpots();
    const location = await locationCol.findOne({"reviews._id": new ObjectId(reviewId)});

    if (!location) {
        throw ('ERROR: could not find review with given id');
    }
    //https://www.mongodb.com/docs/manual/reference/operator/update/positional/
    const updatedInfo = await locationCol.updateOne(
        { "reviews._id": new ObjectId(reviewId) },
        { $push: { "reviews.$.comments": newComment } }
      );
    if (!updatedInfo) {
        throw ('ERROR: could not insert comment successfully');
    }
    console.log(newComment);
    return newComment;
    
}
};

export default exportedMethods;