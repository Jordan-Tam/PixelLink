import {ObjectId} from "mongodb";
import xss from "xss"

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
  if (str === undefined || str === null) {
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
      error: `${varName} cannot be an empty string or a string that contains only spaces.`
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

    // Basic string validation.
    username = checkString(username, "Username", funcName);

    // Username must be between 3-15 characters long.
    if (username.length < 3 || username.length > 15) {
      throw {
        status: 400,
        function: funcName,
        error: "Username must be between 3-15 characters long."
      }
    }

    // Check that username only contains letters, numbers, underscores, periods, and hyphens.
    for (let char of username) {
      if (LETTERS_AND_NUMBERS_PLUS.indexOf(char) < 0) {
        throw {
          status: 400,
          function: funcName,
          error: "Invalid username: Username should contain only letters, numbers, underscores, periods, and hyphens."
        };
      }
    }

    // Username should not begin or end with a period.
    if (username[0] === "." || username[username.length-1] === ".") {
      throw {
        status: 400,
        function: funcName,
        error: "Username cannot start or end with a period."
      };
    }

    return username;
}

/**
 * 
 * @param {*} password 
 * @param {*} funcName 
 * @returns 
 */
const checkPassword = (password, funcName) => {

  // Basic string validation.
  // Password cannot have spaces, so we do not accept the trimmed string.
  checkString(password, "Password", funcName);

  // Check that password is at least 8 characters long.
  if (password.length < 8) {
    throw {
      status: 400,
      function: funcName,
      error: "Password must be at least 8 characters long."
    };
  }

  // Check that password has at least 1 uppercase letter.
  // Check that password has at least 1 lowercase letter.
  // Check that password has at least 1 number.
  // Check that password has at least 1 special character.
  const characters = {
    upper: 0,
    lower: 0,
    number: 0,
    special: 0
  };

  for (let char of password) {
    if (UPPERCASE_LETTERS.indexOf(char) > -1) {
      characters.upper++;
    } else if (LOWERCASE_LETTERS.indexOf(char) > -1) {
      characters.lower++;
    } else if (NUMBERS.indexOf(char) > -1) {
      characters.number++;
    } else {
      if (" ".indexOf(char) > -1) {
        throw {
          status: 400,
          function: funcName,
          error: "Password cannot have spaces."
        }
      }
      characters.special++;
    }
  }

  if (characters['lower'] === 0 || characters['upper'] === 0 || characters['special'] === 0 || characters['number'] === 0) {
    throw {
      status: 400,
      function: funcName,
      error: "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
    };
  }

    return password;

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
 * @param {object} game
 * @returns 
 */
const checkUserGameInfo = (userGameInfo, game, funcName) => {
  // Make sure userGameInfo is an array.
  // Make sure the game is an object
  // Then, for each element in userGameInfo, make sure it is of type object and has only two keys: 'field_name' and 'value'.
  // For each element, check that the value for 'field_name' matches a value in the game form. Since both form and UserGames are an array of objects, the field name's SHOULD appear in the same order (perhaps enforce that, too).
  // Then, check that the value of 'value' is of the correct type, as dictated by the game form's field's 'type' attribute.

  //Make sure userGameInfo is an array
  if (!Array.isArray(userGameInfo)) {
    throw {
      status: 400,
      function: funcName,
      error: "userGameInfo must be an array.",
    };
  }

  //Make sure the game is an object
  if (typeof game !== "object") {
    throw {
      status: 400,
      function: funcName,
      error: "game must be an object.",
    };
  }

  //Get the game's form and ensure it's format is correct.
  let gameForm = game.form;
  gameForm = checkForm(gameForm, funcName);

  // For each response, check if the field_name matches a field in the form
  // Then check to make sure that the type of value is a string
  // If the type is number, make sure it is a string representation of a number
  // If the type is option, make sure the value is one of the options

  let retval = []

  for (let response of userGameInfo) {
    let field_name = response.field_name;
    if (!field_name) {
      throw {
        status: 400,
        function: funcName,
        error: "Each user game form must have a 'field_name' property.",
      };
    }

    let unanswered = false;
    let value = response.value;   // Check to see if the question went unanswered
    if(value === ""){
      unanswered = true;
    }

    if (!value && !unanswered) {
      throw {
        status: 400,
        function: funcName,
        error: "Each user game form must have a 'value' property.",
      };
    }

    field_name = checkString(field_name, "field_name", "checkUserGameInfo");
    if(!unanswered){
      value = checkString(value, "value", "checkUserGameInfo");
    }
  

    let validQuestion = false;
    for (let question of gameForm) {
      if (question.field === field_name) {
        validQuestion = true;
        if (!unanswered && question.type === "number" && Number.isNaN(parseInt(value))) {
          // Throw if a number is not given to a question with number type
          throw {
            status: 400,
            function: funcName,
            error:
              "A question with a number type must receive a value that is a number.",
          };
        }
    if (
      !unanswered &&
      question.type === "number" &&
      !(
        parseInt(value) >= parseInt(question.domain[0]) &&
        parseInt(value) <= parseInt(question.domain[1])
      )
    ) {
      // Throw if a number is not between the domain
      throw {
        status: 400,
        function: funcName,
        error:
          "A question with a number type must receive a value that is within the domain.",
      };
    }
        if (
          !unanswered &&
          question.type === "select" &&
          !question.options.includes(value)
        ) {
          // Throw if the user gives an answer that is not one of the options in a question with options type
          throw {
            status: 400,
            function: funcName,
            error:
              "A question with a select type must receive a value that is one of the options.",
          };
        }
        retval.push({ field_name: field_name, value: value });  // Add the valid field into the return value
        continue;
      }
    }
    if (!validQuestion) {
      throw {
        status: 400,
        function: funcName,
        error: `An invalid field_name was provided: ${field_name}`,
      };
    }
  }

  return retval;
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
 * @param {object} formField 
 * @param {string} funcName 
 * @returns 
 */
const checkFormField = (formField, funcName) => {
  // Check that formField was supplied.
  if (!formField) {
    throw {
      status: 400,
      function: funcName,
      error: "",
    };
  }

  // Check that formField is an object.
  if (typeof formField !== "object") {
    throw {
      status: 400,
      function: funcName,
      error: "formField must be an object.",
    };
  }
  if (Array.isArray(formField)) {
    throw {
      status: 400,
      function: funcName,
      error: "formField must be an object.",
    };
  }

  // Check the "field" attribute of the formField object.
  let field = formField.field;
  if (!field) {
    throw {
      status: 400,
      function: funcName,
      error: "Each form field must have a 'field' property.",
    };
  }

  // Check the "type" attribute of the formField object.
  let type = formField.type;
  if (!type) {
    throw {
      status: 400,
      function: funcName,
      error: "Each form field must have a 'type' property.",
    };
  }

  // Check the "options" attribute of the formField object.
  let options = formField.options;
  if (!options) {
    throw {
      status: 400,
      function: funcName,
      error: "Each form field must have an 'options' property.",
    };
  }

  // Check the "domain" attribute of the formField object.
  let domain = formField.domain;
  if (!domain) {
    throw {
      status: 400,
      function: funcName,
      error: "Each form field must have an 'domain' property.",
    };
  }

  // Make sure there are no other keys in the formFields object.
  if (Object.keys(formField).length !== 4) {
    throw {
      status: 400,
      function: funcName,
      error: "The form field contains unnecessary properties.",
    };
  }

  // Check that 'field' and 'type' are strings.
  field = checkString(field, "Form field field", funcName);
  type = checkString(type, "Form field type", funcName);

  // Check that 'options' is an array.
  if (!Array.isArray(options)) {
    throw {
      status: 400,
      function: funcName,
      error: "formField options must be an array.",
    };
  }

  // Check that 'domain' is an array.
  if (!Array.isArray(domain)) {
    throw {
      status: 400,
      function: funcName,
      error: "formField domain must be an array.",
    };
  }

  // If type is "text"...
  if (type === "text") {
    // ...make sure that the options array is empty.
    if (options.length !== 0) {
      throw {
        status: 400,
        function: funcName,
        error: "Cannot have a text formField with options.",
      };
    }
    if (domain.length !== 0) {
      throw {
        status: 400,
        function: funcName,
        error: "Cannot have a text formField with a domain.",
      };
    }
    

    // If type is "number"...
  } else if (type === "number") {
    // ...make sure that the options array is empty.
    if (options.length !== 0) {
      throw {
        status: 400,
        function: funcName,
        error: "Cannot have a number formField with options.",
      };
    }

    if(domain.length !== 2){
      throw {
        status: 400,
        function: funcName,
        error: "A number question must have two numbers in the array (min and max).",
      };
    }

    // Check the domain to make sure it includes string representations of numbers.
    for (let i = 0; i < domain.length; i++) {
      domain[i] = checkString(domain[i], "Domain value", "checkFormField");
      if (isNaN(parseInt(domain[i]))) {
        throw {
          status: 400,
          function: funcName,
          error:
            "The domain's values must have string representations of numbers.",
        };
      }
    }

    if (parseInt(domain[0]) >= parseInt(domain[1])) {
      throw {
        status: 400,
        function: funcName,
        error: "The min of a number question must be lower than the max.",
      };
    }

    // If type is "select"...
  } else if (type === "select") {
    // ...make sure that the options array has at least 2 elements.
    if (options.length < 2) {
      throw {
        status: 400,
        function: funcName,
        error: "There must be at least 2 options for a select-type formField.",
      };
    }

    if (domain.length !== 0) {
      throw {
        status: 400,
        function: funcName,
        error: "Cannot have a text formField with a domain.",
      };
    }

    // Trim all elements in the options array.
    for (let i = 0; i < options.length; i++) {
      options[i] = checkString(options[i], `Options`, funcName);
    }
  } else {
    throw {
      status: 500,
      function: funcName,
      error: "Type must be either 'text', 'number', or 'select'.",
    };
  }

  return { field: field, type: type, options: options, domain: domain };
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
    form[i] = checkFormField(form[i], funcName);
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

  if (rating === undefined || rating === null) {
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

const sanitizeBody = (body) => {

  if(!body){    // Make sure the body is provided
    throw {
      status: 400,
      function: "sanitizeBody",
      error: "req.body must be provided."
    }
  }

  if(typeof body !== "object"){   // Make sure the body is an object
    throw {
      status: 400,
      function: "sanitizeBody",
      error: "req.body must be an object."
    }
  }


  for(let key in body){    // Loop through each key
    body[key] = xss(body[key]); // Run xss on each value
  }

  return body;

}

export {
  checkString,
  checkDateReleased,
  checkForm,
  checkUsername,
  //checkEmail,
  checkPassword,
  //checkImage,
  checkAdmin,
  checkId,
  checkUserGameInfo,
  checkRating,
  sanitizeBody,
};
