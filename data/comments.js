import {vacationSpots} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

const exportedMethods = {
async createComment (
    reviewId,
    userName,
    comment
) {
    if (!reviewId || !userName || !comment) {
        throw ('ERROR: Missing required fields.');
    }
    const stringFields = { reviewId, userName, comment };
    for (const [key, value] of Object.entries(stringFields)) {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw ('ERROR: string inputs must be a non-empty string');
        }
    }
    reviewId = reviewId.trim();
    userName = userName.trim();
    comment = comment.trim();
    if (!ObjectId.isValid(reviewId)) {
        throw ('ERROR: invalid review object ID');
    }

    const newComment = {
        _id: new ObjectId(),
        reviewId,
        userName,
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

    return newComment;
}
};

export default exportedMethods;