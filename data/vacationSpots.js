import {vacationSpots} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';

const exportedMethods = { // hello
    async createPost(
        location,
        name,
        rank,
        description,
        traditions,
        foodRating,
        safetyRating,
        activityRating,
        overallRating
    ){
        const newPost = {
            location: location,
            name: name,
            rank: rank,
            description: description,
            traditions: traditions,
            foodRating: foodRating,
            safetyRating: safetyRating,
            activityRating: activityRating,
            overallRating: overallRating
        }

        return newPost;
    }
}
export default exportedMethods;
