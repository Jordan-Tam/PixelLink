let checkString = (str, varName, funcName) => {
  if (!str) {
    throw `${funcName} Error: ${varName} is undefined.`;
  }

  if (typeof str !== "string") {
    `${funcName} Error: ${varName} must be a string.`;
  }

  str = str.trim();

  if (str.length === 0) {
    `${funcName} Error: ${varName} cannot be empty or just spaces.`;
  }
};

const checkDateReleased = (dateReleased, funcName) => {
  dateReleased = checkString(dateReleased, "dateReleased", funcName);
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

const checkUsername = (username) => {
    for (let i = 0; i < username.length; i++){
        //Allowed characters: A-Z (case insensitive), 0-9, _ , . , -
        if (
        username.charCodeAt(i) !==  95 &&
        username.charCodeAt(i) !== 46 &&
        username.charCodeAt(i) !== 45 &&
        !(username.charCodeAt(i) >= 48 && username.charCodeAt(i) <= 57) &&
        !(username.charCodeAt(i) >= 65 && username.charCodeAt(i) <= 90 ) &&
        !(username.charCodeAt(i) >= 97 && username.charCodeAt(i) <= 122)){
            throw 'Invalid username.';
        } 
    }
    if (username.charCodeAt(0) === 46 || username.charCodeAt(username.length-1) === 46) throw 'Username cannot start or end with \'.\''; //Username cannot start/end with a . (ugly)
    if (username.length < 3 || username.length > 15) throw 'Username must be between 3-15 characters'; 
    return username;
}

const checkEmail = (email) => {
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
            if (email.charCodeAt(i) === 46 && email.charCodeAt(i+1) === 46) throw 'invalid email address. '
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

const passwordCheck = (password) => {
    if (password === undefined || typeof password != 'string' || password.trim() === "") throw 'Invalid password.';
        if (password.length < 8) throw 'Invalid password (8+ characters).'                        
        const characters = {lower: 0, upper: 0, special: 0, number: 0};                                              
        for (let i = 0; i < password.length; i++){
            if (password.charCodeAt(i) > 48 && password.charCodeAt(i) < 57) characters['number']++;
            else if (password.charCodeAt(i) >= 65 && password.charCodeAt(i) <= 90) characters['upper']++;
            else if (password.charCodeAt(i) >= 97 && password.charCodeAt(i) <= 122) characters['lower']++;
            else characters['special']++;                  
        }                       
        if (characters['lower'] === 0 || characters['upper'] === 0 || characters['special'] === 0 || characters['number'] === 0)  //If one chartype isnt seen throw error
            throw 'Invalid password (must include 1 A-Z, 1 a-z, 1 special character, and 1 number.'
    return password;
}
export { checkString, checkDateReleased, checkForm, checkUsername, checkEmail, passwordCheck };
