
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

export {checkString}