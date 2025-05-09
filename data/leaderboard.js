import {vacationSpotData} from '../data/index.js';

const exportedMethods = {
async sortByOverallRating(){
    const leadData = await vacationSpotData.getAllApprovedLocations();
    const sortedLocations = leadData.sort((a, b) => b.overallRating - a.overallRating);
    return sortedLocations;
},
async sortByFoodRating(){
    const leadData = await vacationSpotData.getAllApprovedLocations();
    const sortedLocations = leadData.sort((a, b) => b.foodRating - a.foodRating);
    return sortedLocations;
},
async sortBySafetyRating(){
    const leadData = await vacationSpotData.getAllApprovedLocations();
    const sortedLocations = leadData.sort((a, b) => b.safetyRating - a.safetyRating);
    return sortedLocations;
},
async sortByActivityRating(){
    const leadData = await vacationSpotData.getAllApprovedLocations();
    const sortedLocations = leadData.sort((a, b) => b.activityRating - a.activityRating);
    return sortedLocations;
}, 
async sortByAlphabet(){
    const leadData = await vacationSpotData.getAllApprovedLocations();
    const sortedLocations = leadData.sort((a, b) => a.name.localeCompare(b.name));
    return sortedLocations;
}
};
export default exportedMethods;