let gameForm = document.getElementById("gameForm");


// We needed a way to keep track of the field-value pairs when a user submits a game form
// I definitely overcomplicated things but basically what I do is I intercept the 
// original form and make a new one with the desired format, submitting that one instead.
// There are definitely easier ways to do this but it works so yeah.
// I also plan to add client-side checking, but wanted to get the functionality working first

if (gameForm) {
  gameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let userGameInfo = [];
    let i = 0;
    while (true) {  // Get all of the field and value pairs into the userGameInfo array.
      let field_name = document.getElementById("label" + i);
      if (!field_name) {
        break;
      }
      field_name = field_name.firstChild.nodeValue.trim();
      let value = document.getElementById("form_input" + i);
      if (!value) {
        continue;
      }
      value = value.value;
      userGameInfo.push({ field_name: field_name, value: value });
      i++;
    }

    let newForm = document.createElement("form");   // Create a new form to be submitted instead
    newForm.hidden = true;  // Hide the form from the user, since I need to attach it to the DOM before submitting.
    newForm.setAttribute("method", "POST");
    newForm.setAttribute("action", gameForm.action);
    for (let elem of userGameInfo) {
      let answer = document.createElement("input"); // Fill in my mock form
      answer.id = elem.field_name;
      answer.name = elem.field_name;
      answer.value = elem.value;
      newForm.appendChild(answer);
    }
    document.body.appendChild(newForm); // Apparently the form needs to actually be attached to the DOM in order to be submitted, so I just do it here before submitting.
    newForm.submit();
  });
}
