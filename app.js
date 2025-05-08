import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import session from 'express-session';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + '/public');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
     session({
       name: 'AuthenticationState',
       secret: "tripScoreString",
       saveUninitialized: false,
       resave: false,
     })
   );

app.use(async (req, res, next) => {
  let date = new Date().toUTCString();
  let authentic = "(Non-Authenticated)";
  if(req.session && req.session.user && req.session.cookie) {
    if (req.session.user.role === "admin"){
      authentic = "(Authenticated Admin)";
      res.locals.loggedInAdmin = true;
    }
    else if (req.session.user.role === "user"){
      authentic = "(Authenticated User)";
      res.locals.loggedInUser = true;
    }
  }
  else {
    res.locals.notLoggedIn = true;
  }
  let log = '[' + date + ']: ' + req.method + ' ' + req.path + ' ' + authentic;
  console.log(log);
  next();
});

app.use('/login', (req, res, next) => {
  if (req.session.user && req.session.user.role === "admin") {
    return res.redirect("/admin")
  }
  if (req.session.user && req.session.user.role === "user") {
     return res.redirect("/user")
  }
  next();
  
});

app.use('/register', (req, res, next) => {
     if (req.session.user && req.session.user.role === "admin") {
       return res.redirect("/admin")
     }
     if (req.session.user && req.session.user.role === "user") {
        return res.redirect("/user")
     }
     next();
   
   });

app.use('/user', (req, res, next) => {
     /*if (!req.session.user){
          return res.redirect("/login");
     }*/
     next();

});

app.use('/superuser', (req, res, next) => {
     if (!req.session.user) {
       return res.redirect("/login")
     }
     if (req.session.user && req.session.user.role !== "superuser") {
          return res.redirect("/error")
     }
     next();
   
   });

app.use('/error', (req, res, next) => {
     if (!req.session.user) {
          return res.status(403).redirect("login", {error: "You do not have permission to view this page."})
     }
     
     return res.status(403).render("error", {error: "You do not have permission to view this page.", backgroundColor: req.session.user.themePreference.backgroundColor, fontColor: req.session.user.themePreference.fontColor})
     

});

app.use('/review/createreview', (req, res, next) => {
  if (!req.session.user) {
       return res.status(403).redirect("/user/login")
  }
  
  next();
  

});

app.use('/logout', (req, res, next) => {
     if (!req.session.user) {
          return res.redirect("/login")
     }
     next();

});





//code from lecture to allow for requests like put if we need them
const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    // If the user posts to the server with a property called _method, rewrite the request's method
    // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
    // rewritten in this middleware to a PUT route
    if (req.body && req.body._method) {
      req.method = req.body._method;
      delete req.body._method;
    }
  
    // let the next middleware run:
    next();
  };

  app.use('/public', staticDir);
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(rewriteUnsupportedBrowserMethods);
  
  app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
  app.set('view engine', 'handlebars');
  
  configRoutes(app);

  app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
  });