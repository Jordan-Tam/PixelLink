import {ObjectId} from "mongodb";

// Strings to be used for checking username and password constraints.
const UPPERCASE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_LETTERS = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const LETTERS_AND_NUMBERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const LETTERS_AND_NUMBERS_PLUS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._-";


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* GENERAL
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Input validation for string parameters.
 * @param {string} str The string to validate.
 * @param {string} varName The name of the string variable as it is called in the function that called this helper function.
 * @param {string} funcName The name of the function that called this helper function.
 * @returns {string} str.trim()
 */
const checkString = (str, varName, funcName) => {

  // Check if "str" is undefined, null, or an empty string.
  if (!str) {
    throw {
      status: 400,
      function: funcName,
      error: `${varName} is undefined.`
    };
  }

  // Check if "str" is of type string.
  if (typeof str !== "string") {
    throw {
      status: 400,
      function: funcName,
      error: `${varName} must be a string.`
    };
  }

  str = str.trim();

  // Check if "str" is composed of only spaces.
  if (str.length === 0) {
    throw {
      status: 400,
      function: funcName,
      error: `${varName} cannot be empty or just spaces.`
    };
  }

  return str;

};


/**
 * 
 * @param {string} id The ID to validate.
 * @param {string} funcName The name of the function that called this helper function.
 * @param {string} id_of_what The type of document this ID belongs to (user, game, comment, etc).
 * @returns id.trim()
 */
