//used to take up space for further use
import validation from '../../validation.js'

const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');
const createPostForm = document.getElementById('createpost-form');
const createReviewForm = document.getElementById('createreview-form');
const commentReviewForm = document.getElementById('commentreview-form');
const profileEditForm = document.getElementById('profileedit-form');
const errorDiv = document.getElementById('error');

//  helper function for signup-form validation
const inputCheckSignup = (firstName, lastName, userId, password, confirmPassword, role) => {
    let missingFields = [];
    let errors = [];

    if (!firstName) {
        missingFields.push('firstName');
      }
      if (!lastName) {
        missingFields.push('lastName');
      }
      if (!userId) {
        missingFields.push('userId');
      }
      if (!password) {
        missingFields.push('password');
      }
      if (!confirmPassword) {
        missingFields.push('confirmPassword');
      }

      if (!role) {
        missingFields.push('role');
      }
  
      if (missingFields.length > 0) {       //  checking for missing fields
        let missingFieldsStr = missingFields.join(', ');
        errors.push(`${missingFieldsStr} are missing`);
        let errorStr = errors.join('. ') + '.';
        errorDiv.innerHTML = errorStr;
        return false;
      }

      if (!validation.checkValidName(firstName)) {   //  checking valid firstName
        errors.push('Invalid firstName, must be a string of only letters at least 2 characters long with a max length of 20');
      }

      if (!validation.checkValidName(lastName)) {    //  checking valid lastName
        errors.push('Invalid lastName, must be a string of only letters at least 2 characters long with a max length of 20');
      }

      if (!validation.checkValidUserId(userId)) {    //  checking valid userId
        errors.push('Invalid userId, must be a string of only letters or positive whole numbers at least 5 characters long with a max length of 10');
      }

      if (!validation.checkValidPassword(password)) {    //  checking valid password
        errors.push('Invalid password. Must contain at least one uppercase character, at least one number, and at least one special character');
      }

      if (confirmPassword !== password) {     //  checking valid confirmPassword
        errors.push('Confirm password must be the same as initial password');
      }

      if (!validation.checkValidRole(role)) {       //  checking valid role
        errors.push('Invalid role, must be user or admin');
      }
      
      if (errors.length > 0) {
        let errorStr = errors.join('. ') + '.';
        errorDiv.innerHTML = errorStr;
        return false;
      }

      return true;
};

//  signup-form validation
if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const userId = document.getElementById('userId').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const role = document.getElementById('role').value;

        if (inputCheckSignup(firstName, lastName, userId, password, confirmPassword, role)) {        // error checking
            errorDiv.hidden = true;
        } else {
            event.preventDefault();
            errorDiv.hidden = false;
        }
    });
}

//  helper function for signin-form validation
const inputCheckSignin = (userId, password) => {
    let missingFields = [];
    let errors = [];

      if (!userId) {
        missingFields.push('userId');
      }
      if (!password) {
        missingFields.push('password');
      }
  
      if (missingFields.length > 0) {       //  checking for missing fields
        let missingFieldsStr = missingFields.join(', ');
        errors.push(`${missingFieldsStr} are missing`);
        let errorStr = errors.join('. ') + '.';
        errorDiv.innerHTML = errorStr;
        return false;
      }

      if (!validation.checkValidUserId(userId)) {    //  checking valid userId
        errors.push('Invalid userId, must be a string of only letters or positive whole numbers at least 5 characters long with a max length of 10');
      }

      if (!validation.checkValidPassword(password)) {    //  checking valid password
        errors.push('Invalid password. Must contain at least one uppercase character, at least one number, and at least one special character');
      }

      if (errors.length > 0) {
        let errorStr = errors.join('. ') + '.';
        errorDiv.innerHTML = errorStr;
        return false;
      }

      return true;
};

//  signin-form validation
if (signinForm) {
    signinForm.addEventListener('submit', (event) => {
        const userId = document.getElementById('userId').value;
        const password = document.getElementById('password').value;

        if (inputCheckSignin(userId, password)) {        // error checking
            errorDiv.hidden = true;
        } else {
            event.preventDefault();
            errorDiv.hidden = false;
        }
    });
}

//  helper function for createpost-form validation
const inputCheckCreatePost = (name, city, region, country, continent, description) => {
    let missingFields = [];
    let errors = [];

      if (!name) {
        missingFields.push('name');
      }
      if (!city) {
        missingFields.push('city');
      }
      if (!region) {
        missingFields.push('region');
      }
      if (!country) {
        missingFields.push('country');
      }
      if (!continent) {
        missingFields.push('continent');
      }
      if (!description) {
        missingFields.push('description');
      }
  
      if (missingFields.length > 0) {       //  checking for missing fields
        let missingFieldsStr = missingFields.join(', ');
        errors.push(`${missingFieldsStr} are missing`);
        let errorStr = errors.join('. ') + '.';
        errorDiv.innerHTML = errorStr;
        return false;
      }

      if (!validation.checkValidLocationName(name)) {    //  checking valid name
        errors.push('');
      }

      if (!validation.checkValidCity(city)) {    //  checking valid city
        errors.push('');
      }

      if (!validation.checkValidRegion(region)) {    //  checking valid region
        errors.push('');
      }

      if (!validation.checkValidCountry(country)) {    //  checking valid country
        errors.push('');
      }

      if (!validation.checkValidContinent(continent)) {    //  checking valid continent
        errors.push('');
      }

      if (!validation.checkValidDescription(description)) {    //  checking valid description
        errors.push('');
      }

      if (errors.length > 0) {
        let errorStr = errors.join('. ') + '.';
        errorDiv.innerHTML = errorStr;
        return false;
      }

      return true;
};

