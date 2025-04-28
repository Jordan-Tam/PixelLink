// Get HTML elements.
let error = document.getElementById("error");
let registrationForm = document.getElementById("registrationForm");
let email = document.getElementById("email");
let username = document.getElementById("username");
let password = document.getElementById("password");
let confirmPassword = document.getElementById("confirmPassword");

if (registrationForm) {
    registrationForm.addEventListener('submit', (event) => {

        // Rehide the error paragraph.
        error.hidden = true;

        // Prevent the default behavior of the form.
        event.preventDefault();

        let email_input = email.value.trim();
        let username_input = username.value.trim();
        let password_input = password.value;
        let confirmPassword_input = confirmPassword.value;

        // Email validation.
        if (!email_input || email_input.length === 0) {
            error.innerHTML = "Please enter a valid email.";
            error.hidden = false;
            return;
        }

        if(email_input.includes('..')){
            error.innerHTML = "Invalid email address. (two periods in a row)"
            error.hidden = false;
            return;
        }

        let atSymbol = false;
        let period = false;
        let after_period_count = 0;
        for (let char of  email_input){
            if (!atSymbol){
                if (char === '@'){ 
                    atSymbol = true;
                    break;
                }
                else if ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.-".indexOf(char) < 0) {
                        error.innerHTML = "Invalid email address."
                        error.hidden = false;
                        return;
                }
            } else {

                if (!period){

                    if (char === "."){
                        period = true;
                    }
                    else if ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-".indexOf(char) < 0){
                            error.innerHTML = "Invalid email domain."
                            error.hidden = false;
                            return;
                    } 
                    
                } else {

                    after_period_count++;
                    if ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(char) < 0){
                        error.innerHTML = "Invalid email domain."
                        error.hidden = false;
                        return;
                    } 
                

                }
            
            }
        }

        if (after_period_count < 2 || !period ){
            error.innerHTML = "Invalid email domain."
            error.hidden = false;
            return;
        }


        if (!username_input || username_input.trim().length === 0) {
            error.innerHTML = "Username must be between 3-15 characters long and only include letters, numbers, periods, underscores, and minus signs.";
            error.hidden = false;
            return;
        }

        if (username.charAt(0) === '.' || username.charAt(username.length - 1) === '.'){
            error.innerHTML = "Username cannot start or end with a period.";
            error.hidden = false;
            return;
        }

        username_input = username_input.trim();
        for (let char of username_input) {
            if ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.-".indexOf(char) < 0) {
                error.innerHTML = "Username must be between 3-15 characters long and only include letters, numbers, periods, underscores, and minus signs.";
                error.hidden = false;
                return;
            }
        }

        // Confirm password validation.
        if (password_input !== confirmPassword_input) {
            error.innerHTML = "Password and Confirm Password fields do not match."
            error.hidden = false;
            return;
        }

        //Password validation
        if (password_input.length < 8){
            error.innerHTML = "Password must be 8+ characters."
            error.hidden = false;
            return;
        }

        const characters = {lower: 0, upper: 0, special: 0, number: 0};    
        for (let i = 0; i < password.length; i++){
            if (password_input.charCodeAt(i) >= 48 && password_input.charCodeAt(i) <= 57) characters['number']++;
            else if (password_input.charCodeAt(i) >= 65 && password_input.charCodeAt(i) <= 90) characters['upper']++;
            else if (password_input.charCodeAt(i) >= 97 && password_input.charCodeAt(i) <= 122) characters['lower']++;
            else if (password_input.charCodeAt(i) === 32){
                error.innerHTML = "Spaces not allowed in password";
                error.hidden = false;
                return;
            }
            else characters['special']++;                  
        }                       
        if (characters['lower'] === 0 || characters['upper'] === 0 || characters['special'] === 0 || characters['number'] === 0){
            error.innerHTML = "Password must contain 1+ uppercase, 1+ lowercase, 1+ number, and 1+ special character ";
            error.hidden = false;
            return;
        }
            

        registrationForm.reset();
        error.innerHTML = "";

    })
}