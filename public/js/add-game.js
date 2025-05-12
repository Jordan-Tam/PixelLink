// Create Game Form
let createGameForm = document.getElementById("createGameForm");
let gameTitle = document.getElementById("name");
let description = document.getElementById("description");
let gameFormError = document.getElementById("gameFormError");
let dateReleased = document.getElementById("dateReleased");
let fieldList = document.getElementById("fieldInput");
let addField = document.getElementById("addField");
let removeField = document.getElementById("removeField");

let fieldNum = 1;

if(createGameForm !== null){
    createGameForm.addEventListener("submit", (event) => {
        event.preventDefault();
        console.log("hello");
        gameFormError.hidden = true; //hide error paragraph

        let title_input = gameTitle.value.trim(); //validate title
        if (!title_input || title_input.length === 0) {
            event.preventDefault();
            gameFormError.innerHTML = "Must provide a game title.";
            gameFormError.hidden = false;
            return;
        }

        let date_input = dateReleased.value.trim(); //validate date
        if (!date_input || date_input.length === 0) {
            event.preventDefault();
            gameFormError.innerHTML = "Must provide a release date in mm/dd/yyyy format.";
            gameFormError.hidden = false;
            return;
        }

        let description_input = description.value.trim(); //validate title
        if (!description_input || description_input.length === 0) {
          event.preventDefault();
          gameFormError.innerHTML = "Must provide a game description.";
          gameFormError.hidden = false;
          return;
        }

        let fieldDivs = createGameForm.querySelectorAll(".fieldInput");
        for (let i = 0; i < fieldDivs.length; i++) {  //loop through all the fields
            let nameInput = fieldDivs[i].querySelector(`input[name="form[${i}][field]"]`);
            let typeInput = fieldDivs[i].querySelector(`select[name="form[${i}][type]"]`);
            let optionsInput = fieldDivs[i].querySelector(`input[name="form[${i}][options]"]`);
            let domainMinInput = fieldDivs[i].querySelector(`input[name="form[${i}][domain][0]"]`);
            let domainMaxInput = fieldDivs[i].querySelector(`input[name="form[${i}][domain][1]"]`);

            if(!nameInput || nameInput.value.trim() === ""){
                event.preventDefault();
                gameFormError.innerHTML = `You're missing a field name for field ${i + 1}, cannot just be spaces`;
                gameFormError.hidden = false;
                return;
            }
            if(typeInput.value === "text"){//check that options and domain is empty if type is text
                if(optionsInput.value.trim() !== "" || domainMinInput.value !== "" || domainMaxInput.value !== ""){
                    event.preventDefault();
                    gameFormError.innerHTML = `Options and Domain must be empty when field is type "text": Field ${i + 1}`;
                    gameFormError.hidden = false;
                    return;
                }
            }
            if(typeInput.value === "select"){ //check that options isnt empty if type is "select"
                if(optionsInput.value.trim() === ""){
                    event.preventDefault();
                    gameFormError.innerHTML = `Options cannot be empty when field is type "select": Field ${i + 1}`;
                    gameFormError.hidden = false;
                    return;
                }
                if(domainMinInput.value !== "" || domainMaxInput.value !== ""){
                    event.preventDefault();
                    gameFormError.innerHTML = `Domain must be empty when field is type "select": Field ${i + 1}`;
                    gameFormError.hidden = false;
                    return;
                }
            }
            if(typeInput.value === "number"){//check that domain isnt empty if type is number
                if(domainMinInput.value === "" || domainMaxInput.value === ""){
                    event.preventDefault();
                    gameFormError.innerHTML = `Domain cannot be empty when field is type "number": Field ${i + 1}`;
                    gameFormError.hidden = false;
                    return;
                }
                if(optionsInput.value.trim() !== ""){
                    event.preventDefault();
                    gameFormError.innerHTML = `Options must be empty when field is type "number": Field ${i + 1}`;
                    gameFormError.hidden = false;
                    return;
                }
            }
            
        }
        console.log("passed validation"); //TEST

        let fieldInfo = [];
        console.log(fieldDivs);//TEST
        for (let i = 0; i < fieldDivs.length; i++) {
            let nameInput = fieldDivs[i].querySelector(`input[name="form[${i}][field]"]`);
            let typeInput = fieldDivs[i].querySelector(`select[name="form[${i}][type]"]`);
            let optionsInput = fieldDivs[i].querySelector(`input[name="form[${i}][options]"]`);
            let domainMinInput = fieldDivs[i].querySelector(`input[name="form[${i}][domain][0]"]`);
            let domainMaxInput = fieldDivs[i].querySelector(`input[name="form[${i}][domain][1]"]`);

            let options = [];
            let domain = [];

            if(typeInput.value == "select"){
                options = optionsInput.value.split(","); //??
            }
            if(typeInput.value == "number"){
                domain = [domainMinInput.value.toString(), domainMaxInput.value.toString()];
            }

            fieldInfo.push({
                field: nameInput.value,
                type: typeInput.value,
                options: options,
                domain: domain
            });
        }
        console.log("Field Info:", fieldInfo);

        let newForm = document.createElement("form");
        newForm.hidden = true; //hide form
        newForm.setAttribute("method", createGameForm.method);
        newForm.setAttribute("action", createGameForm.action);

        for (let i=0; i < fieldInfo.length;i++){
            let elem = fieldInfo[i];
            if(elem.type !== "hidden"){
                if (elem.type === "select") {
                    let selectElem = document.createElement("select");
                    selectElem.id = `field_${i}`;
                    selectElem.name = `form[${i}][field]`;

                    elem.options.forEach(option => {
                        let optionElem = document.createElement("option");
                        optionElem.value = option;
                        optionElem.textContent = option;
                        selectElem.appendChild(optionElem);
                    });

                    newForm.appendChild(selectElem);

                } else {
                    let inputElem = document.createElement("input");
                    inputElem.id = `field_${i}`;
                    inputElem.name = `form[${i}][field]`;

                    if (elem.type === "number") {
                        inputElem.type = "number";
                        // optionally: set min/max here using elem.domain[0], elem.domain[1]
                    } else {
                        inputElem.type = "text";
                    }

                    newForm.appendChild(inputElem);
                }
            }
        }

        let methodInput = createGameForm.querySelector('input[name="_method"]');
        if (methodInput) {
            let methodClone = document.createElement("input");
            methodClone.type = "hidden";
            methodClone.name = "_method";
            methodClone.value = methodInput.value;
            newForm.appendChild(methodClone);
        }

        //attaching to DOM
        let title_input_elem = document.createElement("input");
        title_input_elem.type = "text";
        title_input_elem.id = "name";
        title_input_elem.name = "name";
        title_input_elem.value = title_input;
        newForm.appendChild(title_input_elem);
        let date_input_elem = document.createElement("input");
        date_input_elem.type = "text";
        date_input_elem.id = "dateReleased";
        date_input_elem.name = "dateReleased";
        date_input_elem.value = date_input;
        newForm.appendChild(date_input_elem);
        let description_input_elem = document.createElement("input");
        description_input_elem.type = "text";
        description_input_elem.id = "description";
        description_input_elem.name = "description";
        description_input_elem.value = description_input;
        newForm.appendChild(description_input_elem);

        document.body.appendChild(newForm); //attach form
        //console.log(newForm); //TEST
        //console.log(document.body);
        newForm.submit();
    });
    //set up click listener
    addField.addEventListener("click", (event) => {
        event.preventDefault();
        console.log("inside click handler"); //TEST

        const newField = document.createElement("div"); //create new field
        newField.className = "fieldInput";//could also add class attribute
        newField.id = "q" + (fieldNum).toString();
        newField.innerHTML = `
        <label for="field_${fieldNum}"">Field Name:</label>
        <input type="text" id="field_${fieldNum}" name="form[${fieldNum}][field]"><br>
        <label for="field_type_${fieldNum}">Field Type:</label>
        <select id="field_type_${fieldNum}" name="form[${fieldNum}][type]"><br>
            <option value="text">text</option>
            <option value="select">select</option>
            <option value="number">number</option>
        </select>
        <label for="field_options_${fieldNum}">Options:</label>
        <input type="text" id="field_options_${fieldNum}" name="form[${fieldNum}][options]"><br>
        <label for="domain_min_${fieldNum}">Domain Min:</label>
        <input type="number" id="domain_min_${fieldNum}" name="form[${fieldNum}][domain][0]"><br>
        <label for="domain_max_${fieldNum}">Domain Max:</label>
        <input type="number" id="domain_max_${fieldNum}" name="form[${fieldNum}][domain][1]"><br> `;

        fieldList.appendChild(newField); //add to list
        fieldNum++; //increment
    });

    removeField.addEventListener("click", (event) => {
      event.preventDefault();

      if(fieldNum > 0){
        const bottomQ = document.getElementById(
          "q" + (fieldNum - 1).toString()
        );
        bottomQ.remove();

        fieldNum--;
      }

    });
        
}