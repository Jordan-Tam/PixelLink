// Get HTML elements.
let error = document.getElementById("error");
let loginForm = document.getElementById("loginForm");
let username = document.getElementById("username");
let password = document.getElementById("password");

if (loginForm) {
    loginForm.addEventListener('submit', (event) => {

        // Rehide the error paragraph.
        error.hidden = true;

        // Prevent the default behavior of the form.
        event.preventDefault();

        let username_input = username.value.trim();
        let password_input = password.value;

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


        // Username validation.
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

        loginForm.reset();
        error.innerHTML = "";

    })
}