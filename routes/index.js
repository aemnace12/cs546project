import vacationRoutes from './vacationSpots.js';
import userRoutes from './userRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import leaderboardRoutes from './leaderboardRoutes.js';

const constructorMethod = (app) => {
  app.use('/user', postRoutes);
  app.use('/leaderboard', leaderboardRoutes);
  app.use('/vacation', vacationRoutes);
  app.use('/reviews', reviewRoutes);


  app.use(/.*/, (req, res) => {
    res.status(404).json({error: 'Route Not found'});
    //res.redirect('/calculator/static');
    //this code was used in past lectures, don't think we need it
  });
};

export default constructorMethod;