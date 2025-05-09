// Change Username Form
let changeUsernameForm = document.getElementById("changeUsernameForm");
let username = document.getElementById("username");
let changeUsernameSubmit = document.getElementById("changeUsernameSubmit");
let changeUsernameError = document.getElementById("changeUsernameError");

if (changeUsernameForm !== null) {
    changeUsernameForm.addEventListener("submit", (event) => {

        // Rehide the error paragraph.
        error.hidden = true;

        // Get user input.
        let username_input = username.value.trim();

        // Username validation.
        if (!username_input || username_input.length === 0) {
            event.preventDefault();
            error.innerHTML = "Username must be between 3-15 characters long and only include letters, numbers, periods, underscores, and minus signs.";
            error.hidden = false;
            return;
        }

        if (username_input.charAt(0) === '.' || username_input.charAt(username_input.length - 1) === '.') {
            event.preventDefault();
            error.innerHTML = "";
            error.hidden = false;
            return;
        }

        for (let char of username_input) {
            if ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.-".indexOf(char) < 0) {
                event.preventDefault();
                error.innerHTML = "";
                error.hidden = false;
                return;
            }
        }

    });
}

// Change Password Form
let changePasswordForm = document.getElementById("changePasswordForm");
let password = document.getElementById("password");
let changePasswordSubmit = document.getElementById("changePasswordSubmit");
let changePasswordError = document.getElementById("changePasswordError");

if (changePasswordForm !== null) {
    changePasswordForm.addEventListener("submit", (event) => {

    });
}

// Comment Form
let commentForm = document.getElementById("commentForm");
let comment = document.getElementById("comment");
let commentSubmit = document.getElementById("commentSubmit");
let commentError = document.getElementById("commentError");

if (commentForm !== null) {
    commentForm.addEventListener("submit", (event) => {

        // Rehide the error paragraph.
        commentError.hidden = true;

        // Get the comment.
        let comment_input = comment.value;

        // Input validation for the comment.
        comment_input = comment_input.trim();
        if (comment_input.length === 0) {
            event.preventDefault();
            commentError.innerHTML = "You can't submit an empty comment!";
            commentError.hidden = false;
        }

    });
}