import {Router} from 'express';
const router = Router();
import {leaderboardData} from '../data/index.js';
import {vacationSpotData} from '../data/index.js';

router
    .route('/')
    .get(async (req,res) => {
        console.log('request received');
        try{
            let leadData;
            const filterBy = req.query.filter;
            const filterContinent = req.query.continentFilter
            
            if (filterBy === "Food Rating") {
                leadData = await leaderboardData.sortByFoodRating();
            }
            else if (filterBy === "Safety Rating") {
                leadData = await leaderboardData.sortBySafetyRating();
            }
            else if (filterBy === "Activity Rating") {
                leadData = await leaderboardData.sortByActivityRating();
            }
            else if (filterBy === "Name") {
                leadData = await leaderboardData.sortByAlphabet();
            }
            else{
                leadData = await leaderboardData.sortByOverallRating();
            }
            if(filterContinent){
                leadData = await leaderboardData.getFilteredLocations(filterContinent, leadData);
            }

            if(!leadData){
                throw "couldn't load locations"
            }

            res.render('leaderboard/leaderboard', {posts: leadData, filterBy: filterBy || 'Overall Rating'});
        }catch(e){
            res.render('error', {error: e})
        }
        
    });

export default router;