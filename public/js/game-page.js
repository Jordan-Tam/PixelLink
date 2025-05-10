
//Review Form
let reviewForm = document.getElementById("reviewForm");
let reviewTitle = document.getElementById("title");
let reviewContent = document.getElementById("content");
let reviewRating = document.getElementById("rating");
let reviewError = document.getElementById("reviewError");
let reviewSubmit = document.getElementById("reviewSubmit");

if (reviewForm !== null){
    reviewForm.addEventListener("submit", (event) => {
        // Hide error paragraph
        reviewError.hidden = true;

        // Get review title and content
        let review_title_input = reviewTitle.value;
        let review_content_input = reviewContent.value;

        //Input validation
        review_title_input = review_title_input.trim();
        review_content_input = review_content_input.trim();
        if (review_title_input.length === 0) {
            event.preventDefault();
            reviewError.innerHTML = "You must include a review title!";
            reviewError.hidden = false;
        }
        if (review_content_input.length === 0) {
            event.preventDefault();
            reviewError.innerHTML = "You can't submit an empty review!";
            reviewError.hidden = false;
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