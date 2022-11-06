//Constants and variables
let faultsJson;
let buttonType;
//Initialisation


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

//Functions
function loadJson() {
    jsonInput = document.getElementById('file-selector');

    if (!jsonInput.files[0]) {
        alert("Please select a file before clicking 'Load'")
    }
    else {
        file = jsonInput.files[0];
        reader = new FileReader();
        reader.onload = parseText;
        reader.readAsText(file);
    }

    function parseText(e) {
        let lines = e.target.result;
        let text = "";
        faultsJson = JSON.parse(lines);
        console.log(faultsJson);
        devicesList = faultsJson.devices;
        document.getElementById("help-prompt").innerHTML = "Now please choose a device type.";
        displayDevices();
    }

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



function displayFaults(buttonType) {
    document.getElementById("help-prompt").innerHTML = "Device '"+buttonType+"' selected. Finally, please select the applicable faults and click submit."
    faultsDiv = document.getElementById("faults-div"); //Find the faults div
    console.log("Clicked device button is: "+buttonType);
    deviceFaults = faultsJson[buttonType];

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
        submitFaults();
    });
    
}

function submitFaults() {
    const outputBox = document.getElementById("output-text-area")
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
}