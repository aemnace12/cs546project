/**
 * form_validation.js
 * 
 * Contains client-side validation logic for all forms on the website. 
 */

const signupForm = document.getElementById('signup-form');        
const signinForm = document.getElementById('signin-form');      
const createPostForm = document.getElementById('createpost-form');     
const createReviewForm = document.getElementById('createreview-form');      
const commentReviewForm = document.getElementById('commentreview-form');      
const profileEditForm = document.getElementById('profileedit-form');     
const errorDiv = document.getElementById('error');


const checkValidRating = (rating) => {
  rating = parseFloat(rating);

  if (isNaN(rating)) {
    return false;
  }

  if (rating < 0 || rating > 5) {
    return false;
  }

  if (Math.round(rating * 10) !== rating * 10) {
    return false;
  }

  return true;
};

const fetchCountries = async () => {
  const response = await fetch('https://restcountries.com/v3.1/all');
  if (!response.ok) {
    throw 'Failed to fetch countries';
  } 
  const data = await response.json();
  return data.map(country => country.name.common.toLowerCase());
};


const checkValidName = (firstName) => {     
    if (typeof firstName !== 'string') {        // checking string type
        return false;
    }
    firstName = firstName.trim();
  
    if (firstName.length === 0 || firstName.length < 2 || firstName.length > 20) {       //  checking not just string of spaces or within valid length
        return false;
    }
  
    for (let i = 0; i < firstName.length; i++) {        //  checking if each character is a letter
        let charCode = firstName.charCodeAt(i);
        if (!((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122))) {
            return false;
        }
    }
    return true;
};

const checkValidUserId = (userId) => {     
    if (typeof userId !== 'string') {        // checking string type
        return false;
    }
    userId = userId.trim();
  
    if (userId.length === 0 || userId.length < 5 || userId.length > 10) {       //  checking not just string of spaces or within valid length
        return false;
    }
  
    for (let i = 0; i < userId.length; i++) {        //  checking if each character is a letter or positive whole number
        let charCode = userId.charCodeAt(i);
        if (!((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || (charCode >= 48 && charCode <= 57))) {
            return false;
        }
    }
    return true;
};

const checkValidRole = (role) => {
    if (typeof role !== 'string') {
        return false;
    }
  
    role = role.trim().toLowerCase();
  
    if (role !== 'user' && role !== 'admin') {
        return false;
    }
    return true;
};


const checkValidPassword = (password) => {
    if (typeof password !== 'string') {        // checking string type
        return false;
    }
    password = password.trim();
  
    if (password.length === 0) {       //  checking not just string of spaces
        return false;
    }

    if (password.length < 6 || password.length > 20) {      //  checking within valid length
        return false;
      }
  
    if (password.includes(' '))  {          //  checking if no space characters
        return false;
    }
  
    if (!/[A-Z]/.test(password)) {          //  checking at least one uppercase
        return false;
    }
  
    if (!/[0-9]/.test(password)) {          //  checking at least one number
        return false;
    }
  
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;/]/.test(password)) {       //  checking at least one special
        return false;
    }
  
    return true;
  };

const checkValidString = (str) => {
    if (!str) {        //  check if empty
      return false;
    }

  if (typeof str !== "string") {     //  check if string
    return false;
  }

  if (str.trim().length === 0) {      //  check if just spaces
    return false;
  }

  return true;
  };

const checkValidLocationName = (name) => {
    return checkValidString(name);
  };

const checkValidCity = (city) => {
    return checkValidString(city);
  };

const checkValidRegion = (region) => {
    return checkValidString(region);
  };

const checkValidCountry = async (country) => {
    if (!checkValidString(country)) {
      return false;
    }
    let countries = await fetchCountries();
    countries.push('USA','U.S.A.','U.S.','US','United States of America');
    countries = countries.map(country => country.toLowerCase().trim());
    return countries.includes(country.trim().toLowerCase());
};

const checkValidContinent = (continent) => {
    if (!checkValidString(continent)) {
      return false;
    }

    const validContinents = [
      'africa',
      'antarctica',
      'asia',
      'europe',
      'north america',
      'south america',
      'australia'
    ];

    if (!validContinents.includes(continent.trim().toLowerCase())) {
      return false;
    }

    return true;
  };

const checkValidDescription = (description) => {
    return checkValidString(description);
};

const checkValidFoodRating = (foodRating) => {
    if (!checkValidString(foodRating)) {
      return false;
    }

    return checkValidRating(foodRating.trim());
};

const checkValidSafetyRating = (safetyRating) => {
    if (!checkValidString(safetyRating)) {
      return false;
    }
    return checkValidRating(safetyRating.trim());
};

const checkValidActivityRating = (activityRating) => {
    if (!checkValidString(activityRating)) {
      return false;
    }
    return checkValidRating(activityRating.trim());
};

const checkValidOverallRating = (overallRating) => {
    if (!checkValidString(overallRating)) {
      return false;
    }
    return checkValidRating(overallRating.trim());
};

