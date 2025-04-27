import {ObjectId} from "mongodb";

// Strings to be used for checking username and password constraints.
const UPPERCASE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_LETTERS = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const LETTERS_AND_NUMBERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";


/**
 * Input validation for string parameters.
 * @param {string} str The string to validate.
 * @param {string} varName The name of the string variable as it is called in the function that called this helper function.
 * @param {string} funcName The name of the function that called this helper function.
 * @returns {string} str.trim()
 */
const checkString = (str, varName, funcName) => {

  if (!str) {
    throw `${funcName} Error: ${varName} is undefined.`;
    /*
    throw {
      status: 400,
      function: funcName,
      error: `${varName} is undefined.`
    };
    */
  }

  if (typeof str !== "string") {
    throw `${funcName} Error: ${varName} must be a string.`;
  }

  str = str.trim();

  if (str.length === 0) {
    throw `${funcName} Error: ${varName} cannot be empty or just spaces.`;
  }

  return str;

};

const checkDateReleased = (dateReleased, funcName) => {
  dateReleased = checkString(dateReleased, "dateReleased", funcName);
  if(dateReleased === "unknown"){
    return dateReleased;
  }
  let trio = dateReleased.split("/");
  if (trio.length !== 3) {
    throw `Improper date`;
  }
  let month = trio[0];
  let day = trio[1];
  let year = trio[2];

  if (month.length !== 2 || day.length !== 2 || year.length !== 4) {
    throw `${funcName} Error: Improper date`;
  }

  month = parseInt(month);
  day = parseInt(day);
  year = parseInt(year);

  if (isNaN(month) || isNaN(day) || isNaN(year)) {
    throw `${funcName} Error: Improper date`;
  }

  if (!(month >= 1 && month <= 12)) {
    throw `${funcName} Error: Improper date`;
  }

  if (!(day >= 1 && day <= 31)) {
    throw `${funcName} Error: Improper date`;
  }

  let currentYear = new Date().getFullYear();

  if (!(year >= 1900 && year <= currentYear + 2)) {
    throw `${funcName} Error: Improper date`;
  }

  if (month === 4 || month === 6 || month === 9 || month === 11) {
    if (day === 31) {
      throw `${funcName} Error: Date does not exist`;
    }
  }

  if (month === 2 && day > 28) {
    throw `${funcName} Error: Date does not exist`;
  }

  return dateReleased;
};

const checkQuestion = (question, funcName) => {
  let field = question.field;
  if (!field) {
    throw `${funcName} Error: Each question must have a field key.`;
  }
  let type = question.type;
  if (!type) {
    throw `${funcName} Error: Each question must have a type key.`;
  }
  let options = question.options;
  if (!options) {
    throw `${funcName} Error: Each question must have a options key.`;
  }

  if (Object.keys(question).length !== 3) {
    throw `${funcName} Error: A question has unnecessary keys.`;
  }

  field = checkString(field, funcName);
  type = checkString(type, funcName);
  if (type !== "text" && type !== "select") {
    throw `${funcName} Error: Question types can only be 'text' or 'select'.`;
  }

  if (!Array.isArray(options)) {
    throw `${funcName} Error: Question options must be an array.`;
  }

  if (type === "text" && options.length !== 0) {
    if (options.length !== 0) {
      throw `${funcName} Error: Cannot have a text question with options.`;
    } else {
      if (options.length === 0) {
        throw `${funcName} Error: Cannot have a select question without options.`;
      }
      for (let option of options) {
        option = checkString(option, funcName);
      }
    }
  }
  return { field: field, type: type, options: options };
};

const checkForm = (form, funcName) => {
  if (!form) {
    throw `${funcName} Error: Form is not defined.`;
  }
  if (!Array.isArray(form)) {
    throw `${funcName} Error: Form must be an array.`;
  }

  for (let question of form) {
    question = checkQuestion(question, funcName);
  }

  return form;

};

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

    for (let i = 0; i < username.length; i++) {

        //Allowed characters: A-Z (case insensitive), 0-9, _ , . , -
        if (
        username.charCodeAt(i) !==  95 &&
        username.charCodeAt(i) !== 46 &&
        username.charCodeAt(i) !== 45 &&
        !(username.charCodeAt(i) >= 48 && username.charCodeAt(i) <= 57) &&
        !(username.charCodeAt(i) >= 65 && username.charCodeAt(i) <= 90 ) &&
        !(username.charCodeAt(i) >= 97 && username.charCodeAt(i) <= 122)){
            throw "Invalid username. Allowed characters: A-Z (case insensitive), 0-9, _ , . , -";
        } 
    }
    if (username.charCodeAt(0) === 46 || username.charCodeAt(username.length-1) === 46) throw 'Username cannot start or end with \'.\''; //Username cannot start/end with a . (ugly)
    if (username.length < 3 || username.length > 15) throw 'Username must be between 3-15 characters'; 
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
  
  if (!admin) {
    throw `${funcName} Error: admin is undefined.`;
  }

  if (typeof admin !== "boolean") {
    throw `${funcName} Error: admin must be a boolean.`;
  }

  return admin;

}


/**
 * 
 * @param {*} id 
 * @param {*} funcName 
 * @param {*} id_of_what 
 * @returns 
 */
const checkId = (id, funcName, id_of_what) => {

  id = checkString(id, "id", funcName);

  if (!ObjectId.isValid(id)) {
    throw `${funcName} Error: Invalid ${id_of_what} ID.`;
  }

  return id;

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


/**
 * 
 * @param {number} rating 
 * @param {string} funcName 
 * @returns rating
 */
const checkRating = (rating, funcName) => {

  if (!rating) {
    throw `${funcName} Error: rating is undefined.`;
  }

  if (typeof rating !== "number") {
    throw `${funcName} Error: rating must be a number.`;
  }

  if (rating < 1 || rating > 5) {
    throw `${funcName} Error: rating must be a number between 1 and 5.`;
  }

  return rating;

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
