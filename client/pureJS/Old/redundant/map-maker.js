let viewing_map;
let current_panorama = -1;
let container = id("preview");
let current_angle = 0;

let viewer = new PANOLENS.Viewer({ 
    output: 'console', 
    container: container,
    horizontalView: true
});

let panoramas = [];

closePreview();

function id(id) { return document.getElementById(id) }

//On Submit After uploading MAP JSON
id("import_form").addEventListener("submit", function (e) {
    e.preventDefault();
    const input = id("fileInput").files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const text = e.target.result;
      viewing_map = JSON.parse(text);

      viewing_map.LOCATIONS.forEach(l => {
        l["display"] = true;

        //image path is the last three elements after the path into an array at '/'
        let imagePathArray = l.imageLocation.split("/");
        let imagePath = "MAPS/" + imagePathArray[imagePathArray.length - 2] + "/" + imagePathArray[imagePathArray.length - 1];
        l.imageLocation = imagePath;
        l["rotation"] = 0;
        l["initial_offset"] = new THREE.Vector3(0, 0, 0);
        let panorama = new PANOLENS.ImagePanorama(l.imageLocation);
        panorama.addEventListener( 'enter-fade-start', function() {
            //console.log("ENTERED PANORAMA", panorama.number, "TWEEN TO", l.initial_offset.x, l.initial_offset.y);
            let rotate_to = 0;
            if (current_panorama >= 0) {
               rotate_to = viewing_map.LOCATIONS[current_panorama].rotation - current_angle;
            }
        
            current_panorama = panorama.number;

            if (current_panorama >= 0) {
                let rotate_by = viewing_map.LOCATIONS[current_panorama].rotation;

                console.log("ROTATE", rotate_to * (180 / Math.PI), "Degrees from", rotate_by);

                p = angleToPosition(180 + rotate_by - rotate_to);
                viewer.tweenControlCenter( new THREE.Vector3( p.x, 0, p.z), 0 );
            }

            
        });
        panoramas.push(panorama);
        viewer.add(panorama);
      });

      //Link Panoramas
      //For each Panorama in the map
      //Using the map imported, find the angle between each of the locations to be joined
      //and use to position the link button to navigate between panoramas
      //for testing, just linking each panorama to the next, and the inverse 
      for (let i = 0; i < panoramas.length; i++) {
        panoramas[i]["number"] = i;
        if (i < panoramas.length - 1) {
            console.log("Linked Panorama ", i, "to next");
            let position = getLinkPosition(i, 1);
            panoramas[i].link(panoramas[i + 1], new THREE.Vector3(position.x, 0, position.z));
        } 

        if (i > 0) {
            console.log("Linked Panorama ", i, "to prev");
            let position = getLinkPosition(i, -1);
            panoramas[i].link(panoramas[i - 1], new THREE.Vector3(position.x, 0, position.z));
        }
        
        panoramas[i].linkedSpots.forEach(e => e.addEventListener("mousedown"));

      }
      displayMap();
    };
    
    reader.readAsText(input);
});

//Distance Between Two Points
function calcDistance(a, b) {
    let distance_ab_x = a.x - b.x;
    let distance_ab_y = a.y - b.y;

    //Calc Distance with pythagorus
    return Math.sqrt((distance_ab_x * distance_ab_x) + (distance_ab_y * distance_ab_y));
}

//Angle Between two points
function calcAngle(a, b) {

    let distance_x = a.x - b.x;
    let distance_y = a.y - b.y;

    let gradient = (distance_y / distance_x);
    let rad = ((3 / 2) * Math.PI) + Math.atan2(distance_y, distance_x);
    if (rad < 0) rad = rad * -1;

    let deg =  rad * (180 / Math.PI);

    /*console.log("Distance X", distance_x);
    console.log("Distance Y", distance_y)
    console.log("Gradient", gradient);
    console.log("Radians", rad);
    console.log("Degrees", deg);
    console.log("\n");*/

    return rad;
}

function displayMap() {
    id("import_form").style.display = "none";
    id("map_view").style.display = "block";

    id("map_name").textContent = viewing_map.mapName;
    id("map_block").textContent = "Block: " + viewing_map.block;
    id("map_floor").textContent = "Floor: " + viewing_map.floor;

    id("locations").innerHTML = "";

    makeLocations();
}

