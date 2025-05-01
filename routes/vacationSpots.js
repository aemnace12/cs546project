// make route for posting vacationSpots
import {Router} from 'express';
const router = Router();
import {vacationSpotData} from '../data/index.js';

router
    .route('/')
    .get(async (req,res) => {
        console.log('request received');
        //sample code
        
    });
//see specific vacation spot with data
router.route('/:id')
.get(async (req,res) => {
    try{
        console.log("in here")
        const spotData = await vacationSpotData.getLocationById(req.params.id)
        res.render('vacation/vacation', {spot: spotData});
    }catch(e){
        res.status(404).render('error', {error: e})
    }
})


export default router;