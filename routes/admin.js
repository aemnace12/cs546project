import {Router} from 'express';
const router = Router();

router.get('/', (req, res) => {
    res.render('admin/home', {title: 'Admin Dashboard'});
})


router.get('/dashboard', async (req, res) => {
  res.json({route: '/private/dashboard', method: req.method});
});

export default router;
//ignore these unti lab 10 