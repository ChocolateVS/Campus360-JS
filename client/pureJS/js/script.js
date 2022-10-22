let SERVER_API_URL = 'http://campus.rowansserver.com/api/'
let SERVER_URL = 'http://campus.rowansserver.com/'

function id(id) { return document.getElementById(id); }

let roomList = [];

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
    let pointInfo = await (await fetch(SERVER_API_URL + 'project/' + defaultProject + '/area/' + defaultArea + '/level/' + defaultLevel + '/point/' + defaultPoint)).json();
    if (pointInfo == null) { console.log('Could not get Point'); return; }

    default_panorama = new PANOLENS.ImagePanorama(SERVER_URL + 'images/' + pointInfo.payload.image.name);
    default_panorama.addEventListener('enter-fade-start', function() {
        viewer.tweenControlCenter(lookAtPositions[0], 0);
    });

    //Floating icon
    //infospot = new PANOLENS.Infospot(350, PANOLENS.DataImage.Info);
    //infospot.position.set(0, -2000, -5000);
    //default_panorama.add(infospot);

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
        url: SERVER_API_URL + "rooms",
        dataType: "text",
        success: function(data) { roomList = JSON.parse(data).payload }
    });
});
//Process csv


$('#locationInput').on("input", function() {
    var user_search_text = this.value;
    populateSearchBox(user_search_text);
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
    document.activeElement.blur();
    $('#search_container').css('border-radius', '10px');
    $('#search_container').css('background-color', 'transparent');
    id("search_results").style.display = "none";
}

//Searches the room_list object for an entered query and displays results
function populateSearchBox(user_search_string) {
    let result = [];
    let result_count = 0;
    id("search_results").innerHTML = "";

    if (user_search_string != "" && user_search_string.length > 0) {
        for (var item in roomList) {
            if (user_search_string.toLowerCase().includes(item.owner.toLowerCase()) || user_search_string.toLowerCase.includes(item.name.toLowerCase())) {
                result.push(item);
            }
        }
    }

    //Limit results to 6
    if (result.length > 0 && result_count < 6) {
        //console.log(result_count, result, object);

        for (var r in result) {
            let search_result = document.createElement('div');
            search_result.setAttribute("class", "search_result");

            let room_owner_name = document.createElement('p');
            room_owner_name.setAttribute("class", "search_result_name p_result");
            room_owner_name.textContent = r.owner == "" ? "None" : r.owner;

            let room_location_name = document.createElement('p');
            room_location_name.setAttribute("class", "search_result_location p_result");
            room_location_name.textContent = r.name

            let room_ID = document.createElement("input");
            room_ID.setAttribute("type", "hidden");
            room_ID.setAttribute("name", "roomId");
            room_ID.setAttribute("value", r._id);

            search_result.appendChild(room_owner_name);
            search_result.appendChild(room_location_name);

            search_result.appendChild(room_ID)

            id("search_results").appendChild(search_result);

            result_count++;
        }
    }
}