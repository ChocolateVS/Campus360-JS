const SERVER_API_URL = 'https://campus.rowansserver.com/api/'
const SERVER_URL = 'https://campus.rowansserver.com/'
const EXTERNAL_POINT_PREFIX = 'external-'

const hardcodedProject = "485b3c31c3d347ae84108de9";

//Slightly Better Tour of my house
const hardcodedArea = "6ca3c2caaf5648c0839d2586";
const hardcodedLevel = "06fc572a9afd4abf99af8f1b"

//Hallway
//const hardcodedArea = "d56b5b91eb4b4faab2ff4a4a";
//const hardcodedLevel = "8535bdd97dd844289e3f2936";

let LOCALSTORAGE_LEVEL = 'currLevel';
let LOCALSTORAGE_AREA = 'currArea';
let LOCALSTORAGE_PROJECT = 'currProject';
let LOCALSTORAGE_POINT = 'currPoint';

let target_yaw = 0;

let levelObj;

let viewer;

if(!localStorage.getItem(LOCALSTORAGE_PROJECT)){//If the item is not set, should completely redo
    localStorage.setItem(LOCALSTORAGE_PROJECT, hardcodedProject)
    localStorage.setItem(LOCALSTORAGE_AREA, hardcodedArea)
    localStorage.setItem(LOCALSTORAGE_LEVEL, hardcodedLevel)
    localStorage.removeItem(LOCALSTORAGE_POINT);//starting location
}

function id(id) { return document.getElementById(id); }

<<<<<<< HEAD:client/js/pannellum-script.js
const emptyImagePath = "https://purejs.rowansserver.com/client/pureJS/images/default.jpg";
=======
var onHotSpotClick = function(event, yaw) {
    console.log("Hotspot Clicked", yaw);
    target_yaw = yaw;
};

const emptyImagePath = "http://purejs.rowansserver.com/client/pureJS/images/default.jpg";
>>>>>>> 4d901fec89fa5f2431092fabc5c329e80190dea2:client/pureJS/js/pannellum-script.js


setup360LevelTour(localStorage.getItem(LOCALSTORAGE_PROJECT), localStorage.getItem(LOCALSTORAGE_AREA), localStorage.getItem(LOCALSTORAGE_LEVEL))


function configurePanoViewer(scenes, first_scene) {
    console.log("Config pano", scenes, first_scene)

    viewer = pannellum.viewer('panorama', {
        "default": {
            "firstScene": first_scene,
            "author": "Waikato Students",
            "sceneFadeDuration": 500,
            "autoLoad": true,
            "compass": true,
            "northOffset": 0
        },
        scenes
    });

    viewer.on('scenechange', async (id) => {
        viewer.setYaw(target_yaw, false);
        console.log("Setting Target Yaw", target_yaw);

        drawPoints(levelObj.payload.points, id);

        if(id.startsWith(EXTERNAL_POINT_PREFIX)) {
            //Object is in another level - move view over to new level & reload
            console.log(id + " Is External")
            let restoredID = id.substring(EXTERNAL_POINT_PREFIX.length)
            let info = await (await fetch(SERVER_API_URL + 'pointlocation/' + restoredID)).json();
            localStorage.setItem(LOCALSTORAGE_AREA, info.payload.area._id)
            localStorage.setItem(LOCALSTORAGE_LEVEL, info.payload.level._id)
            localStorage.setItem(LOCALSTORAGE_POINT, restoredID)

            //Set up with latest variables
            setup360LevelTour(localStorage.getItem(LOCALSTORAGE_PROJECT), localStorage.getItem(LOCALSTORAGE_AREA), localStorage.getItem(LOCALSTORAGE_LEVEL))
        }
    })
}

async function setup360LevelTour(project, area, level) {
    let scenes = {}

    //Get Level
    levelObj = await (await fetch(SERVER_API_URL +
            'project/' + project +
            '/area/' + area +
            '/level/' + level)).json();

    console.log("Level:", levelObj)

    if (levelObj == null) {
        console.log('Could not fetch Level');
        return;
    }

    if(!localStorage.getItem(LOCALSTORAGE_POINT))
        localStorage.setItem(LOCALSTORAGE_POINT, levelObj.payload.points[0]._id);

    setupMap(levelObj.payload.image.name);
    drawPoints(levelObj.payload.points, localStorage.getItem(LOCALSTORAGE_POINT));

    //Link Panoramas
    levelObj.payload.points.forEach(point => {
        console.log("\n Getting Links for Point:", point);

        let hotSpots = [];

        //If the panorama should be linked
        if (point.link_ids != null) {

            console.log("Links:", point.link_ids);

            let url = emptyImagePath;
            if(point.image.name != "") url = SERVER_URL + "images/" + point.image.name;

            //For each link
            point.link_ids.forEach(link_id => {

                let pointInCurrLevel = findPointInLevelById(levelObj.payload.points, link_id);

                if (pointInCurrLevel != null) {
                    //Link was internal
                    console.log("Internal Link");
                    console.log(pointInCurrLevel);

                    let yaw = findAngleBetweenPoints(point, pointInCurrLevel);
                    console.log("Hospot Yaw", yaw);
                    //Add Link
                    hotSpots.push(newHotSpot(0, yaw, point.type, pointInCurrLevel._id, 0, 0)); //Temp external
                }
                else {
                    //External point
                    hotSpots.push(newHotSpot(0, 10, "External", EXTERNAL_POINT_PREFIX + point._id))
                    console.log("External Link");
                }
            });

            scenes[point._id] = newSceneObject("Waikato Virtual Tour!", url, hotSpots);
        }
    });

    console.log("Setting up Viewer")
    configurePanoViewer(scenes, localStorage.getItem(LOCALSTORAGE_POINT));
}

function newHotSpot(pitch, yaw, point_name, scene_id) {
    console.log("Yaw for handler function", yaw);
    return {
        "pitch": pitch,
        "yaw": yaw,
        "type": "scene",
        "text": point_name,
        "sceneId": scene_id,
        "clickHandlerFunc": onHotSpotClick,
        "clickHandlerArgs": yaw,
        //"cssClass": "default-hotspot"
    }
}

function newSceneObject(title, url, hotspots) {
    return {
            "title": title,
            "hfov": 110,
            "pitch": 0,
            "yaw": 0,
            "type": "equirectangular",
            "panorama": url,
            "hotSpots": hotspots
    }
}

function findPointInLevelById(points, link_id) {
    return points.find(point => point._id == link_id);
}