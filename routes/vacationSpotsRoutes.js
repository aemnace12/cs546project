// make route for posting vacationSpots
import {Router} from 'express';
const router = Router();
import {vacationSpotData} from '../data/index.js';
import xss from 'xss';

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
        const spotData = await vacationSpotData.getLocationById(xss(req.params.id));
        const recommendations = await vacationSpotData.getRecommendationsById(xss(req.params.id));
        spotData._id = spotData._id.toString();
        res.render('vacation/vacation', {spot: spotData, recommendations: recommendations});
    }catch(e){
        res.status(404).render('error', {error: e})
    }
})

router.route('/qa/:id').post(async (req, res) => {
  try {
    const spotId = req.params.id;
    const questionText = xss(req.body.question);
    const userId = req.session.user?.userId;

    if (!userId) {
      return res.status(403).render('error', { error: 'You must be logged in to ask a question.' });
    }

    await vacationSpotData.addQuestionToSpot(spotId, {
      question: questionText,
      userId: userId,
      createdAt: new Date().toISOString()
    });

    res.redirect(`/vacation/${spotId}`);
  } catch (e) {
    res.status(500).render('error', { error: 'Failed to submit question.' });
  }
});



export default router;