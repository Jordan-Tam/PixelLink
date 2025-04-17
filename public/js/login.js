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

        // Username validation.
        if (!username_input || username_input.length === 0) {
            error.innerHTML = "Please enter a valid username.";
            error.hidden = false;
            return;
        }
        for (let char of username_input) {
            if ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.-".indexOf(char) < 0) {
                error.innerHTML = "Please enter a valid username.";
                error.hidden = false;
                return;
            }
        }

        loginForm.reset();
        error.innerHTML = "";

    })
}