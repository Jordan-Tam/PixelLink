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

export { checkString, checkDateReleased, checkForm };
