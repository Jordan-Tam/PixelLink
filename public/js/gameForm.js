let gameForm = document.getElementById("gameForm");
let error = document.getElementById("error");

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
      enteredValue = value.value.trim();
      if(value.type === "number"){    // If this is a number question, we need to confirm that the number is within the domain
        let domain = value.className.split("-");
        if(parseInt(domain[0]) > parseInt(enteredValue) || parseInt(domain[1]) < parseInt(enteredValue)){   // If the number is outside of the domain
          error.textContent = "Error: You have a number value outside of the accepted domain.";
          error.hidden = false;
          return;
        }
        error.hidden = true;

      } 
      userGameInfo.push({ field_name: field_name, value: enteredValue });
      i++;
    }

    let newForm = document.createElement("form");   // Create a new form to be submitted instead
    newForm.hidden = true;  // Hide the form from the user, since I need to attach it to the DOM before submitting.
    newForm.setAttribute("method", gameForm.method);
    newForm.setAttribute("action", gameForm.action);

    for (let elem of userGameInfo) {

      if(elem.type !== 'hidden'){
        let answer = document.createElement("input"); // Fill in my mock form
        answer.id = elem.field_name;
        answer.name = elem.field_name;
        answer.value = elem.value;
        newForm.appendChild(answer);
      }
      
    }

    let methodInput = gameForm.querySelector('input[name="_method"]');
    if (methodInput) {
      let methodClone = document.createElement("input");
      methodClone.type = "hidden";
      methodClone.name = "_method";
      methodClone.value = methodInput.value;
      newForm.appendChild(methodClone);
    }

    
    document.body.appendChild(newForm); // Apparently the form needs to actually be attached to the DOM in order to be submitted, so I just do it here before submitting.
    newForm.submit();
  });
}

