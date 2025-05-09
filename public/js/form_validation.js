//used to take up space for further use
const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');
const createPostForm = document.getElementById('createpost-form');
const createReviewForm = document.getElementById('createreview-form');
const commentReviewForm = document.getElementById('commentreview-form');
const profileEditForm = document.getElementById('profileedit-form');
const errorDiv = document.getElementById('error');

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

//  signin-form validation

//  createpost-form validation

//  createreview-form validation

//  commentreview-form validation

//  profileedit-form validation