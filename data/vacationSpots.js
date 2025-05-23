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
    description,
    isApproved
){  
    if (!name || !description || !city || !region || !country || !continent) {
        throw ('ERROR: Missing required fields.');
    }
    if(typeof(isApproved) !== 'boolean'){
        throw "Approved Var needs to be bool"
    }
    const stringFields = {name, description, city, region, country, continent};
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
        isApproved,
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
//for leaderboard purposes, isApproved checks if admin has approved or not
async getAllApprovedLocations() {
    const locationCol = await vacationSpots();
    let locationList = await locationCol.find({isApproved: true}).toArray();
    if (!locationList){
        throw ('ERROR: could not get all locations');
    }
    locationList = locationList.map((element) => {
        element._id = element._id.toString();
        return element;
    });
    
    return locationList;
},
async getAllUnapprovedLocations() {
    const locationCol = await vacationSpots();
    let locationList = await locationCol.find({isApproved: false}).toArray();
    if (!locationList){
        throw ('ERROR: could not get all locations');
    }
    locationList = locationList.map((element) => {
        element._id = element._id.toString();
        return element;
    });
    
    return locationList;
},
async updateLocation(
    locationId,
    name,
    city,
    region,
    country,
    continent,
    description,
    isApproved
) {
    if (!locationId || !name || !description || !city || !region || !country || !continent) {
        throw ('ERROR: Missing required fields.');
    }
    if(typeof(isApproved) !== 'boolean'){
        throw "Approved Var needs to be bool"
    }
    const stringFields = {locationId, name, description, city, region, country, continent};
    for (const [key, value] of Object.entries(stringFields)) {
        if (typeof value !== 'string' || value.trim().length === 0) {
            throw ('ERROR: string inputs must be a non-empty string');
        }
    }
    name = name.trim();
    description = description.trim();
    city = city.trim();
    region = region.trim();
    continent = continent.toLowerCase().trim();
    const continents = [
        'africa',
        'antarctica',
        'asia',
        'europe',
        'north america',
        'south america',
        'australia'
    ];
    if (!(continents.includes(continent))) {
        throw "Continent not correct!"
    }

    const locationCol = await vacationSpots();
    const location = await locationCol.findOne({_id: new ObjectId(locationId)});

    const updatedLocation = {
        name,
        city,
        region,
        country,
        continent,
        isApproved,
        rank: location.rank,
        description,
        foodRating,
        safetyRating,
        activityRating,
        overallRating,
        reviews: location.reviews
    }

    
    const updatedInfo = await locationCol.findOneAndUpdate({_id: new ObjectId(locationId)}, {$set: updatedLocation}, {returnDocument: 'after'});

    if (!updatedInfo) {
      throw ('ERROR: could not update location successfully');
    }
  
    updatedInfo._id = updatedInfo._id.toString();
  
    return updatedInfo;

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
},

async getTopSpots(limit = 6) {
    if (!limit || typeof limit !== 'number') throw 'Limit must be a number';
    const col = await vacationSpots();
    const spots = await col.find({}).sort({overallRating: -1}).limit(limit).toArray();
    return spots;
},

recommendationScore(location) {
    //  weighted average 
    return 0.4 * location.foodRating + 0.4 * location.activityRating + 0.2 * location.safetyRating;
},

async getRecommendationsById(id) {
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

    const location = await this.getLocationById(id);
    const recommendationScore = this.recommendationScore(location);

    let allLocations = await this.getAllApprovedLocations();
    allLocations = allLocations.filter(loc => loc._id.toString() !== id);

    const sorted = allLocations.sort((a, b) => {
        const diffA = Math.abs(recommendationScore - this.recommendationScore(a._id.toString()));
        const diffB = Math.abs(recommendationScore - this.recommendationScore(b._id.toString()));

        return diffA - diffB; 
    });

    return sorted.slice(0, 3);
},
async addQuestionToSpot(spotId, qaObj) {
    if (!spotId || typeof spotId !== 'string') {
        throw 'Invalid spot ID';
    }
    if (!qaObj || typeof qaObj.question !== 'string') {
        throw 'Invalid question';
    }

    if(qaObj.question.length < 3){
        throw "Too short of a question."
    }
    if(qaObj.question.length > 500){
        throw "Too long of a question."
    }

    const questionId = new ObjectId();

    const newQuestion = {
        _id: questionId,
        question: qaObj.question,
        userId: qaObj.userId,
        answer: null
    };

    const spotCollection = await vacationSpots();
    const updateInfo = await spotCollection.updateOne(
        { _id: new ObjectId(spotId) },
        { $push: { qas: newQuestion } }
    );

    if (updateInfo.modifiedCount === 0) {
        throw 'Could not add question';
    }

    return { inserted: true, questionId: questionId.toString() };
},
async addAnswerToQuestion(spotId, questionId, answerText, userId) {
    if (!ObjectId.isValid(spotId) || !ObjectId.isValid(questionId)) {
        throw 'Invalid spot ID or question ID';
    }
    if (!answerText || typeof answerText !== 'string' || answerText.trim().length === 0) {
        throw 'Invalid answer text';
    }
    if (!userId || typeof userId !== 'string') {
        throw 'Invalid user ID';
    }

    if(answerText.length < 3){
        throw "Too short of a answer."
    }
    if(answerText.length > 500){
        throw "Too long of a answer."
    }

    const spotCollection = await vacationSpots();
    const updateInfo = await spotCollection.updateOne(
        { _id: new ObjectId(spotId), "qas._id": new ObjectId(questionId) },
        { 
          $set: { 
            "qas.$.answer": answerText.trim(),
            "qas.$.answeredBy": userId
          }
        }
    );

    if (updateInfo.modifiedCount === 0) {
        throw 'Failed to add answer to the question';
    }

    return true;
}

    
}
export default exportedMethods;