//////////////////////////////// LOCATION PREVIEWS ////////////////////////
function makeLocations() {
    for (let i = 0; i < viewing_map.LOCATIONS.length; i++) {
        //console.log(viewing_map.LOCATIONS[i]);

        let location_div = document.createElement('div');
        location_div.setAttribute("class", "location");

        //Location Details
        let location_details = document.createElement('div');
        location_details.setAttribute("class", "location_details");

        let location_type = document.createElement('p');
        location_type.setAttribute("class", "map_p");
        location_type.textContent = "Location Type: " + viewing_map.LOCATIONS[i].type;

        let location_room = document.createElement('p');
        location_room.setAttribute("class", "map_p");
        location_room.textContent = "Location / Room: " + viewing_map.LOCATIONS[i].room;

        let location_displayed = document.createElement('p');
        location_displayed.setAttribute("class", "map_p");
        location_displayed.textContent = "!! DELETED !!";

        location_details.appendChild(location_type);
        location_details.appendChild(location_room);

        if (!viewing_map.LOCATIONS[i].display) location_details.appendChild(location_displayed);

        //Locaiton Controls
        let location_controls = document.createElement('div');
        location_controls.setAttribute("class", "location_controls");

        let preview_button = document.createElement('button');
        preview_button.setAttribute("class", "location_button");
        preview_button.setAttribute("id", "preview_button");
        //preview_button.setAttribute("onclick", "preview(" + i +  ")");
        preview_button.textContent = "Adjust Orientation";
        preview_button.addEventListener( 'click', onButtonClick.bind( this, panoramas[i], i));

        /*let orientation_button = document.createElement('button');
        orientation_button.setAttribute("class", "location_button");
        orientation_button.setAttribute("id", "oreientation_button");
        orientation_button.setAttribute("onclick", "orientation()");
        orientation_button.textContent = "Adjust Orientation";*/

        let delete_button = document.createElement('button');
        delete_button.setAttribute("class", "location_button");
        delete_button.setAttribute("onclick", "deleteLocation(" + i +  ")");
        if (viewing_map.LOCATIONS[i].display) {
            delete_button.textContent = "Delete";
            delete_button.setAttribute("id", "delete_button");
        }
        else {
            delete_button.textContent = "Restore";
            delete_button.setAttribute("id", "restore_button");
        } 

        location_controls.appendChild(preview_button);
        //location_controls.appendChild(orientation_button);
        location_controls.appendChild(delete_button);

        //Image Preview
        let location_img = document.createElement('img');
        location_img.setAttribute("class", "location_img");
        location_img.src = viewing_map.LOCATIONS[i].imageLocation;

        location_div.appendChild(location_details);
        location_div.appendChild(location_controls);
        location_div.appendChild(location_img);

        id("locations").appendChild(location_div);
    }
}

function deleteLocation(index) {
    viewing_map.LOCATIONS[0]["display"] = !viewing_map.LOCATIONS[0]["display"];
    displayMap();
}

function closePreview() {
    container.style.display = "none";
    id("closePreviewBtn").style.display = "none";
    id("floor_plan_view").style.display = "none";
}

/////////////////////////////////////////////////////////////////////////// 

function onButtonClick( targetPanorama, p ) {
    container.style.display = "block";
    id("closePreviewBtn").style.display = "block";
    id("floor_plan_view").style.display = "block";
    id("floor_plan_img").src = "/MAPS/" + viewing_map.mapName + "/" + "floorplan.jpg";

    //Add Nav Arrow
    viewer.setPanorama( targetPanorama );
    current_panorama = p;
}

viewer.addUpdateCallback(callback);

function callback() {
    if (current_panorama > -1) {
        let arrow_rotation = azimuthalAngleToRotation("deg") - (viewing_map.LOCATIONS[current_panorama].rotation * (180 / Math.PI));
        id("orientation_arrow").style.transform = "rotate(" + arrow_rotation + "deg)";
    }
    
    //console.log(viewer.OrbitControls.getAzimuthalAngle());
}

/**
function CoordToVector3(lng, lat)
{
    new THREE.Vector3();
    lat = Math.PI / 2 - lat;
    out.set(
        Math.sin( lat ) * Math.sin( lng ),
        Math.cos( lat ),
        Math.sin( lat ) * Math.cos( lng )
    );
    return out;

}


 * converts a XYZ THREE.Vector3 to longitude latitude. beware, the vector3 will be normalized!
 * @param vector3 
 * @returns an array containing the longitude [0] & the lattitude [1] of the Vector3

function Vector3toCoord( vector3 )
{
    vector3.normalize();

    //longitude = angle of the vector around the Y axis
    //-( ) : negate to flip the longitude (3d space specific )
    //- PI / 2 to face the Z axis
    var lng = -( Math.atan2( -vector3.z, -vector3.x ) ) - Math.PI / 2;

    //to bind between -PI / PI
    if( lng < - Math.PI )lng += Math.PI * 2;

    //latitude : angle between the vector & the vector projected on the XZ plane on a unit sphere

    //project on the XZ plane
    var p = new THREE.Vector3( vector3.x, 0, vector3.z );
    //project on the unit sphere
    p.normalize();

    //commpute the angle ( both vectors are normalized, no division by the sum of lengths )
    var lat = Math.acos( p.dot( vector3 ) );

    //invert if Y is negative to ensure teh latitude is comprised between -PI/2 & PI / 2
    if( vector3.y < 0 ) lat *= -1;

    return [ lng, lat ];

}
 */
