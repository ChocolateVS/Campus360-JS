const SERVER_API_URL = API_PREFIX + '/api/';
const SERVER_URL = API_PREFIX + "/";
const EXTERNAL_POINT_PREFIX = 'external-' //allows us to identify external panos

const hardcodedProject = "485b3c31c3d347ae84108de9";
//Slightly Better Tour of my house
const hardcodedArea = "6ca3c2caaf5648c0839d2586";
const hardcodedLevel = "06fc572a9afd4abf99af8f1b"

const maxDegree = 360;
const degreeOffsetForPercentConvert = 180; //0.5 is the default 'north' value, i.e. centre of image, thus -180 from the angles will return where it should face

let target_yaw = 0;
let levelObj;
let viewer;

if (!localStorage.getItem(LOCALSTORAGE_PROJECT)) { //If the project is not set, should completely reset
    localStorage.setItem(LOCALSTORAGE_PROJECT, hardcodedProject)
    localStorage.setItem(LOCALSTORAGE_AREA, hardcodedArea)
    localStorage.setItem(LOCALSTORAGE_LEVEL, hardcodedLevel)
    localStorage.removeItem(LOCALSTORAGE_POINT); //starting location
}

function id(id) { return document.getElementById(id); }


var onHotSpotClick = function(event, yaw) {
    console.log("Hotspot Clicked", yaw);
    target_yaw = yaw;
};

const emptyImagePath = API_PREFIX + "/images/default.jpg";

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

    viewer.on('scenechange', async(id) => {
        viewer.setYaw(target_yaw, false);
        console.log("Setting Target Yaw", target_yaw);

        drawPoints(levelObj.payload.points, id);

        if (id.startsWith(EXTERNAL_POINT_PREFIX)) {
            //Object is in another level - move view over to new level & reload
            console.log(id + " Is External")
            let restoredID = id.substring(EXTERNAL_POINT_PREFIX.length)
            let info = await (await fetch(API_PREFIX + '/api/pointlocation/' + restoredID)).json();
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
    levelObj = await (await fetch(API_PREFIX + "/api/" +
        'project/' + project +
        '/area/' + area +
        '/level/' + level)).json();

    console.log("Level:", levelObj)

    if (levelObj == null) {
        console.log('Could not fetch Level');
        return;
    }

    //Configure current point
    if (!localStorage.getItem(LOCALSTORAGE_POINT))
        localStorage.setItem(LOCALSTORAGE_POINT, levelObj.payload.points[0]._id);

    //Config map in bottom right corner
    setupMap(levelObj.payload.image.name);
    drawPoints(levelObj.payload.points, localStorage.getItem(LOCALSTORAGE_POINT));

    //Link Panoramas
    levelObj.payload.points.forEach(point => {
        console.log("\n Getting Links for Point:", point);

        let hotSpots = [];

        //If the panorama should be linked to anything else
        if (point.link_ids != null) {

            console.log("Links:", point.link_ids);

            let url = emptyImagePath;
            if (point.image.name != "") url = API_PREFIX + "/images/" + point.image.name;

            //For each link
            point.link_ids.forEach(async link_id => {

                let pointInCurrLevel = findPointInLevelById(levelObj.payload.points, link_id);
                
                let northPercent = point.image.north || 0.5; //0.5 is middle of image/default centre
                let preCheckNorthOffset = (degreeOffsetForPercentConvert * (1 + northPercent)) %  maxDegree;
                let northOffset = northPercent > 0.5 ? -1 * (preCheckNorthOffset + maxDegree) : preCheckNorthOffset; //Add or invert based on if it is >halfway
                
                if (pointInCurrLevel != null) {
                    //Link was internal
                    console.log("Internal Link");
                    console.log(pointInCurrLevel);
                    
  
                    let yaw =  findAngleBetweenPoints(point, pointInCurrLevel);// + northOffset; <---work in progress
                    console.log("Hospot Yaw", yaw);
                    //Add Internal Link
                    hotSpots.push(newHotSpot(0, yaw, point.type, pointInCurrLevel._id));
                } else {
                    //Finds location of external point, and gets its information
                    let externalPointLocation = await (await fetch(API_PREFIX + "/api/" +
                        'project/' + project +
                        '/pointlocation/' + link_id)).json();
                    let externalPoint = await (await fetch(API_PREFIX + "/api/" +
                        'project/' + project +
                        '/area/' + externalPointLocation.area._id +
                        '/level/' + externalPointLocation.level._id + '/point/' + link_id)).json(); //Bit hacky, e
                    let yaw =  findAngleBetweenPoints(point, externalPoint);// + northOffset; <---work in progress//External point
                    hotSpots.push(newHotSpot(0, yaw, "External", EXTERNAL_POINT_PREFIX + link_id));
                    console.log("External Link");
                }
            });

            scenes[point._id] = newSceneObject("Waikato Virtual Tour!", url, hotSpots);
        }
    });

    console.log("Setting up Viewer");
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