const checkId = (id, funcName, id_of_what) => {

  id = checkString(id, "id", funcName);

  if (!ObjectId.isValid(id)) {
    throw {
      status: 400,
      function: funcName,
      error: `Invalid ${id_of_what} ID.`
    }
  }

  return id;

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* INPUT VALIDATION FOR GAMES COLLECTION
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 
 * @param {string} dateReleased 
 * @param {string} funcName 
 * @returns dateReleased.trim()
 */
const checkDateReleased = (dateReleased, funcName) => {

  // Basic string validation.
  dateReleased = checkString(dateReleased, "dateReleased", funcName);

  // Let "N/A" be an acceptable date.
  if (dateReleased === "N/A"){
    return dateReleased;
  }

  let trio = dateReleased.split("/");
  if (trio.length !== 3) {
    throw {
      status: 400,
      function: funcName,
      error: "Improper date."
    }
  }
  let month = trio[0];
  let day = trio[1];
  let year = trio[2];

  if (month.length !== 2 || day.length !== 2 || year.length !== 4) {
    throw {
      status: 400,
      function: funcName,
      error: "Improper date."
    }
  }

  month = parseInt(month);
  day = parseInt(day);
  year = parseInt(year);

  if (isNaN(month) || isNaN(day) || isNaN(year)) {
    throw {
      status: 400,
      function: funcName,
      error: "Improper date."
    }
  }

  if (!(month >= 1 && month <= 12)) {
    throw {
      status: 400,
      function: funcName,
      error: "Improper date."
    }
  }

  if (!(day >= 1 && day <= 31)) {
    throw {
      status: 400,
      function: funcName,
      error: "Improper date."
    }
  }

  let currentYear = new Date().getFullYear();

  if (!(year >= 1900 && year <= currentYear + 2)) {
    throw {
      status: 400,
      function: funcName,
      error: "Improper date."
    }
  }

  if (month === 4 || month === 6 || month === 9 || month === 11) {
    if (day === 31) {
      throw {
        status: 400,
        function: funcName,
        error: "Date does not exist."
      }
    }
  }

  if (month === 2 && day > 28) {
    throw {
      status: 400,
      function: funcName,
      error: "Date does not exist."
    }
  }

  return dateReleased;

};

/**
 * 
 * @param {object} question 
 * @param {string} funcName 
 * @returns 
 */
const checkQuestion = (question, funcName) => {

  // Check that question was supplied.
  if (!question) {
    throw {
      status: 400,
      function: funcName,
      error: ""
    }
  }
  
  // Check that question is an object.
  if (typeof question !== "object") {
    throw `${funcName} Error: question must be an object.`;
  }
  if (Array.isArray(question)) {
    throw `${funcName} Error: question must be an object.`;
  }
  
  // Check the "field" attribute of the question object.
  let field = question.field;
  if (!field) {
    throw `${funcName} Error: Each question must have a field key.`;
  }

  // Check the "type" attribute of the question object.
  let type = question.type;
  if (!type) {
    throw `${funcName} Error: Each question must have a type key.`;
  }

  // Check the "options" attribute of the question object.
  let options = question.options;
  if (!options) {
    throw `${funcName} Error: Each question must have a options key.`;
  }

  // Make sure there are no other keys in the questions object.
  if (Object.keys(question).length !== 3) {
    throw `${funcName} Error: A question has unnecessary keys.`;
  }

  // Check that 'field' and 'type' are strings.
  field = checkString(field, funcName);
  type = checkString(type, funcName);
  if (type !== "text" && type !== "select") {
    throw `${funcName} Error: Question types can only be 'text' or 'select'.`;
  }

  // Check that 'options' is an array.
  if (!Array.isArray(options)) {
    throw `${funcName} Error: Question options must be an array.`;
  }

  // If type is "text"...
  if (type === "text") {

    // ...make sure that the options array is empty.
    if (options.length !== 0) {
      throw `${funcName} Error: Cannot have a text question with options.`;
    }

  // If type is "select"...
  } else if (type === "select") {

    // ...make sure that the options array has at least 2 elements.
    if (options.length < 2) {
      throw `${funcName} Error: There must be at least 2 options for a select-type question.`;
    }

    for (let i = 0; i < options.length; i++) {
      options[i] = checkString(options[i], `Options`, funcName);
    }

  } else {

    throw {
      status: 500,
      function: funcName,
      error: "Type must be either 'text' or 'select'."
    };
    
  }

  return { field: field, type: type, options: options };

};

/**
 * 
 * @param {array} form 
 * @param {string} funcName 
 * @returns 
 */
const checkForm = (form, funcName) => {

  // Check that a form was supplied.
  if (!form) {
    throw {
      status: 400,
      function: funcName,
      error: "Form is not defined."
    }
  }

  // Check that form is an array.
  if (!Array.isArray(form)) {
    throw {
      status: 400,
      function: funcName,
      error: "Form must be an array."
    }
  }

  // For each element of form, check that it is a valid GameFormField.
  for (let i = 0; i < form.length; i++) {
    form[i] = checkQuestion(form[i], funcName);
  }

  return form;

};


/**
 * 
 * @param {number} rating 
 * @param {string} funcName 
 * @returns rating
 */
const checkRating = (rating, funcName) => {

  if (!rating) {
    throw {
      status: 400,
      function: funcName,
      error: "Rating is undefined."
    }
  }

  if (typeof rating !== "number") {
    throw {
      status: 400,
      function: funcName,
      error: "Rating must be a number."
    }
  }

  if (rating < 1 || rating > 5) {
    throw {
      status: 400,
      function: funcName,
      error: "Rating must be a number between 1 and 5."
    }
  }

  return rating;

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* INPUT VALIDATION FOR USERS COLLECTION
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Input validation for username parameter.
 * Only checks if the passed username satisfies username constraints.
 * Does NOT check if the username already exists in the Users collection.
 * @param {string} username The username to check.
 * @param {string} funcName The name of the function calling this function.
 * @returns {string} username.trim()
 */
const checkUsername = (username, funcName) => {

    username = checkString(username, "username", funcName);

    if (username.length < 3 || username.length > 15) {
      throw 'Username must be between 3-15 characters';
    }

    for (let char of username) {

      if (LETTERS_AND_NUMBERS_PLUS.indexOf(char) < 0) {
        throw "Invalid username. Allowed characters: A-Z (case insensitive), 0-9, _ , . , -";
      }

    }

    if (username[0] === "." || username[username.length-1] === ".") {
      throw 'Username cannot start or end with \'.\'';
    }

    return username;
}

/**
 * 
 * @param {*} email 
 * @param {*} funcName 
 * @returns email.trim()
 */
const checkEmail = (email, funcName) => {
  email = checkString(email, "email", funcName);
    if (email === undefined || typeof email != 'string' || email.trim() === "") throw 'Invalid email.'; 
        let atSymbol = -1;
        for (let i = 0; i < email.length; i++){
            if (email.charCodeAt(i) === 64){ //if char is @ break the loop
                atSymbol = i;
                break;
            }
            //Same allowed characters as username
            if ( 
                email.charCodeAt(i) !== 95 &&
                email.charCodeAt(i) !== 46 &&
                email.charCodeAt(i) !== 45 &&
                !(email.charCodeAt(i) >= 48 && email.charCodeAt(i) <= 57) &&
                !(email.charCodeAt(i) >= 65 && email.charCodeAt(i) <= 90 ) &&
                !(email.charCodeAt(i) >= 97 && email.charCodeAt(i) <= 122)){
                    throw 'Invalid email address.'; 
                }
            if (email.charCodeAt(i) === 46 && email.charCodeAt(i+1) === 46) throw 'invalid email address.'
        }
        if (atSymbol === -1) throw 'Invalid email address. ' 
        let period = false;
        let count = 0;
        for (let i = atSymbol + 1; i < email.length; i++){
            if (period) count++;                                //Making sure there is at least 2 characters after the period
            if (email.charCodeAt(i) === 46 && !period){         //Making sure there is a period at all
                period = true;
            }
            else if (
                !(email.charCodeAt(i) >= 48 && email.charCodeAt(i) <= 57) &&    
                !(email.charCodeAt(i) >= 65 && email.charCodeAt(i) <= 90 ) &&
                !(email.charCodeAt(i) >= 97 && email.charCodeAt(i) <= 122)){
                    throw 'Invalid email domain.'; 
                }
        }
        if (!period || count < 2){ 
            throw 'Invalid email domain.'
        }
    return email;
}

/**
 * 
 * @param {*} password 
 * @returns 
 */
const checkPassword = (password) => {
    if (password === undefined || typeof password !== 'string' || password.trim() === "") throw 'Invalid password.';
        if (password.length < 8) throw 'Invalid password (8+ characters).'                        
        const characters = {lower: 0, upper: 0, special: 0, number: 0};                                              
        for (let i = 0; i < password.length; i++){
            if (password.charCodeAt(i) >= 48 && password.charCodeAt(i) <= 57) characters['number']++;
            else if (password.charCodeAt(i) >= 65 && password.charCodeAt(i) <= 90) characters['upper']++;
            else if (password.charCodeAt(i) >= 97 && password.charCodeAt(i) <= 122) characters['lower']++;
            else if (password.charCodeAt(i) === 32){
              throw 'Spaces not allowed in password.'
            }
            else characters['special']++;                  
        }                       
        if (characters['lower'] === 0 || characters['upper'] === 0 || characters['special'] === 0 || characters['number'] === 0)  //If one chartype isnt seen throw error
            throw 'Invalid password (must include 1 A-Z, 1 a-z, 1 special character, and 1 number.'
    return password;
}

/**
 * 
 * @param {*} image 
 * @param {*} funcName 
 * @returns 
 */
const checkImage = (image, funcName) => {
  let pfp = checkString(image, "profile picture", funcName);
  pfp = pfp.trim();
  if (pfp.length <= 4) throw 'Invalid image'
  let last4 = pfp.slice(pfp.length - 4, pfp.length);
  if (last4 !== ".jpg") throw 'Invalid image format (must be .jpg)'
  return pfp;
}

/**
 * 
 * @param {*} admin 
 * @param {*} funcName 
 * @returns 
 */
const checkAdmin = (admin, funcName) => {
  
  if (admin === undefined || admin === null) {
    throw {
      status: 400,
      function: funcName,
      error: "Admin is undefined."
    }
  }

  if (typeof admin !== "boolean") {
    throw {
      status: 400,
      function: funcName,
      error: "Admin must be a boolean."
    }
  }

  return admin;

}


/**
 * 
 * @param {array} userGameInfo An array of
 * @param {string} gameId 
 * @returns 
 */
const checkUserGameInfo = (userGameInfo, gameId) => {
  
  // Make sure userGameInfo is an array.
  // Get the form of the game associated with gameId.
  // Then, for each element in userGameInfo, make sure it is of type object and has only two keys: 'field_name' and 'value'.
  // For each element, check that the value for 'field_name' matches a value in the game form. Since both form and UserGames are an array of objects, the field name's SHOULD appear in the same order (perhaps enforce that, too).
  // Then, check that the value of 'value' is of the correct type, as dictated by the game form's field's 'type' attribute.

  return;

}

export {
  checkString,
  checkDateReleased,
  checkForm,
  checkUsername,
  checkEmail,
  checkPassword,
  checkImage,
  checkAdmin,
  checkId,
  checkUserGameInfo,
  checkRating
};
