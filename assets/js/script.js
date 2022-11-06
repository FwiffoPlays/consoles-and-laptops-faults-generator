//Constants and variables
let faultsJson;
let buttonType;
let loadDefaultButton = document.getElementById("load-default-button")
let loadCustomButton = document.getElementById("load-custom-button")

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
}

modalCloseSpan.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

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


function loadDefaultJson() { //Loads the default JSON faults file which is stored on the web server
    HTTPRequest = new XMLHttpRequest();
    HTTPRequest.open("GET","assets/json/faults.json",false);
    HTTPRequest.send(null);
    text=HTTPRequest.responseText;
    parseText(text);
}

function loadCustomJson() { //Loads a custom JSON file that is stored locally on the user's device
    jsonInput = document.getElementById('file-selector');

    if (!jsonInput.files[0]) {
        alert("Please select a file before clicking 'Load'")
    }
    else {
        let file = jsonInput.files[0];
        console.log(file);
        let reader = new FileReader();
        reader.readAsText(file);

        reader.onload = function() {
            parseText(reader.result);
        };
        
    }

}

function parseText(input) {
    faultsJson = JSON.parse(input);
    console.log(faultsJson);
    devicesList = faultsJson.devices;
    document.getElementById("help-prompt").innerHTML = "Now please choose a device type.";
    displayDevices();
}

function displayDevices() {
    devicesDiv = document.getElementById("devices-div"); //Find the devices div
    for (device of devicesList) { //Iterate through the devices array and create a button for each device type
        devicesDiv.innerHTML += "<input type='button' id='"+device+"' value='"+device+"'>";
    }

    buttons = devicesDiv.getElementsByTagName("input");//Retrieve a list of buttons within the devices-div
    
    for (button of buttons) {
        button.addEventListener("click", function() {
            buttonType = this.getAttribute("id");
            //alert("DEBUG: You clicked the "+buttonType+" button");
            displayFaults(buttonType);
        });
    }
       
}



function displayFaults(deviceType) {
    document.getElementById("help-prompt").innerHTML = "Device '"+deviceType+"' selected. Finally, please select the applicable faults and click submit."
    faultsDiv = document.getElementById("faults-div"); //Find the faults div
    console.log("Clicked device button is: "+deviceType);
    deviceFaults = faultsJson[deviceType];

    //console.log(deviceFaults);
    faultsDiv.innerHTML = ""; //Reset the faults div contents to be blank ready for adding the new faults.
    faultsDiv.innerHTML += "<form name='faultsForm' id='faults-form' onsubmit='submitFaults()'>";

    //console.log("DEBUG: Printing faults list selected")
    for (currentfault of deviceFaults) {
        //console.log(currentfault.fault);
        faultsDiv.innerHTML += "<div class='flex-checkbox' id='"+currentfault.fault+"Div'></div>";

        checkboxDiv = document.getElementById(currentfault.fault+"Div");
        checkboxDiv.innerHTML += "<label for='"+currentfault.fault+"'>"+currentfault.title+"</label>";
        checkboxDiv.innerHTML += "<input class='fault-checkbox' type='checkbox' id='"+currentfault.fault+"' name='faultsForm' value='"+currentfault.description+"'>";
        
    }

    faultsDiv.innerHTML += "<input type='submit' id='faultsSubmitButton' value='Submit'>";
    faultsDiv.innerHTML += "</form>";


    faultsSubmitButton = document.getElementById("faultsSubmitButton")
    faultsSubmitButton.addEventListener("click", function() {
        submitFaults(deviceType);
    });
    
}

function getSuggestedPayGrade(selectedFaultsArray, deviceType) {
    let lowestGrade=0;
    let lowestGradeText="";
    let deviceFaultsList = faultsJson[deviceType];
    console.log(selectedFaultsArray);
    for(selectedFault of selectedFaultsArray) {
        for (fault of deviceFaultsList) {
            if (fault["fault"] == selectedFault) {
                gradeValue = payGrades[fault["payGrade"]];
                console.log(gradeValue)
                if (gradeValue > lowestGrade) {
                    lowestGrade = gradeValue;
                    lowestGradeText = fault["payGrade"];
                }
            }
        }
    }
    lowestPayGrade = lowestGradeText;
    console.log("Lowest selected pay grade = "+lowestPayGrade);
    return lowestPayGrade;
}

function getSuggestedInternalGrade(selectedFaultsArray, deviceType) {
    let lowestGrade=0;
    let lowestGradeText="";
    let deviceFaultsList = faultsJson[deviceType];
    console.log(selectedFaultsArray);
    for(selectedFault of selectedFaultsArray) {
        for (fault of deviceFaultsList) {
            if (fault["fault"] == selectedFault) {
                gradeValue = internalGrades[fault["internalGrade"]];
                console.log(gradeValue)
                if (gradeValue > lowestGrade) {
                    lowestGrade = gradeValue;
                    lowestGradeText = fault["internalGrade"];
                }
            }
        }
    }
    lowestInternalGrade = lowestGradeText;
    console.log("Lowest selected internal grade = "+lowestInternalGrade);
    return lowestInternalGrade;
}

function submitFaults(deviceType) {
    const outputBox = document.getElementById("output-text-area");
    const payGradeDiv = document.getElementById("pay-grade-div");
    const internalGradeDiv = document.getElementById("internal-grade-div")
    var checkedValues = ""; 
    var checkedFaults = [];
    const inputElements = document.getElementsByClassName('fault-checkbox');
    for(element of inputElements){
        if(element.checked){
            checkedValues += element.value + "\n";
            checkedFaults.push(element.id);
            //console.log(element.value);
        }
    }
    outputBox.innerHTML = "The following issues were found with your device and has therefore been repriced:\n"
    outputBox.innerHTML += checkedValues
    //console.log(checkedFaults);
    let payGradeText = getSuggestedPayGrade(checkedFaults, deviceType);
    payGradeDiv.innerHTML = "Suggested pay grade: "+payGradeText;

    let internalGradeText = getSuggestedInternalGrade(checkedFaults, deviceType);
    internalGradeDiv.innerHTML = "Suggested internal grade: "+internalGradeText;

}