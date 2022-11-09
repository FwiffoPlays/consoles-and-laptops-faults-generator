/*jshint esversion: 6 */
//Constants and variables
let faultsJson;
let buttonType;
let loadDefaultButton = document.getElementById("load-default-button");
let loadCustomButton = document.getElementById("load-custom-button");

let payGrades = {
    "Excellent": 0,
    "Good": 1,
    "Faulty": 2
};

let internalGrades = {
    "A": 0,
    "B": 1,
    "C": 2,
    "D": 3,
    "E": 4,
    "F": 5
};


//Setup modal
let modal = document.getElementById("help-modal");
let helpButton = document.getElementById("help-button");
let modalCloseSpan = document.getElementsByClassName("close")[0];

helpButton.onclick = function() {
    modal.style.display = "block";
};

modalCloseSpan.onclick = function() {
    modal.style.display = "none";
};

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

//Button events

loadDefaultButton.addEventListener("click", function() //Setup the load default JSON button
{
    loadDefaultJson();
});

loadCustomButton.addEventListener("click", function() //Setup the load default JSON button
{
    loadCustomJson();
});
//Functions


/** 
 * Retrieves the default JSON faults file which is stored on the web server
*/
function loadDefaultJson() {
    let req = new XMLHttpRequest();
    req.open("GET","assets/json/faults.json",false);
    req.send(null);
    parseText(req.responseText);
}

/** 
 * Loads a custom JSON file that is stored locally on the user's device
*/
function loadCustomJson() { 
    let jsonInput = document.getElementById('file-selector');
    
    if (!jsonInput.files[0]) {
        document.getElementById("help-prompt").innerHTML = "<p style='color: red;'>Please select a faults JSON file before clicking 'Load Custom'</p>";
    }
    else {
        let file = jsonInput.files[0];
        let reader = new FileReader();
        reader.readAsText(file);

        reader.onload = function() {
            parseText(reader.result);
        };
        
    }

}

/** 
 * Parses the JSON text which has just been loaded and calls the displayDevices function
*/
function parseText(input) {
    faultsJson = JSON.parse(input);
    document.getElementById("help-prompt").innerHTML = "<p style='color: rgb(185, 67, 8);'>Now please choose a device type.</p>";
    displayDevices();
}

/** 
 * Adds the device type buttons to the devicesDiv and attatches their event listeners
*/
function displayDevices() {
    let devicesDiv = document.getElementById("devices-div"); //Find the devices div
    let devicesList = faultsJson.devices;
    devicesDiv.innerHTML = "";
    for (let device of devicesList) { //Iterate through the devices array and create a button for each device type
        devicesDiv.innerHTML += "<input type='button' id='"+device+"' value='"+device+"'>";
    }

    let buttons = devicesDiv.getElementsByTagName("input");//Retrieve a list of buttons within the devices-div
    
    for (let button of buttons) {
        button.addEventListener("click", function() {
            buttonType = this.getAttribute("id");
            displayFaults(buttonType);
        });
    }
}


/** 
 * Creates the fault checkboxes for the selected device type
*/
function displayFaults(deviceType) {
    document.getElementById("help-prompt").innerHTML = "<p style='color: #4CAF50; '>Device '"+deviceType+"' selected. Finally, please select the applicable faults and click submit.</p>";
    let faultsDiv = document.getElementById("faults-div"); //Find the faults div

    let deviceFaults = faultsJson[deviceType];

    faultsDiv.innerHTML = ""; //Reset the faults div contents to be blank ready for adding the new faults.
    faultsDiv.innerHTML += "<form name='faultsForm' id='faults-form' onsubmit='submitFaults()'>";

    for (let currentfault of deviceFaults) {
        faultsDiv.innerHTML += "<div class='flex-checkbox' id='"+currentfault.fault+"Div'></div>";

        let checkboxDiv = document.getElementById(currentfault.fault+"Div");
        checkboxDiv.innerHTML += "<input class='fault-checkbox' type='checkbox' id='"+currentfault.fault+"' name='faultsForm' value='"+currentfault.description+"'>";
        checkboxDiv.innerHTML += "<label for='"+currentfault.fault+"'>"+currentfault.title+"</label>";
    }

    faultsDiv.innerHTML += "<input type='submit' id='faultsSubmitButton' value='Submit'>";
    faultsDiv.innerHTML += "</form>";

    let faultsSubmitButton = document.getElementById("faultsSubmitButton");
    faultsSubmitButton.addEventListener("click", function() {
        submitFaults(deviceType);
    });
}

/** 
 * Retrieves the lowest pay grade from the array of selected faults
*/
function getSuggestedPayGrade(selectedFaultsArray, deviceType) {
    let lowestGrade=0;
    let lowestGradeText="";
    let deviceFaultsList = faultsJson[deviceType];
    for(let selectedFault of selectedFaultsArray) {

        for (let fault of deviceFaultsList) {
            if (fault.fault == selectedFault) {
                let gradeValue = payGrades[fault.payGrade];
                if (gradeValue >= lowestGrade) {
                    lowestGrade = gradeValue;
                    lowestGradeText = fault.payGrade;
                }
            }
        }
    }
    let lowestPayGrade = lowestGradeText;
    return lowestPayGrade;
}

/** 
 * Retrieves the lowest internal grade from the array of selected faults
*/
function getSuggestedInternalGrade(selectedFaultsArray, deviceType) {
    let lowestGrade=0;
    let lowestGradeText="";
    let deviceFaultsList = faultsJson[deviceType];
    for(let selectedFault of selectedFaultsArray) {
        for (let fault of deviceFaultsList) {
            if (fault.fault == selectedFault) {
                let gradeValue = internalGrades[fault.internalGrade];
                if (gradeValue >= lowestGrade) {
                    lowestGrade = gradeValue;
                    lowestGradeText = fault.internalGrade;
                }
            }
        }
    }
    let lowestInternalGrade = lowestGradeText;
    return lowestInternalGrade;
}

/** 
 * Collects the selected faults from the form and outputs the faults information
*/
function submitFaults(deviceType) {
    const outputBox = document.getElementById("output-text-area");
    const payGradeDiv = document.getElementById("pay-grade-div");
    const internalGradeDiv = document.getElementById("internal-grade-div");
    var checkedValues = ""; 
    var checkedFaults = [];
    const inputElements = document.getElementsByClassName('fault-checkbox');
    for(let element of inputElements){
        if(element.checked){
            checkedValues += element.value + "\n";
            checkedFaults.push(element.id);
        }
    }
    outputBox.innerHTML = "The following issues were found with your device and has therefore been repriced:\n";
    outputBox.innerHTML += checkedValues;
    let payGradeText = getSuggestedPayGrade(checkedFaults, deviceType);
    payGradeDiv.innerHTML = "Suggested pay grade: "+payGradeText;

    let internalGradeText = getSuggestedInternalGrade(checkedFaults, deviceType);
    internalGradeDiv.innerHTML = "Suggested internal grade: "+internalGradeText;
}