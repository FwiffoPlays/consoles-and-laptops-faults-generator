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

    }

}