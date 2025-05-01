import {Router} from 'express';
const router = Router();
import {leaderboardData} from '../data/index.js';
import {vacationSpotData} from '../data/index.js';

router
    .route('/')
    .get(async (req,res) => {
        console.log('request received');
        try{
            const leadData = await vacationSpotData.getAllLocations();
            if(!leadData){
                throw "couldn't load locations"
            }
            console.log(JSON.stringify(leadData))
            console.log("hello world")
            res.render('leaderboard/leaderboard', {posts: leadData});
        }catch(e){
            res.render('error', {error: e})
        }
        
    });

export default router;