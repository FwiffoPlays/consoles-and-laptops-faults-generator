//Constants and variables

//Initialisation


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
        var faultsJson = JSON.parse(lines);
        console.log(faultsJson);
        devicesList = faultsJson.devices;
        document.getElementById("help-prompt").innerHTML = "Now please choose a device type";
        displayDevices();
    }

}

function displayDevices() {
    devicesDiv = document.getElementById("devices-div"); //Find the devices div
    for (device of devicesList) { //Iterate through the devices array and create a button for each device type
        devicesDiv.innerHTML += "<button id='"+device+"Button"+"'>"+device+"</button>";
    }
    devicesDivContent = document.getElementsByClassName("devices")[0];
    buttons = devicesDiv.getElementsByTagName("button");//Retrieve a list of buttons within the devices-div
    
    for (button of buttons) {
        button.addEventListener("click", function() {
            buttonType = this.getAttribute("id");
            alert("You clicked the "+buttonType+" button");
            //displayFaults(buttonType);
        });
    }

        


       
}