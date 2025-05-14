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

    if(questionText.length < 3){
        return res.status(403).render('error', { error: 'Too short of a question.' });
    }
    if(questionText.length > 500){
        return res.status(403).render('error', { error: 'Too long of a question.' });

    }

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

router.post('/qa/:spotId/answer/:questionId', async (req, res) => {
  try {
    const spotId = req.params.spotId;
    const questionId = req.params.questionId;
    const answerText = xss(req.body.answerText);
    const userId = req.session.user?.userId;

    if (!userId) {
      return res.status(403).render('error', { error: 'You must be logged in to answer questions.' });
    }
    
    if(answerText.length < 3){
        return res.status(403).render('error', { error: 'Too short of a answer.' });
    }
    if(answerText.length > 500){
        return res.status(403).render('error', { error: 'Too long of a answer.' });
    }

    await vacationSpotData.addAnswerToQuestion(spotId, questionId, answerText, userId);

    return res.redirect(`/vacation/${spotId}`);
  } catch (e) {
    return res.status(400).render('error', { error: e });
  }
});


export default router;