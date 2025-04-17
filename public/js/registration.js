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

        // Username validation.
        if (!username_input || username_input.length === 0) {
            error.innerHTML = "Username must be between 3-15 characters long and only include letters, numbers, periods, underscores, and minus signs.";
            error.hidden = false;
            return;
        }
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

        registrationForm.reset();
        error.innerHTML = "";

    })
}