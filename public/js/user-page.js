const UPPERCASE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_LETTERS = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";

// Change Username Form
let changeUsernameForm = document.getElementById("changeUsernameForm");
let username = document.getElementById("username");
let changeUsernameSubmit = document.getElementById("changeUsernameSubmit");
let changeUsernameError = document.getElementById("changeUsernameError");

if (changeUsernameForm !== null) {
    changeUsernameForm.addEventListener("submit", (event) => {

        // Rehide the error paragraph.
        changeUsernameError.hidden = true;

        // Get user input.
        let username_input = username.value.trim();

        // Username validation.
        if (!username_input || username_input.length === 0) {
            event.preventDefault();
            changeUsernameError.innerHTML = "Username must be between 3-15 characters long and only include letters, numbers, periods, underscores, and minus signs.";
            changeUsernameError.hidden = false;
            return;
        }

        if (username_input.charAt(0) === '.' || username_input.charAt(username_input.length - 1) === '.') {
            event.preventDefault();
            changeUsernameError.innerHTML = "Username cannot start or end with a period";
            changeUsernameError.hidden = false;
            return;
        }

        for (let char of username_input) {
            if ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_.-".indexOf(char) < 0) {
                event.preventDefault();
                changeUsernameError.innerHTML = `Invalid Character in username (${char})`;
                changeUsernameError.hidden = false;
                return;
            }
        }

    });
}

// Change Password Form
let changePasswordForm = document.getElementById("changePasswordForm");
let password = document.getElementById("password");
let confirmPassword = document.getElementById("confirmPassword");
let changePasswordSubmit = document.getElementById("changePasswordSubmit");
let changePasswordError = document.getElementById("changePasswordError");

if (changePasswordForm !== null) {
    changePasswordForm.addEventListener("submit", (event) => {

        // Rehide the error paragraph.
        changePasswordError.hidden = true;

        let password_input = password.value;
        let confirmPassword_input = confirmPassword.value;

        if (password_input !== confirmPassword_input) {
            event.preventDefault();
            changePasswordError.innerHTML = "Password and Confirm Password fields do not match.";
            changePasswordError.hidden = false;
            return;
        }

        if (password_input.length < 8) {
            event.preventDefault();
            changePasswordError.innerHTML = "Password must be 8+ characters...";
            changePasswordError.hidden = false;
            return;
        }

        const characters = {
            lower: 0,
            upper: 0,
            special: 0,
            number: 0
        };

        for (let char of password_input) {
            if (UPPERCASE_LETTERS.indexOf(char) > -1) {
                characters.upper++;
            } else if (LOWERCASE_LETTERS.indexOf(char) > -1) {
                characters.lower++;
            } else if (NUMBERS.indexOf(char) > -1) {
                characters.number++;
            } else {
                if (" ".indexOf(char) > -1) {
                    event.preventDefault();
                    changePasswordError.innerHTML = "Password cannot have spaces.";
                    changePasswordError.hidden = false;
                    return;
                }
                characters.special++;
            }
        }

        if (characters['lower'] === 0 || characters['upper'] === 0 || characters['special'] === 0 || characters['number'] === 0) {
            event.preventDefault();
            changePasswordError.innerHTML = "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.";
            changePasswordError.hidden = false;
            return;
        }

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