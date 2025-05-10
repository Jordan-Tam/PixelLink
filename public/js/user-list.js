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
          // Get the container associated with the selected game
          let children = container.children; // Get the child of the container
          let field_name = "";
          let value = "";
          let type = "";
          let operator = "";
          for (let child of children) {
            if (child.className === "fieldLabel") {
              // The label contains the field, so grab it here
              field_name = child.textContent.trim();
            } else if (child.className === "radioLabel") {
              // If the question is a number, there will be a radio input we need to grab here
              if (child.firstElementChild.checked) {
                operator = child.firstElementChild.value;
              }
            } else if (
              child.className === "text" ||
              child.className === "number" ||
              child.className === "select"
            ) {
              // Otherwise, we get the answer and type from the value and class, and push to the queries
              value = child.value.trim();
              type = child.className.trim();
              if (value.length) {
                // We only add a query if there is a value (meaning the field is being searched for)
                queries.push({
                  field_name: field_name,
                  value: value,
                  type: type,
                  gameId: gameId,
                  operator: operator,
                });
              }
              operator = "";
            }
          }
        }
      }
      if (queries.length === 0) {
        // This means they're just looking for the game, no fields
        queries.push({ gameId: gameId });
      }
    }
    let first = true;
    let validPeople = [];
    for (let query of queries) {
      // I used the built in fetch API for ajax -> https://www.geeksforgeeks.org/javascript-fetch-method/
      let response = await fetch("", {
        // Fetch from the server a list of names that fulfill the query
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
      });
      let data = await response.json();
      if (!response.ok || typeof data === "string") {
        // Something went wrong
        error.textContent = "Error: " + data;
        return;
      } else {
        if (first) {
          validPeople = data;
          first = false;
        } else {
          validPeople = validPeople.filter((elem) => data.includes(elem)); // Get intersection of what we have so far and the new list
        }
      }
    }

    let users = usersContainer.children; // Get the each user div
    for (let user of users) {
      let username = user.firstElementChild.textContent.toLowerCase().trim(); //Find the username in each <a> tag
      if (username.includes(search)) {
        // If this username includes the searched string and the game details (if provided), then unhide them
        if (gameId && validPeople.includes(username)) {
          user.hidden = false;
          nobody = false;
        } else if (!gameId) {
          user.hidden = false;
          nobody = false;
        } else {
          user.hidden = true;
        }
      } else {
        user.hidden = true; // Hide the user otherwise
      }
    }

    // Show a message if there was nobody found
    if (nobody) {
      error.textContent = "No users found!";
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
