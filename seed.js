//will be used to populate database more easily

import {dbConnection, closeConnection} from './config/mongoConnections.js';
import users from './data/users.js';
import posts from './data/vacationSpots.js';
import reviews from './data/reviews.js';
import comments from './data/comments.js';


const db = await dbConnection();
await db.dropDatabase();


try{
    //users
    //firstname, lastname, userId, password, role
    const adminUser = await users.createUser("John", "Doe", "admin", "Admin123!", "Admin123!", "admin")
    const normalUser = await users.createUser("Harry", "Styles", "normalUser", "User1234!", "User1234!", "user");

    //posts
    const nyc = await posts.createLocation("NYC", "New York City", "New York", "United States of America", "North America", "New York City is the economic capital of America.", true)
    const paris = await posts.createLocation("Paris", "Paris", "Île-de-France", "France", "Europe", "Paris is the capital of France, known for its art, architecture, cuisine, and landmarks like the Eiffel Tower.", true);
    const bali = await posts.createLocation("Bali", "Bali", "Bali", "Indonesia", "Asia", "Bali is known for its forested volcanic mountains and beaches.", true);
    const tokyo = await posts.createLocation("Tokyo", "Tokyo Metropolis", "Kantō", "Japan", "Asia", "Tokyo blends modern skyscrapers with historic temples.", true);
    const sydney = await posts.createLocation("Sydney", "Sydney", "New South Wales", "Australia", "Australia", "Sydney is famous for its Opera House and harbor.", true);
    const rome = await posts.createLocation("Rome", "Roma", "Lazio", "Italy", "Europe", "Rome is the eternal city with ancient ruins and art.", true);
    const london = await posts.createLocation("London", "London", "England", "United Kingdom", "Europe", "London offers iconic landmarks and diverse culture.", true);
    const capeTown = await posts.createLocation("Cape Town", "Cape Town", "Western Cape", "South Africa", "Africa", "Cape Town features Table Mountain and beautiful coastlines.", true);
    const rio = await posts.createLocation("Rio de Janeiro", "Rio de Janeiro", "Rio de Janeiro", "Brazil", "South America", "Rio is known for its Carnival, beaches, and Christ the Redeemer.", true);
    const dubai = await posts.createLocation("Dubai", "Dubai", "Dubai Emirate", "United Arab Emirates", "Asia", "Dubai is famous for its futuristic skyscrapers and luxury shopping.", true);
    const santorini = await posts.createLocation("Santorini", "Santorini", "South Aegean", "Greece", "Europe", "Santorini dazzles with whitewashed buildings and stunning sunsets.", true);
    const machuPicchu = await posts.createLocation("Machu Picchu", "Machu Picchu", "Cusco Region", "Peru", "South America", "Machu Picchu is an ancient Incan citadel set high in the Andes.", true);
    //to-be-approved posts 
    const barcelona = await posts.createLocation("Barcelona", "Barcelona", "Catalonia", "Spain", "Europe", "Barcelona is known for its art, architecture, and works like the Sagrada Família.", false);
    const cairo = await posts.createLocation("Cairo", "Cairo", "Cairo Governorate", "Egypt", "Africa", "Cairo is famous for the nearby Pyramids of Giza and ancient Egyptian history.", false);
    //reviews
    const nycReview = await reviews.createReview(nyc._id, adminUser.userId, 5, 4, 3, 4.5, "I loved nyc but I felt like it didn't live up to expectations")
    const parisReview = await reviews.createReview(paris._id, normalUser.userId, 3, 3, 5, 4, "I liked paris but I felt like it didn't live up to expectations")
    const baliReview = await reviews.createReview(bali._id, normalUser.userId, 5, 5, 4, 4.7, "Bali offers a perfect blend of relaxation and adventure.");
    const tokyoReview = await reviews.createReview(tokyo._id, adminUser.userId, 4, 3, 5, 4.2, "Tokyo's energy is unmatched, and the food is incredible!");
    const sydneyReview = await reviews.createReview(sydney._id, normalUser.userId, 5, 4, 3, 4.0, "Sydney's harbor and beaches are absolutely breathtaking.");
    const romeReview = await reviews.createReview(rome._id, adminUser.userId, 4, 3, 4, 3.8, "Rome's history and architecture blew me away.");
    const londonReview = await reviews.createReview(london._id, normalUser.userId, 3, 4, 4, 3.9, "London has rich culture, though it was a bit pricey.");
    const capeTownReview = await reviews.createReview(capeTown._id, adminUser.userId, 5, 4, 3, 4.3, "Cape Town's landscape is stunning, with friendly locals.");
    const rioReview = await reviews.createReview(rio._id, normalUser.userId, 4, 5, 3, 4.1, "Rio's carnival atmosphere and beaches are unforgettable.");
    const dubaiReview = await reviews.createReview(dubai._id, adminUser.userId, 5, 2, 3, 3.7, "Dubai is luxurious but felt too artificial at times.");
    const santoriniReview = await reviews.createReview(santorini._id, normalUser.userId, 5, 5, 4, 4.8, "Santorini's views and sunsets are absolutely magical.");
    const machuPicchuReview = await reviews.createReview(machuPicchu._id, adminUser.userId, 4, 4, 5, 4.3, "Machu Picchu is a bucket-list experience with amazing views.");


    //comments?
    const nycComment = await comments.createComment(nycReview._id.toString(), normalUser.userId, "I agree with you! I loved NYC too!");
    const parisComment = await comments.createComment(parisReview._id.toString(), adminUser.userId, "I disagree with you! I hated Paris!");
    const baliComment = await comments.createComment(baliReview._id.toString(), normalUser.userId, "Neat!");
    const tokyoComment = await comments.createComment(tokyoReview._id.toString(), adminUser.userId, "Interesting!");
    const sydneyComment = await comments.createComment(sydneyReview._id.toString(), normalUser.userId, "Wow!!");
    const romeComment = await comments.createComment(romeReview._id.toString(), adminUser.userId, "Do you have photos!?");
    const londonComment = await comments.createComment(londonReview._id.toString(), normalUser.userId, "Cool wow!");
    const capeTownComment = await comments.createComment(capeTownReview._id.toString(), adminUser.userId, "I want to go there!");
    const rioComment = await comments.createComment(rioReview._id.toString(), normalUser.userId, "Neato!");
    const dubaiComment = await comments.createComment(dubaiReview._id.toString(), adminUser.userId, "Wow So cool!");
    const santoriniComment = await comments.createComment(santoriniReview._id.toString(), normalUser.userId, "I agree with you! I loved Santorini too!");
    const machuPicchuComment = await comments.createComment(machuPicchuReview._id.toString(), adminUser.userId, "I disagree with you! I hated Machu Picchu!");


    
    //likes
    
}catch(e){
    console.log(e);
}

console.log('Done seeding database');
await closeConnection();