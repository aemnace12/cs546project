import {vacationSpots} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

const exportedMethods = {
// admins are able to create vacation spots
async createSpot(
    location,
    name,
    description
){  

    if (!location || !name || !description) {
        throw ('ERROR: Missing required fields.');
    }
    const stringFields = { location, name, description };
    for (const [key, value] of Object.entries(stringFields)) {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw ('ERROR: string inputs must be a non-empty string');
        }
    }
    location = location.trim();
    name = name.trim();
    description = description.trim();

    let reviews = [];
    let foodRating = 0;
    let safetyRating = 0;
    let activityRating = 0;
    let overallRating = 0;

    const newPost = {
        location,
        name,
        // rank,            // created spot will start with lowest rank
        description,
        foodRating,
        safetyRating,
        activityRating,
        overallRating,
        reviews
    }

    return newPost;
}
}
export default exportedMethods;
