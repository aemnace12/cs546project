import {Router} from 'express';
import vacationSpots from '../data/vacationSpots.js';
const router = Router();


router
    .route('/')
    .get(async (req,res) => {
        try {
            // Fetch the top 6 rated vacation spots
            const featuredDestinations = await vacationSpots.getTopSpots(6);
            // Render the homepage with those spots
            res.render('partials/homepage', {
              title: 'Home',
              layout: 'main',
              featuredDestinations
            });
          } catch (e) {
            // If something goes wrong, show the error page
            res.status(500).render('error', {
              title: 'Error',
              error: e.toString()
            });
          }
        });
router
    .route('/verifyage')
    .get(async (req,res) => {
        res.render('partials/age');
        })
    .post(async (req, res) => {
        if(!req.body.age){
          throw "no age given"
        }
        const age = parseInt(req.body.age, 10);

        if (isNaN(age) || age < 1 || age > 130) {
            return res.status(400).send('Invalid age entered.');
        }

        if (age < 14) {
            return res.status(403).render('error', {error: "You must be at least 14 years old to enter."})
        }

        req.session.ageVerified = true;
        res.redirect('/');
    });

export default router;