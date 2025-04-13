import postRoutes from './post.js';

const constructorMethod = (app) => {
  app.use('/post', postRoutes);

  app.use(/.*/, (req, res) => {
    res.status(404).json({error: 'Route Not found'});
    //res.redirect('/calculator/static');
    //this code was used in past lectures, don't think we need it
  });
};

export default constructorMethod;