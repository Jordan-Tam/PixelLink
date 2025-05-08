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