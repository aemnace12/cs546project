import {Router} from 'express';
import {reviewData} from '../data/index.js';
import {commentData} from '../data/index.js';
import {vacationSpotData} from '../data/index.js';
import {ObjectId} from 'mongodb';
import {vacationSpots} from '../config/mongoCollections.js';
import validation from '../validation.js'
const router = Router();

router.get('/', async (req, res) => {
  const user = req.session.user;
  if (!user || user.role != 'admin') {
    return res.redirect('/');
  }
  res.render('admin/dashboard');

});

router.route('/reviewrequests')
.get(async(req,res) => {
    try{
        if(!req.session.user){
            res.redirect('/leaderboard');
        }
        if(req.session.user.role !== 'admin'){
            res.redirect('/leaderboard');
        }
        const leadData = await vacationSpotData.getAllUnapprovedLocations();
        if(!leadData){
            throw "couldn't load locations"
        }
        res.render('admin/reviewrequests', {posts: leadData})
        
    }catch(e){
      res.render('error', {error: e})
    }
})
.post(async(req,res) => {
  try{
    if(!req.session.user){
        res.redirect('/leaderboard');
    }
    if(req.session.user.role !== 'admin'){
        res.redirect('/leaderboard');
    }
    const locationId = validation.checkId(req.body.locationId,"locationId");
    const locationCol = await vacationSpots();
    const modifyLocation = await locationCol.findOneAndUpdate(
        { _id: new ObjectId(locationId) },
        { $set: { isApproved: true } }
    );
    if(!modifyLocation){
      throw "Approving post failure!"
    }
    res.redirect('/admin/reviewrequests');
    
}catch(e){
  res.render('error', {error: e})
}
})

router.get('/dashboard', async (req, res) => {
  res.json({route: '/private/dashboard', method: req.method});
});

export default router;
//ignore these unti lab 10 