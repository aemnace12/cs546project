import {vacationSpotData} from '../data/index.js';

const exportedMethods = {
async getFilteredLocations(continent, currentData) {

  if(!currentData) throw "no data provided";
  if(typeof(currentData) !== "object") throw "wrong type of currentData";
  if (!continent) throw "Must supply continent";
  const validContinents = ['africa', 'antarctica', 'asia', 'europe', 'north america', 'australia', 'south america'];
  if(typeof(continent) !== "string" || continent.trim() == ""){
    throw "continent must be string with values"
  }
  continent = continent.trim().toLowerCase();
  if(continent === "world"){
    return currentData;
  }
  if (!validContinents.includes(continent)) {
    throw "continent name invalid"
  }

  const filteredLocations = currentData.filter(loc => loc.continent === continent);
  return filteredLocations;
},
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