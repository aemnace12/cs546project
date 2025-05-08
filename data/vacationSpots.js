import {vacationSpots} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

const exportedMethods = {
// admins are able to create vacation spots
async createLocation(
    name,
    city,
    region,
    country,
    continent,
    description
){  
    if (!name || !description || !city || !region || !continent) {
        throw ('ERROR: Missing required fields.');
    }
    const stringFields = {name, description, city, region, continent};
    for (const [key, value] of Object.entries(stringFields)) {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw ('ERROR: string inputs must be a non-empty string');
        }
    }
    name = name.trim();
    description = description.trim();
    city = city.trim();
    region = region.trim();
    continent = continent.trim();

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
    let reviews = [];
    let foodRating = 0;
    let safetyRating = 0;
    let activityRating = 0;
    let overallRating = 0;

    const locationList = await this.getAllLocations();
    let rank = locationList.length + 1;

    const newLocation = {
        name,
        city,
        region,
        country,
        continent,
        rank,
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
    const returnLocation = await this.getLocationById(newId);

    return returnLocation;
},
async getLocationByContinent(continent){
    const locationCol = await vacationSpots();
    //TODO finish later for leaderboard
},
async getAllLocations() {
  const locationCol = await vacationSpots();
  let locationList = await locationCol.find({}).toArray();
  if (!locationList){
      throw ('ERROR: could not get all locations');
  }
  locationList = locationList.map((element) => {
      element._id = element._id.toString();
      return element;
  });
  
  return locationList;
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
        throw ('ERROR: No location with that id');
    }
    location._id = location._id.toString();

    return location;
}
}
export default exportedMethods;
