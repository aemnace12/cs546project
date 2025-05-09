import {vacationSpots} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

const exportedMethods = {
async sortByOverallRating(){
    const locationCol = await vacationSpots();
    sortedLocations = locationCol.sort((a, b) => b.overallRating - a.overallRating);
    return sortedLocations;
},
async sortByFoodRating(){
    const locationCol = await vacationSpots();
    sortedLocations = locationCol.sort((a, b) => b.foodRating - a.foodRating);
    return sortedLocations;
},
async sortBySafetyRating(){
    const locationCol = await vacationSpots();
    sortedLocations = locationCol.sort((a, b) => b.safetyRating - a.safetyRating);
    return sortedLocations;
},
async sortByActivityRating(){
    const locationCol = await vacationSpots();
    sortedLocations = locationCol.sort((a, b) => b.activityRating - a.activityRating);
    return sortedLocations;
}, 
async sortByAlphabet(){
    const locationCol = await vacationSpots();
    sortedLocations = locationCol.sort((a, b) => a.name.localeCompare(b.name));
    return sortedLocations;
}
};
export default exportedMethods;