let userSearchForm = document.getElementById("userSearchForm");
let searchBar = document.getElementById("searchBar");
let usersContainer = document.getElementById("usersContainer");
let gameSelect = document.getElementById("gameSelect");
let allFormsContainer = document.getElementById("allFormsContainer");
let error = document.getElementById("error");

if (userSearchForm) {
  userSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let nobody = true;

    let search = searchBar.value.toLowerCase().trim();  // Get the name the user searched for

    let users = usersContainer.children;    // Get the each user div
    for (let user of users) {
      let username = user.firstElementChild.textContent.toLowerCase().trim();   //Find the username in each <a> tag
      if (username.includes(search)) {  // If this username includes the searched string, then unhide it
        user.hidden = false;
        nobody = false;
      } else {
        user.hidden = true;     // Hide the user otherwise
      }
    }

    // Show a message if there was nobody found
    if (nobody) {
      error.hidden = false;
    } else {
      error.hidden = true;
    }
  });
}

if (gameSelect) {
  document.addEventListener("change", (event) => {
    let gameName = gameSelect.value;        // Get the game name the user selected from the dropdown
    let containers = allFormsContainer.children;    // Get each game form container
    for (let container of containers) {
      if (container.firstElementChild.id === gameName) {    // If the game matches up with the selected game, unhide the inputs
        container.hidden = false;
      } else {
        container.hidden = true;    // Otherwise hide them
      }
    }
  });
}
