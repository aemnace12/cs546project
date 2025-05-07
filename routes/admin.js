import {Router} from 'express';
const router = Router();

router.get('/', async (req, res) => {
  const user = req.session.user;
  if (!user || user.role != 'admin') {
    return res.redirect('/');
  }
  res.render('admin/dashboard');

});

router.get('/reviewrequests', async (req, res) => {
  const user = req.session.user;
  console.log(JSON.stringify(user));
  if (!user || user.role != 'admin') {
    return res.redirect('/');
  }
  res.render('admin/reviewrequests');

});


router.get('/dashboard', async (req, res) => {
  res.json({route: '/private/dashboard', method: req.method});
});

export default router;
//ignore these unti lab 10 