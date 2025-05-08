//will be used to populate database more easily

import {dbConnection, closeConnection} from './config/mongoConnections.js';
import users from './data/users.js';
import posts from './data/vacationSpots.js';
import reviews from './data/reviews.js';


const db = await dbConnection();
await db.dropDatabase();


try{
    //users
    //firstname, lastname, userId, password, role
    const adminUser = await users.createUser("John", "Doe", "admin", "Admin123!", "admin")
    const normalUser = await users.createUser("Harry", "Styles", "normalUser", "User1234!", "user");

    //posts
    const nyc = await posts.createLocation("New York City, New York, USA", "NYC", "New York City is the economic capital of America.")
    const paris = await posts.createLocation("Paris, Île-de-France, Italy", "Paris", "Paris is the capital of France, known for its art, architecture, cuisine, and landmarks like the Eiffel Tower.")
    //reviews
    const nycReview = await reviews.createReview(nyc._id, adminUser.userId, 5, 4, 3, 4.5, "I loved nyc but I felt like it didn't live up to expectations")
    const parisReview = await reviews.createReview(paris._id, normalUser.userId, 3, 3, 5, 4, "I liked paris but I felt like it didn't live up to expectations")

    //comments?

}catch(e){
    console.log(e);
}

console.log('Done seeding database');
await closeConnection();