const checkValidReview = (review) => {
    return checkValidString(review);
};

const checkValidComment = (comment) => {
    return checkValidString(comment);
}

const checkValidEditItem = (editItem) => {
    if (!checkValidString(editItem)) {
      return false;
    }

    const validEditItems = ['firstName', 'lastName', 'email', 'bio', 'password', 'favoritePlace'];

    if (!validEditItems.includes(editItem.trim())) {
        return false;
    }

    return true;;
};

const checkValidEmail = (email) => {
    if (!checkValidString(email)) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    return emailRegex.test(email);
};

const checkValidNewValue = (editItem, newValue) => {
    if (editItem === 'firstName') {
      return checkValidName(newValue);
    }
    if (editItem === 'lastName') {
      return checkValidName(newValue);
    }
    if (editItem === 'email') {
      return checkValidEmail(newValue);
    }
    if (editItem === 'bio') {
      return checkValidString(newValue);
    }
    if (editItem === 'password') {
      return checkValidPassword(newValue);
    }
    if (editItem === 'favoritePlace') {
      return checkValidString(newValue);
    }
};

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

      if (!checkValidName(firstName)) {   //  checking valid firstName
        errors.push('Invalid firstName, must be a string of only letters at least 2 characters long with a max length of 20');
      }

      if (!checkValidName(lastName)) {    //  checking valid lastName
        errors.push('Invalid lastName, must be a string of only letters at least 2 characters long with a max length of 20');
      }

      if (!checkValidUserId(userId)) {    //  checking valid userId
        errors.push('Invalid userId, must be a string of only letters or positive whole numbers at least 5 characters long with a max length of 10');
      }

      if (!checkValidPassword(password)) {    //  checking valid password
        errors.push('Invalid password. Must contain at least one uppercase character, at least one number, and at least one special character');
      }

      if (confirmPassword !== password) {     //  checking valid confirmPassword
        errors.push('Confirm password must be the same as initial password');
      }

      if (!checkValidRole(role)) {       //  checking valid role
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

      if (!checkValidUserId(userId)) {    //  checking valid userId
        errors.push('Invalid userId, must be a string of only letters or positive whole numbers at least 5 characters long with a max length of 10');
      }

      if (!checkValidPassword(password)) {    //  checking valid password
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
const inputCheckCreatePost = async (name, city, region, country, continent, description) => {
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

      if (!checkValidLocationName(name)) {    //  checking valid name
        errors.push('Invalid location name');
      }

      if (!checkValidCity(city)) {    //  checking valid city
        errors.push('Invalid city');
      }

      if (!checkValidRegion(region)) {    //  checking valid region
        errors.push('Invalid region');
      }

      if (!(await checkValidCountry(country))) {    //  checking valid country
        errors.push('Invalid country');
      }

      if (!checkValidContinent(continent)) {    //  checking valid continent
        errors.push('Invalid continent');
      }

      if (!checkValidDescription(description)) {    //  checking valid description
        errors.push('Invalid description');
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
    createPostForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const city = document.getElementById('city').value;
        const region = document.getElementById('region').value;
        const country = document.getElementById('country').value;
        const continent = document.getElementById('continent').value;
        const description = document.getElementById('description').value;
        const result = await inputCheckCreatePost(name, city, region, country, continent, description);
        if (result) {        // error checking
            errorDiv.hidden = true;
            createPostForm.submit();
        } else {
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

      if (!checkValidFoodRating(foodRating)) {    //  checking valid foodRating
        errors.push('Invalid foodRating, must be between 0 and 5 with at most one decimal place');
      }

      if (!checkValidSafetyRating(safetyRating)) {    //  checking valid safetyRating
        errors.push('Invalid safetyRating, must be between 0 and 5 with at most one decimal place');
      }

      if (!checkValidActivityRating(activityRating)) {    //  checking valid activityRating
        errors.push('Invalid activityRating, must be between 0 and 5 with at most one decimal place');
      }

      if (!checkValidOverallRating(overallRating)) {    //  checking valid overallRating
        errors.push('Invalid overallRating, must be between 0 and 5 with at most one decimal place');
      }

      if (!checkValidReview(review)) {    //  checking valid review
        errors.push('Invalid review');
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

      if (!checkValidComment(comment)) {    //  checking valid comment
        errors.push('Invalid comment');
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

      if (!checkValidEditItem(editItem)) {    //  checking valid editItem
        errors.push('Invalid editItem');
      }

      if (!checkValidNewValue(editItem, newValue)) {    //  checking valid newValue
        if (editItem === 'firstName') {
          errors.push('Invalid new firstName');
        }
        if (editItem === 'lastName') {
          errors.push('Invalid new lastName');
        }
        if (editItem === 'email') {
          errors.push('Invalid new email');
        }
        if (editItem === 'bio') {
          errors.push('Invalid new bio');
        }
        if (editItem === 'password') {
          errors.push('Invalid new password');
        }
        if (editItem === 'favoritePlace') {
          errors.push('Invalid new favoritePlace');
        }
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