function angleToPosition(rad) {
    //Takes a rotation in radians and determines x and z position between -5000 and 5000
    
    //Convert to degrees so my brain works :)
    let radians = rad % (2 * Math.PI);
    let degrees = radians * (180 / Math.PI);
    let point = {
        x: 0,
        z: 0
    }

    if (degrees >= 0 && degrees <= 45) {
        //console.log("0 - 45", radians, degrees);
        point.x = calcScenePosition(radians, 1, 0);
        point.z = -5000;
    }
    else if (degrees >= 45 && degrees <= 135) {
        //console.log("45 - 135", radians, degrees);
        point.x = 5000;
        point.z = calcScenePosition(radians, 1, 1);
    }
    else if (degrees >= 135 && degrees <= 225) {
        //console.log("135 - 225", radians, degrees);
        point.x = calcScenePosition(radians, -1, 2);
        point.z = 5000;
    }
    else if (degrees >= 225 && degrees <= 315) {
        //console.log("225 - 315", radians, degrees);
        point.x = -5000;
        point.z = calcScenePosition(radians, -1, 3);
    }

    else if (degrees >= 315 && degrees <= 360) {
        //console.log("315 - 360", radians, degrees);
        point.x = calcScenePosition(radians, 1, 4);
        point.z = -5000;
    }
    else {
        //console.log(degrees, "not in range");
    }
    return point;
}

function calcScenePosition(v, i, m) { return (i * 5865.4 * v) + (i * m * -9211.6); }

function deg(d) { rotationToInfoSpotPosition(d * (Math.PI/180)); }

function getDatas() { 
    console.log("AZIMUTHAL ANGLE", viewer.OrbitControls.getAzimuthalAngle() * (180/Math.PI));
    console.log("CENTER POINT: ", "X", viewer.getRaycastViewCenter().x, "Y", viewer.getRaycastViewCenter().z );
}

function setOrientation() {
    if (current_panorama >= 0) {
        let rotation = azimuthalAngleToRotation("rad");
        console.log("Off set rotation", rotation);
        let tween = angleToPosition(rotation);
        console.log("tween to", tween);
        viewer.tweenControlCenter(new THREE.Vector3(tween.x, 0, tween.z), 0);

        viewing_map.LOCATIONS[current_panorama]["rotation"] = rotation;
        viewing_map.LOCATIONS[current_panorama]["north"] = new THREE.Vector3(tween.x, 0, tween.z);

        //Set offset link positions with respect to change in orientation.. Can be moved to for leep
        try { //Previous
            let offset = getLinkPosition(current_panorama, 1);
            panoramas[current_panorama].linkedSpots[0].position.x = offset.x;
            panoramas[current_panorama].linkedSpots[0].position.z = offset.z;
        }
        catch {}

        try { //Next
            let offset = getLinkPosition(current_panorama, -1);
            panoramas[current_panorama].linkedSpots[1].position.x = offset.x;
            panoramas[current_panorama].linkedSpots[1].position.z = offset.z;
        }
        catch {}       
    }
}

function azimuthalAngleToRotation(type) {
    //Value between -PI and PI
    let azimuthalAngle = viewer.OrbitControls.getAzimuthalAngle();
    let degrees = (360 - (azimuthalAngle * (180 / Math.PI))) % 360;
    //console.log(degrees * (Math.PI / 180));

    switch (type) {
        case "deg":
            return degrees;
        case "rad":
            return degrees * (Math.PI / 180);
        default:
            return degrees;
    }
}

//Calculate position of link for current offset
function getLinkPosition(i, to) {
    let current = viewing_map.LOCATIONS[i].coords;
    let next = viewing_map.LOCATIONS[i + to].coords;
    let angle_next = calcAngle(current, next);
    position_next_offset = viewing_map.LOCATIONS[i].rotation; 
    position_next = angleToPosition(angle_next + position_next_offset);

    return position_next;
}
