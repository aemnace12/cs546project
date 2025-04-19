import {vacationSpots} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

const exportedMethods = {
// admins are able to create vacation spots
async createLocation(
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

    const newLocation = {
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
    const spotsCol = await vacationSpots();
    const insertInfo = await spotsCol.insertOne(newLocation);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw ('ERROR: Could not add location');
    }

    return newLocation;
}
}
export default exportedMethods;
