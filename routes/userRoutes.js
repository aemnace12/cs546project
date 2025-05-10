import {Router} from 'express';
const router = Router();
import {userData} from '../data/index.js';
import {reviewData} from '../data/index.js';
import validation from '../validation.js';
import xss from 'xss';

router
  .route('/login')
  .get(async (req, res) => {
    //code here for GET
    const user = req.session.user;
    if(user){
      res.redirect('/');
    }
    try{
      res.render('auth/login');
    }catch(e){
      res.sendStatus(500);
    }
  })
  .post(async (req, res) => {
    //code here for POST
    const regBody = req.body;
    
    try{
      
      let userId=validation.checkString(xss(regBody.userId));
      userId = userId.toLowerCase();

      let password=validation.checkString(xss(regBody.password));

      //userId Logic
      if(!(/^[A-Za-z0-9]+$/).test(userId)){
        throw "userID contains non-letters/numbers"
      }
      if(userId.length > 10 || userId.length < 5){
        throw "userId is wrong length"
      }
      regBody.userId=regBody.userId.toLowerCase();

      //password logic
      if(password.length < 8){
        throw "password too short"
      }
      let chars = Array.from(password);
      let uppercase = chars.some(char => /[A-Z]/.test(char));
      let specialChar = chars.some(char => /[^a-zA-Z0-9 ]/.test(char));
      let number = chars.some(char => !isNaN(char) && char !== ' ');
      if(!specialChar){
        throw "needs special char"
      }
      if(!uppercase){
        throw "needs uppercase char"
      }
      if(!number){
        throw "needs number"
      }
      const reg = await userData.login(xss(regBody.userId), xss(regBody.password));
      
      if(!reg){
        return res.status(400).render('auth/login', {error: "Invalid username or password"});
      }
      
      req.session.user = {
        firstName: reg.firstName,
        lastName: reg.lastName,
        userId: reg.userId,
        role: reg.role,
        bio: reg.bio,
        favoritePlace: reg.favoritePlace,
      };
      
      if(reg.role === "admin"){
        res.redirect("/admin")
      }else if(reg.role === "user"){
        res.redirect("/user/profile");
      }else{
        throw "incorrect role"
      }

    }catch(e){
      return res.status(400).render('error', {error: e});
    }
  });

// sign up/register page 

router.get('/profile', async (req, res) => {
  const user = req.session.user;
  try {
    if (!user) {
      return res.redirect('/user/login');
    }

    const userId = user.userId;
    const userReviews = await reviewData.getReviewsByUserid(userId);

    console.log("Session data:", req.session.user);

    res.render('user/profile', {
      firstName: user.firstName,
      lastName: user.lastName,
      userId: user.userId,
      bio: user.bio,
      favoritePlace: user.favoritePlace,
      reviews: userReviews,
      role: user.role
    });
  } catch (e) {
    return res.status(400).render('error', { error: e.toString() });
  }
});

router.get('/profile/edit', async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect('/user/login');
  }

  res.render('user/edit', {
    firstName: user.firstName,
    lastName: user.lastName,
    userId: user.userId,

  });
});

