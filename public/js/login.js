// Get HTML elements.
let error = document.getElementById("error");
let loginForm = document.getElementById("loginForm");
let username = document.getElementById("username");
let password = document.getElementById("password");

if (loginForm) {
    loginForm.addEventListener('submit', (event) => {

        // Rehide the error paragraph.
        error.hidden = true;

        let username_input = username.value.trim();
        let password_input = password.value;

        // Username validation.
        if (!username_input || username_input.length === 0 || username_input.length < 3 || username_input.length > 15) {
            event.preventDefault();
            error.innerHTML = "Username must be between 3-15 characters long and only include letters, numbers, periods, underscores, and minus signs.";
            error.hidden = false;
            //loginForm.reset();
            return;
        }

        if (username_input.charAt(0) === '.' || username_input.charAt(username_input.length - 1) === '.'){
            event.preventDefault();
            error.innerHTML = "Username cannot start or end with a period.";
            error.hidden = false;
            //loginForm.reset();
            return;
        }

        for (let char of username_input) {
            if ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.-".indexOf(char) < 0) {
                event.preventDefault();
                error.innerHTML = "Username must be between 3-15 characters long and only include letters, numbers, periods, underscores, and minus signs.";
                error.hidden = false;
                //loginForm.reset();
                return;
            }
        }

        if (password_input.length < 8){
            event.preventDefault();
            error.innerHTML = "Password must be 8+ characters."
            error.hidden = false;
            //loginForm.reset();
            return;
        }

        const characters = {lower: 0, upper: 0, special: 0, number: 0};    
        for (let i = 0; i < password_input.length; i++){
            if (password_input.charCodeAt(i) >= 48 && password_input.charCodeAt(i) <= 57) characters['number']++;
            else if (password_input.charCodeAt(i) >= 65 && password_input.charCodeAt(i) <= 90) characters['upper']++;
            else if (password_input.charCodeAt(i) >= 97 && password_input.charCodeAt(i) <= 122) characters['lower']++;
            else if (password_input.charCodeAt(i) === 32){
                event.preventDefault();
                error.innerHTML = "Spaces not allowed in password";
                error.hidden = false;
                //loginForm.reset();
                return;
            }
            else characters['special']++;                  
        }                       
        if (characters['lower'] === 0 || characters['upper'] === 0 || characters['special'] === 0 || characters['number'] === 0){
            event.preventDefault();
            error.innerHTML = "Password must contain 1+ uppercase, 1+ lowercase, 1+ number, and 1+ special character";
            error.hidden = false;
            //loginForm.reset();
            return;
        }

        //loginForm.reset();
        error.innerHTML = "";

    })
}