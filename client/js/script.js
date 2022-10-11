let SERVER_API_URL = 'http://campus.rowansserver.com/api/'


function id(id) { return document.getElementById(id); }

let phonebook = [];

var panorama, viewer, container, infospot, controlButton, modeButton, videoButton;

var controlIndex = PANOLENS.CONTROLS.ORBIT;
var modeIndex = 0;
var videoPlaying = false;

container = document.querySelector('#container');
controlButton = document.querySelector('#controlButton');
modeButton = document.querySelector('#modeButton');
videoButton = document.querySelector('#videoButton');

var lookAtPositions = [
    new THREE.Vector3(0, 0, 0)
];

let defaultProject = '0fff776e13504b01a37af13b'
let defaultArea = 'aacddae821f1457db5b93404'
let defaultLevel = 'cbc1190298254c868c4e5d26'
let defaultPoint = '4e980157cd7447dc806a06c5'

configPano()

async function configPano() {

    //get LEVEL info
    let levelObj = await fetch(SERVER_API_URL + 'project/' + defaultProject + '/area/' + defaultArea + '/level/' + defaultLevel);
    if (levelObj == null) { console.log('Could not fetch Level'); return; }
    let pointInfo = await fetch(SERVER_API_URL + 'project/' + defaultProject + '/area/' + defaultArea + '/level/' + defaultLevel + '/point/' + defaultPoint);
    if (pointInfo == null) { console.log('Could not get Point'); return; }


    default_panorama = new PANOLENS.ImagePanorama('images/' + pointInfo.payload.image.name);
    default_panorama.addEventListener('enter-fade-start', function() {
        viewer.tweenControlCenter(lookAtPositions[0], 0);
    });

    //Floating icon
    //infospot = new PANOLENS.Infospot(350, PANOLENS.DataImage.Info);
    //infospot.position.set(0, -2000, -5000);

    default_panorama.add(infospot);

    viewer = new PANOLENS.Viewer({ output: 'console', container: container, horizontalView: false });
    viewer.add(default_panorama);


    // Method to trigger control
    controlButton.addEventListener('click', function() {

        controlIndex = controlIndex >= 1 ? 0 : controlIndex + 1;

        switch (controlIndex) {
            case 0:
                viewer.enableControl(PANOLENS.CONTROLS.ORBIT);
                break;
            case 1:
                viewer.enableControl(PANOLENS.CONTROLS.DEVICEORIENTATION);
                break;
            default:
                break;
        }
    });
    modeButton.addEventListener('click', function() {
        modeIndex = modeIndex >= 2 ? 0 : modeIndex + 1;
        switch (modeIndex) {
            case 0:
                viewer.disableEffect();
                break;
            case 1:
                viewer.enableEffect(PANOLENS.MODES.CARDBOARD);
                break;
            case 2:
                viewer.enableEffect(PANOLENS.MODES.STEREO);
                break;
            default:
                break;
        }
    });
    videoButton.addEventListener('click', function() {
        videoPlaying = !videoPlaying;
        viewer.toggleVideoPlay(videoPlaying ? false : true);
    });
}

//Gets csv onload
$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "https://chocolatevs.github.io/Campus360-JS/LOCATIONS/phonebook.csv",
        dataType: "text",
        success: function(data) { processData(data); }
    });
});
//Process csv
function processData(allText) {
    //Split the doc into lines
    let csvLines = allText.split(/\r\n|\n/);
    let standard_headers = ['lastname', 'firstname', 'phone', 'username', 'location', 'room', 'other'];

    for (var i = 1; i < csvLines.length; i++) {
        //Split to line into values
        let data = csvLines[i].split(',');
        let temp = {};

        //If usual data
        if (standard_headers.length == data.length) {
            for (let j = 0; j < standard_headers.length; j++) {
                temp[standard_headers[j]] = data[j];
            }
            phonebook.push(temp);
        }
    }
}

$('#locationInput').on("input", function() {
    var input = this.value;
    search(input);
});

//Adds 
$(function() {
    $('#locationInput').on("focus", function() {
        $('#search_container').css('border-radius', '10px 10px 0px 0px');
        $('#search_container').css('background-color', 'rgb(222 218 218 / 85%)');
        id("search_results").style.display = "flex";
    });
});

//Removes focus when using the map
document.querySelector(".panolens-canvas").addEventListener("mousedown", function() {
    removeFocus();
});
document.querySelector(".panolens-canvas").addEventListener("touch", function() {
    removeFocus();
});

function removeFocus() {
    console.log("HIII");
    document.activeElement.blur();
    $('#search_container').css('border-radius', '10px');
    $('#search_container').css('background-color', 'transparent');
    id("search_results").style.display = "none";
}

//Searches the phonebook object for an entered query and displays results
function search(query) {
    let result_count = 0;
    id("search_results").innerHTML = "";

    if (query != "" && query.length > 0) {

        //For each entry in the phonebook
        phonebook.forEach(object => {

            let result = false;

            //For value of the entry
            Object.values(object).forEach(value => {

                //For each part of the query
                let parts = query.split(" ");
                parts.forEach(part => {
                    if (value.toLowerCase().includes(part.toLowerCase())) {
                        result = true;
                    }
                });
            });

            if (result && result_count < 6) {
                //console.log(result_count, result, object);

                let search_result = document.createElement('div');
                search_result.setAttribute("class", "search_result");

                let search_result_name = document.createElement('p');
                search_result_name.setAttribute("class", "search_result_name p_result");
                search_result_name.textContent = object.firstname + " " + object.lastname;

                let search_location_container = document.createElement('p');
                search_location_container.setAttribute("class", "search_location_container");
                search_result_name.textContent = object.firstname + " " + object.lastname;

                let search_result_location = document.createElement('p');
                search_result_location.setAttribute("class", "search_result_location p_result");
                search_result_name.textContent = object.firstname + " " + object.lastname;

                let location_img = document.createElement('img');
                location_img.src = "images/location.png";
                location_img.style.width = "30px";
                location_img.style.height = "30px";

                search_location_container.appendChild(search_result_location);
                search_location_container.appendChild(location_img);

                search_result.appendChild(search_result_name);
                search_result.appendChild(search_location_container);
                search_result_location.textContent = object.location;

                id("search_results").appendChild(search_result);

                result_count++;
            }
        });
    }
}