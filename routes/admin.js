import {Router} from 'express';
import {reviewData} from '../data/index.js';
import {commentData} from '../data/index.js';
import {vacationSpotData} from '../data/index.js';
import {ObjectId} from 'mongodb';
import {vacationSpots} from '../config/mongoCollections.js';
import validation from '../validation.js'
import xss from 'xss';
const router = Router();

router.get('/', async (req, res) => {
  const user = req.session.user;
  if (!user || user.role != 'admin') {
    return res.redirect('/');
  }
  try {
    const pending = await vacationSpotData.getAllUnapprovedLocations();
    const pendingCount = pending.length;
    // choose singular vs. plural
    const pendingLabel = pendingCount === 1 ? 'request' : 'requests';

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      pendingCount,
      pendingLabel
    });
  } catch (e) {
    res.status(500).render('error', { error: e.toString() });
  }
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
    const cleanLocation = xss(req.body.locationId);
    const locationId = validation.checkId(cleanLocation,"locationId");
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