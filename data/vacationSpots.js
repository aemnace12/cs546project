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
    const locationCol = await vacationSpots();
    const insertInfo = await locationCol.insertOne(newLocation);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw ('ERROR: Could not add location');
    }

    const newId = insertInfo.insertedId.toString();
    const location = await this.getLocationById(newId);

    return location;
},

async getLocationById(id) {
    if (!id){
        throw ('ERROR: You must provide an id to search for');
    }
    if (typeof id !== 'string'){
        throw ('ERROR: Id must be a string');
    }
    if (id.trim().length === 0){
        throw ('ERROR: id cannot be an empty string or just spaces');
    }
    id = id.trim();
    if (!ObjectId.isValid(id)){
        throw ('ERROR: invalid object ID');
    }
    const locationCol = await vacationSpots();
    const location = await locationCol.findOne({_id: new ObjectId(id)});
    if (!location){
        throw ('ERROR: No movie with that id');
    }
    location._id = location._id.toString();

    return location;
}
}
export default exportedMethods;
