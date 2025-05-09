let userSearchForm = document.getElementById("userSearchForm");
let searchBar = document.getElementById("searchBar");
let usersContainer = document.getElementById("usersContainer");
let gameSelect = document.getElementById("gameSelect");
let allFormsContainer = document.getElementById("allFormsContainer");
let error = document.getElementById("error");

if (userSearchForm) {
  userSearchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    let nobody = true;

    let search = searchBar.value.toLowerCase().trim(); // Get the name the user searched for
    let queries = [];
    let gameId = gameSelect.options[gameSelect.selectedIndex].id;
    if (gameId) {
      let gameName = gameSelect.value; // Get the game name the user selected from the dropdown
      let containers = allFormsContainer.children; // Get each game form container
      for (let container of containers) {
        if (container.firstElementChild.textContent === gameName) {
          let children = container.children;
          let field_name = "";
          let value = "";
          let type = "";
          let operator = "";
          for (let child of children) {
            if (child.className === "fieldLabel") {
              field_name = child.textContent.trim();
            } else if (child.className === "radioLabel") {
              if (child.firstElementChild.checked) {
                operator = child.firstElementChild.value;
              }
            } else if (
              child.className === "text" ||
              child.className === "number" ||
              child.className === "select"
            ) {
              value = child.value.trim();
              type = child.className.trim();
              queries.push({
                field_name: field_name,
                value: value,
                type: type,
                gameId: gameId,
                operator: operator,
              });
              operator = "";
            }
          }
        }
      }
    }

    for (let query of queries) {
      if (query.value.length) {
        // I used the built in fetch API for ajax -> https://www.geeksforgeeks.org/javascript-fetch-method/
        let response = await fetch("", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(query),
        });
        if (response.ok) {
          console.log(await response.json());
        }
      }
    }

    let users = usersContainer.children; // Get the each user div
    for (let user of users) {
      let username = user.firstElementChild.textContent.toLowerCase().trim(); //Find the username in each <a> tag
      if (username.includes(search)) {
        // If this username includes the searched string, then unhide it
        user.hidden = false;
        nobody = false;
      } else {
        user.hidden = true; // Hide the user otherwise
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
    let gameName = gameSelect.value; // Get the game name the user selected from the dropdown
    let containers = allFormsContainer.children; // Get each game form container
    for (let container of containers) {
      if (container.firstElementChild.textContent === gameName) {
        // If the game matches up with the selected game, unhide the inputs
        container.hidden = false;
      } else {
        container.hidden = true; // Otherwise hide them
      }
    }
  });
}
