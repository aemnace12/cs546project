import {Router} from 'express';
const router = Router();
import {userData} from '../data/index.js';
import validation from '../validation.js'




router.get('/', async (req, res) => {
  res.json({route: '/users', method: req.method});
});

router.post('/', async (req, res) => {
  res.json({route: '/users', method: req.method});
});
router
  .route('/login')
  .get(async (req, res) => {
    //code here for GET
    try{
      res.render('auth/login')
    }catch(e){
      res.sendStatus(500);
    }
  })
  .post(async (req, res) => {
    //code here for POST
    const regBody = req.body;
    
    try{
      
      regBody.userId=validation.checkString(regBody.userId);
      regBody.userId=regBody.userId.toLowerCase();

      regBody.password=validation.checkString(regBody.password);

      //userId Logic
      if(!(/^[A-Za-z0-9]+$/).test(regBody.userId)){
        throw "userID contains non-letters/numbers"
      }
      if(regBody.userId.length > 10 || regBody.userId.length < 5){
        throw "userId is wrong length"
      }
      regBody.userId=regBody.userId.toLowerCase();

      //password logic
      if(regBody.password.length < 8){
        throw "password too short"
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
      //Login function needed from userData page
      const reg = await login(regBody.userId, regBody.password);
      
      if(!reg){
        return res.status(400).render('user/login', {error: "Invalid username or password"});
      }
      
      req.session.user = {
        firstName: reg.firstName,
        lastName: reg.lastName,
        userId: reg.userId,
        role: reg.role,
      };
      
      if(reg.role === "admin"){
        
        res.redirect("/admin") //NOT DONE
      }else if(reg.role === "user"){
        res.redirect("/profile")
      }else{
        throw "incorrect role"
      }

    }catch(e){
      return res.status(400).render('error', {error: e});
    }
  });

// sign up/register page 

router.get('/profile', async (req, res) => {
  res.render('user/profile');
});

router
  .route('/register')
  .get(async (req, res) => {
    //code here for GET
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
      regBody.firstName = validation.checkString(regBody.firstName);
      regBody.lastName = validation.checkString(regBody.lastName);
      regBody.userId = validation.checkString(regBody.userId);
      regBody.password = validation.checkString(regBody.password);
      regBody.confirmPassword = validation.checkString(regBody.confirmPassword);
      regBody.role = validation.checkString(regBody.role);

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
      const reg = await createUser(regBody.firstName, regBody.lastName, regBody.userId, regBody.password, regBody.role);

      if(reg.registrationCompleted){
        res.redirect("login")
        
      }else{
        
        res.status(500).json({error: "Internal Server Error"})
      }
    } catch (e) {
      return res.status(400).render('auth/register', {error: e});
    }

  });

router.get('/logout', async (req, res) => {
  req.session.destroy();
  res.send('Logged out');
});

export default router;