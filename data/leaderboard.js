import {vacationSpots} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

const exportedMethods = {
   async sortby(value){
    //https://www.geeksforgeeks.org/mongodb-sort-method/
    const locationCol = await vacationSpots();
    const locations = await locationCol.find().sort({[value]: -1});
    return locations;
    }
}
export default exportedMethods;