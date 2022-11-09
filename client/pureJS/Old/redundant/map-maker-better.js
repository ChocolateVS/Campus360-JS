/**
    Virtual Tour Editor

    Process:
        - User uploads a json map as exported from campus360 map building app
        - Links between panoramas are calculated automatically
        - Preview of each of the locations and links
        - Can select a preview from the list of panoramas and 

 */



function id(id) { return document.getElementById(id) }

let json_map;

//Set initial panorama (-1 as no panorama shown)
let current_panorama = -1;

//Container to be used to show panoramas
let container = id("preview");
let current_angle = 0;

//Create viewer which contains scene camera and renderer
let viewer = new PANOLENS.Viewer({ 
    output: 'console', 
    container: container,
    horizontalView: true
});

let panoramas = [];

//Hide preview elements intially
closePreview();

//On Submit after uploading JSON MAP to from
id("import_form").addEventListener("submit", function (e) {
    e.preventDefault();

    //Reader for uploading json map
    const input = id("fileInput").files[0];
    const reader = new FileReader();

    //When Map Loads
    reader.onload = function (e) {
        const json_file = e.target.result;
        json_map = JSON.parse(json_file);
        createPanoramas(json_map);
    };

    reader.readAsText(input);
});

function createPanoramas(map) {
    //For each location
    json_map.LOCATIONS.forEach(location => {
        //Locations are displayed by defualt
        location["display"] = true;

        //Split Image path at '/'
        let imagePathArray = location.imageLocation.split("/");

        //Set image path by joing the last elements (ignoring the first arguments of the path)
        let imagePath = "MAPS/" + imagePathArray[imagePathArray.length - 2] + "/" + imagePathArray[imagePathArray.length - 1];
        location.imageLocation = imagePath;

        //Create panorama
        let panorama = new PANOLENS.ImagePanorama(location.imageLocation);
        panorama.addEventListener( 'enter-fade-start', function() {

        });
        panoramas.push(panorama);
    });

    displayMapOverview();
}

function createScene() {
    linkedPanoramas.forEach(panorama => {
        viewer.add(panorama);
    });
}


//Initialise Map Overview
function displayMapOverview() {
    id("import_form").style.display = "none";
    id("map_view").style.display = "block";
    id("map_name").textContent = json_map.mapName;
    id("map_block").textContent = "Block: " + json_map.block;
    id("map_floor").textContent = "Floor: " + json_map.floor;
    id("locations_container").innerHTML = "";
    makeLocations();
}

/**
 * Removes Location
 * @param {*} index 
 */
function deleteLocation(index) {
    json_map.LOCATIONS[0]["display"] = !json_map.LOCATIONS[0]["display"];
    displayMapOverview();
}

//Hide elements associated with preview
function closePreview() {
    container.style.display = "none";
    id("closePreviewBtn").style.display = "none";
    id("floor_plan_view").style.display = "none";
}

/**
 * View panorama button event listener response
 * Shows target panorama and sets current panorama
 * @param {*} targetPanorama 
 * @param {*} p 
 */
function onPreviewClick( targetPanorama ) {
    container.style.display = "block";
    id("closePreviewBtn").style.display = "block";
    id("floor_plan_view").style.display = "block";
    id("floor_plan_img").src = "/MAPS/" + json_map.mapName + "/" + "floorplan.jpg";

    //Add Nav Arrow
    viewer.setPanorama(panoramas[targetPanorama]);
    current_panorama = targetPanorama;
}

//Distance Between Two Points (a & b)
function distance(a, b) {
    let distance_ab_x = a.x - b.x;
    let distance_ab_y = a.y - b.y;

    //Calc Distance with pythagorus
    return Math.sqrt((distance_ab_x * distance_ab_x) + (distance_ab_y * distance_ab_y));
}

//Angle Between two points (a & b)
function angle(a, b) {
    let distance_x = a.x - b.x;
    let distance_y = a.y - b.y;
    let rad = ((3 / 2) * Math.PI) + Math.atan2(distance_y, distance_x);
    if (rad < 0) rad = rad * -1;
    return rad;
}

//Callback on panorama rotation
viewer.addUpdateCallback(callback);
function callback() {
}

/**
 * Make location previews
 */
function makeLocations() {
    //For each location
    for (let i = 0; i < json_map.LOCATIONS.length; i++) {

        //Create HTML Elements
        let location = document.createElement('div');           //Location
        let location_details = document.createElement('div');   //Details Container
        let location_type = document.createElement('p');        //Location Type
        let location_room = document.createElement('p');        //Location Room
        let location_displayed = document.createElement('p');   //Location Displayed
        let location_controls = document.createElement('div');  //Location Controls
        let preview_button = document.createElement('button');  //Preview Button
        let delete_button = document.createElement('button');   //Delete Button
        let preview_img = document.createElement('img');        //Image Preview

        //Set Classes
        location.setAttribute("class", "location");
        location_details.setAttribute("class", "details_container");
        location_type.setAttribute("class", "location_detail");
        location_room.setAttribute("class", "location_detail");
        location_displayed.setAttribute("class", "location_detail");
        location_controls.setAttribute("class", "location_controls");
        delete_button.setAttribute("class", "location_button");
        preview_button.setAttribute("class", "location_button");
        preview_button.setAttribute("id", "preview_button");
        preview_img.setAttribute("class", "preview_img");

        //Set preview image source
        preview_img.src = json_map.LOCATIONS[i].imageLocation;

        //Set location type and room from json
        location_type.textContent = "Location Type: " + json_map.LOCATIONS[i].type; 
        location_room.textContent = "Location / Room: " + json_map.LOCATIONS[i].room;
        
        //Set deleted warning (hidden by default)
        location_displayed.textContent = "!! DELETED !!";

        //Set Preview button text
        preview_button.textContent = "Adjust Orientation";

        //Set Delete / Restore Button Action and id for styling
        if (json_map.LOCATIONS[i].display) {
            delete_button.textContent = "Delete";
            delete_button.setAttribute("id", "delete_button");
        }
        else {
            delete_button.textContent = "Restore";
            delete_button.setAttribute("id", "restore_button");
        }

        //Set Actions for buttons
        preview_button.addEventListener('click', onPreviewClick.bind( this, i));
        delete_button.setAttribute("onclick", "deleteLocation(" + i +  ")");
        
        //Build html object
        location_details.appendChild(location_type);
        location_details.appendChild(location_room);
        if (!json_map.LOCATIONS[i].display) location_details.appendChild(location_displayed);  
        location_controls.appendChild(preview_button);
        location_controls.appendChild(delete_button);
        location.appendChild(location_details);
        location.appendChild(location_controls);
        location.appendChild(preview_img);
        id("locations_container").appendChild(location);
    }
}