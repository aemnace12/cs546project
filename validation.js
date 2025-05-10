
import {ObjectId} from 'mongodb';

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

  checkValidLocationName(name) {

  },

  checkValidCity(city) {

  },

  checkValidRegion(region) {

  },

  checkValidCountry(country) {

  },

  checkValidContinent(continent) {

  },

  checkValidDescription(description) {

  },

  checkValidFoodRating(foodRating) {

  },

  checkValidSafetyRating(safetyRating) {

  },

  checkValidActivityRating(activityRating) {

  },

  checkValidOverallRating(overallRating) {

  },

  checkValidReview(review) {

  },

  checkValidComment(comment) {

  },

  checkValidEditItem(editItem) {

  },

  checkValidNewValue(newValue) {

  }
};

export default exportedMethods;