import {ObjectId} from 'mongodb';

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

const exportedMethods = {
  checkId(id, varName) {
    if (!id) throw `Error: You must provide a ${varName}`;
    if (typeof id !== 'string') throw `Error:${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: ${varName} invalid object ID`;
    return id;
  },

  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  },

  checkStringArray(arr, varName) {
    //We will allow an empty array for this,
    //if it's not empty, we will make sure all tags are strings
    if (!arr || !Array.isArray(arr))
      throw `You must provide an array of ${varName}`;
    for (let i in arr) {
      if (typeof arr[i] !== 'string' || arr[i].trim().length === 0) {
        throw `One or more elements in ${varName} array is not a string or is an empty string`;
      }
      arr[i] = arr[i].trim();
    }

    return arr;
  },

  checkValidName(firstName) {     
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
},

checkValidUserId(userId) {     
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
},

checkValidRole(role) {
    if (typeof role !== 'string') {
        return false;
    }
  
    role = role.trim().toLowerCase();
  
    if (role !== 'user' && role !== 'admin') {
        return false;
    }
    return true;
},


checkValidPassword(password) {
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
  },

  checkValidString(str) {
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
  },

  checkValidLocationName(name) {
    return this.checkValidString(name);
  },

  checkValidCity(city) {
    return this.checkValidString(city);
  },

  checkValidRegion(region) {
    return this.checkValidString(region);
  },

  async checkValidCountry(country) {
    if (!this.checkValidString(country)) {
      return false;
    }

    try {
      const countries = await fetchCountries();
      return countries.includes(country.trim().toLowerCase());
    } catch (e) {
      console.error('Error validating country:', e);
      return false;
    }
  },

  checkValidContinent(continent) {
    if (!this.checkValidString(continent)) {
      return false;
    }

    const validContinents = [
      'africa',
      'antarctica',
      'asia',
      'europe',
      'north America',
      'south America',
      'australia'
    ];

    if (!validContinents.includes(continent.trim().toLowerCase())) {
      return false;
    }

    return true;
  },

  checkValidDescription(description) {
    return this.checkValidString(description);
  },

  checkValidFoodRating(foodRating) {
    if (!this.checkValidString(foodRating)) {
      return false;
    }

    return checkValidRating(foodRating.trim());
  },

  checkValidSafetyRating(safetyRating) {
    if (!this.checkValidString(safetyRating)) {
      return false;
    }
    return checkValidRating(safetyRating.trim());
  },

  checkValidActivityRating(activityRating) {
    if (!this.checkValidString(activityRating)) {
      return false;
    }
    return checkValidRating(activityRating.trim());
  },

  checkValidOverallRating(overallRating) {
    if (!this.checkValidString(overallRating)) {
      return false;
    }
    return checkValidRating(overallRating.trim());
  },

  checkValidReview(review) {
    return this.checkValidString(review);
  },

  checkValidComment(comment) {
    return this.checkValidString(comment);
  },

  checkValidEditItem(editItem) {
    if (!this.checkValidString(editItem)) {
      return false;
    }

    const validEditItems = ['firstName', 'lastName', 'email', 'bio', 'password', 'favoritePlace'];

    if (!validEditItems.includes(editItem.trim())) {
        return false;
    }

    return true;;
  },

  checkValidEmail(email) {
    if (!this.checkValidString(activityRating)) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    return emailRegex.test(email);
  },

  checkValidNewValue(editItem, newValue) {
    if (editItem === 'firstName') {
      return this.checkValidName(newValue);
    }
    if (editItem === 'lastName') {
      return this.checkValidName(newValue);
    }
    if (editItem === 'email') {
      return this.checkValidEmail(newValue);
    }
    if (editItem === 'bio') {
      return this.checkValidString(newValue);
    }
    if (editItem === 'password') {
      return this.checkValidPassword(newValue);
    }
    if (editItem === 'favoritePlace') {
      return this.checkValidString(newValue);
    }
  }
};

export default exportedMethods;