// POST route to handle form submission
router.post('/edit', async (req, res) => {

  if (!req.session.user) {
    return res.redirect('/user/login');
  }

  const { editItem, newValue } = req.body;
  try{
    if (!editItem || !newValue) {
      throw "All fields are required"
    }

    const allowedFields = ['firstName', 'lastName', 'bio', 'favoritePlace', 'password'];
    if (!allowedFields.includes(editItem)) {
      throw "Invalid field to edit.";
    }
    let finValue = xss(newValue);
    if(editItem !== "password"){
      finValue = validation.checkString(newValue, editItem);
    }else{
      let password = finValue;
      if(password.length < 8){
        throw "password too short"
      }
      let chars = Array.from(password);
      let uppercase = chars.some(char => /[A-Z]/.test(char));
      let specialChar = chars.some(char => /[^a-zA-Z0-9 ]/.test(char));
      let number = chars.some(char => !isNaN(char) && char !== ' ');
      if (!uppercase) {
        throw "Password must contain at least one uppercase letter";
      }
      if (!specialChar) {
        throw "Password must contain at least one special character";
      }
      if (!number) {
        throw "Password must contain at least one number";
      }
    }
    const updatedUser = await userData.updateUser(req.session.user.userId, editItem, finValue);
    if (!updatedUser) {
      //error here
      throw "Updating did not work."
    }
    if (editItem !== 'password') {
      req.session.user[editItem] = finValue;
    }
  
    const successMessage = req.session.success;
    req.session.success = false; // debugging and clean
    
    res.render('user/profile', {
      firstName: req.session.user.firstName,
      lastName: req.session.user.lastName,
      userId: req.session.user.userId,
      bio: req.session.user.bio,
      favoritePlace: req.session.user.favoritePlace,
      role: req.session.user.role,
      success: successMessage
  });
  }catch(e){
    return res.status(400).render('user/edit', {
      error: e,
      firstName: req.session.user.firstName,
      lastName: req.session.user.lastName,
      userId: req.session.user.userId

    });
  }

});
router
  .route('/register')
  .get(async (req, res) => {
    //code here for GET
    const user = req.session.user;
    if(user){
      res.redirect('/');
    }
    
    try{
      res.render('auth/register');
    }catch(e){
      return res.sendStatus(500).render("error", {error: e});
      
    }
  })
  .post(async (req, res) => {
    //code here for POST
    const regBody = req.body;
    try {
      //Validate user input for registering
      regBody.firstName = validation.checkString(xss(regBody.firstName));
      regBody.lastName = validation.checkString(xss(regBody.lastName));
      regBody.userId = validation.checkString(xss(regBody.userId));
      regBody.password = validation.checkString(xss(regBody.password));
      regBody.confirmPassword = validation.checkString(xss(regBody.confirmPassword));
      regBody.role = validation.checkString(xss(regBody.role));

      if(!(/^[A-Za-z]+$/).test(regBody.firstName)){
        throw "first name contains non-letters"
      }
      if(regBody.firstName.length > 20 || regBody.firstName.length < 2){
        throw "first name is wrong length"
      }
      
      
      if(!(/^[A-Za-z]+$/).test(regBody.lastName)){
        throw "last name contains non-letters"
      }
      if(regBody.lastName.length > 20 || regBody.lastName.length < 2){
        throw "last name is wrong length"
      }

      if(!(/^[A-Za-z0-9]+$/).test(regBody.userId)){
        throw "userID contains non-letters/numbers"
      }
      if(regBody.userId.length > 10 || regBody.userId.length < 5){
        throw "userID is wrong length"
      }
      regBody.userId=regBody.userId.toLowerCase();
    
      regBody.password=validation.checkString(regBody.password);
      if(regBody.password.length < 8){
        throw "password too short"
      }
      if(regBody.confirmPassword !== regBody.password){
        throw "passwords are not the same"
      }
      let chars = Array.from(regBody.password);
      let uppercase = chars.some(char => /[A-Z]/.test(char));
      let specialChar = chars.some(char => /[^a-zA-Z0-9 ]/.test(char));
      let number = chars.some(char => !isNaN(char) && char !== ' ');
      if(!specialChar){
        throw "needs special char"
      }
      if(!uppercase){
        throw "needs uppercase char"
      }
      if(!number){
        throw "needs number"
      }

    
      regBody.role=validation.checkString(regBody.role);
      regBody.role=regBody.role.toLowerCase();
      if(regBody.role !== "admin" && regBody.role !== "user"){
        throw "incorrect role";
      }

      //This function is needed! from userData
      const reg = await userData.createUser(regBody.firstName, regBody.lastName, regBody.userId, regBody.password, regBody.confirmPassword, regBody.role);
      console.log("Registration result:", reg);
      if(reg.registrationCompleted){
        res.redirect("/user/login");
        
      }else{
       // console.error("Registration failed:", e);
        res.status(500).json({error: "Internal Server Error"})
      }
    } catch (e) {
      console.error("Registration failed:", e);
      return res.status(400).render('auth/register', {error: e});
    }

  });

  

router.get('/logout', async (req, res) => {
  if(!req.session.user){
    res.redirect('/leaderboard')
  }
  req.session.destroy();
  res.render('auth/logout')
});

export default router;