//  createpost-form validation
if (createPostForm) {
    createPostForm.addEventListener('submit', (event) => {
        const name = document.getElementById('name').value;
        const city = document.getElementById('city').value;
        const region = document.getElementById('region').value;
        const country = document.getElementById('country').value;
        const continent = document.getElementById('continent').value;
        const description = document.getElementById('description').value;

        if (inputCheckCreatePost(name, city, region, country, continent, description)) {        // error checking
            errorDiv.hidden = true;
        } else {
            event.preventDefault();
            errorDiv.hidden = false;
        }
    });
}

//  helper function for createpost-form validation
const inputCheckCreateReview = (foodRating, safetyRating, activityRating, overallRating, review) => {
    let missingFields = [];
    let errors = [];

      if (!foodRating) {
        missingFields.push('foodRating');
      }
      if (!safetyRating) {
        missingFields.push('safetyRating');
      }
      if (!activityRating) {
        missingFields.push('activityRating');
      }
      if (!overallRating) {
        missingFields.push('overallRating');
      }
      if (!review) {
        missingFields.push('review');
      }
  
      if (missingFields.length > 0) {       //  checking for missing fields
        let missingFieldsStr = missingFields.join(', ');
        errors.push(`${missingFieldsStr} are missing`);
        let errorStr = errors.join('. ') + '.';
        errorDiv.innerHTML = errorStr;
        return false;
      }

      if (!validation.checkValidFoodRating(foodRating)) {    //  checking valid foodRating
        errors.push('');
      }

      if (!validation.checkValidSafetyRating(safetyRating)) {    //  checking valid safetyRating
        errors.push('');
      }

      if (!validation.checkValidActivityRating(activityRating)) {    //  checking valid activityRating
        errors.push('');
      }

      if (!validation.checkValidOverallRating(overallRating)) {    //  checking valid overallRating
        errors.push('');
      }

      if (!validation.checkValidReview(review)) {    //  checking valid review
        errors.push('');
      }

      if (errors.length > 0) {
        let errorStr = errors.join('. ') + '.';
        errorDiv.innerHTML = errorStr;
        return false;
      }

      return true;
};

//  createreview-form validation
if (createReviewForm) {
    createReviewForm.addEventListener('submit', (event) => {
        const foodRating = document.getElementById('foodRating').value;
        const safetyRating = document.getElementById('safetyRating').value;
        const activityRating = document.getElementById('activityRating').value;
        const overallRating = document.getElementById('overallRating').value;
        const review = document.getElementById('review').value;

        if (inputCheckCreateReview(foodRating, safetyRating, activityRating, overallRating, review)) {        // error checking
            errorDiv.hidden = true;
        } else {
            event.preventDefault();
            errorDiv.hidden = false;
        }
    });
}

//  helper function for commentreview-form validation
const inputCheckCommentReview = (comment) => {
    let missingFields = [];
    let errors = [];

      if (!comment) {
        missingFields.push('comment');
      }
  
      if (missingFields.length > 0) {       //  checking for missing fields
        let missingFieldsStr = missingFields.join(', ');
        errors.push(`${missingFieldsStr} are missing`);
        let errorStr = errors.join('. ') + '.';
        errorDiv.innerHTML = errorStr;
        return false;
      }

      if (!validation.checkValidComment(comment)) {    //  checking valid comment
        errors.push('');
      }

      if (errors.length > 0) {
        let errorStr = errors.join('. ') + '.';
        errorDiv.innerHTML = errorStr;
        return false;
      }

      return true;
};

//  commentreview-form validation
if (commentReviewForm) {
    commentReviewForm.addEventListener('submit', (event) => {
        const comment = document.getElementById('comment').value;

        if (inputCheckCommentReview(comment)) {        // error checking
            errorDiv.hidden = true;
        } else {
            event.preventDefault();
            errorDiv.hidden = false;
        }
    });
}

//  helper function for profileedit-form validation
const inputCheckProfileEdit = (editItem, newValue) => {
    let missingFields = [];
    let errors = [];

      if (!editItem) {
        missingFields.push('editItem');
      }
      if (!newValue) {
        missingFields.push('newValue');
      }
  
      if (missingFields.length > 0) {       //  checking for missing fields
        let missingFieldsStr = missingFields.join(', ');
        errors.push(`${missingFieldsStr} are missing`);
        let errorStr = errors.join('. ') + '.';
        errorDiv.innerHTML = errorStr;
        return false;
      }

      if (!validation.checkValidEditItem(editItem)) {    //  checking valid editItem
        errors.push('');
      }

      if (!validation.checkValidNewValue(newValue)) {    //  checking valid newValue
        errors.push('');
      }

      if (errors.length > 0) {
        let errorStr = errors.join('. ') + '.';
        errorDiv.innerHTML = errorStr;
        return false;
      }

      return true;
};

//  profileedit-form validation
if (profileEditForm) {
    profileEditForm.addEventListener('submit', (event) => {
        const editItem = document.getElementById('editItem').value;
        const newValue = document.getElementById('newValue').value;

        if (inputCheckProfileEdit(editItem, newValue)) {        // error checking
            errorDiv.hidden = true;
        } else {
            event.preventDefault();
            errorDiv.hidden = false;
        }
    });
}