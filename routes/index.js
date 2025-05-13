import vacationRoutes from './vacationSpotsRoutes.js';
import userRoutes from './userRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import leaderboardRoutes from './leaderboardRoutes.js';
import adminRoutes from './admin.js'
import homePage from './homePage.js'

const constructorMethod = (app) => {
  app.use('/user', userRoutes);
  app.use('/leaderboard', leaderboardRoutes);
  app.use('/vacation', vacationRoutes);
  app.use('/review', reviewRoutes);
  app.use('/admin', adminRoutes);
  app.use('/', homePage);

  app.use(/.*/, (req, res) => {
    res.render('error', {error: "Page not found."})
    //res.redirect('/calculator/static');
    //this code was used in past lectures, don't think we need it
  });
};

export default constructorMethod;