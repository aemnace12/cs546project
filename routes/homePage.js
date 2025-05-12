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

export default router;