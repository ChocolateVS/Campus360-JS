let SERVER_API_URL = 'http://campus.rowansserver.com/api/'
let SERVER_URL = 'http://campus.rowansserver.com/'

function id(id) { return document.getElementById(id); }

const hardcodedProject = "485b3c31c3d347ae84108de9";
const hardcodedArea = "cea7fe83458047069d96a023";
const hardcodedLevel = "49337c5c0aac47919a5ab35c";

createScene(hardcodedProject, hardcodedArea, hardcodedLevel)

function setupViewer(scenes, first_scene) {
    console.log("Config pano", scenes, first_scene)
    
    pannellum.viewer('panorama', {   
        "default": {
            "firstScene": first_scene,
            "author": "Waikato Students",
            "sceneFadeDuration": 500,
            "autoLoad": true
        },
        scenes
    });
}

async function createScene(project, area, level) {
    let scenes = {}

    //Get Level
    let levelObj = await (await fetch(SERVER_API_URL + 
            'project/' + project + 
            '/area/' + area + 
            '/level/' + level))
        .json();
    
    console.log("Level:", levelObj)
    
    if (levelObj == null) { 
        console.log('Could not fetch Level'); 
        return; 
    }

    let firstScene = levelObj.payload.points[0]._id

    //Link Panoramas
    levelObj.payload.points.forEach(point => {
        console.log("\n Getting Links for Point:", point);

        let hotSpots = [];

        //If the panorama should be linked
        if (point.link_ids != null) {

            console.log("Links:", point.link_ids);

            let url = SERVER_URL + "images/" + point.image.name;

            //For each link
            point.link_ids.forEach(link => {
                
                let linked_point = findPointById(levelObj.payload.points, link);
                
                //If link is internal
                if (linked_point != null) {
                    //Link was internal
                    console.log("Internal Link");
                    console.log(linked_point);

                    let yaw = findAngleBetweenPoints(point, linked_point, 1919);
                    console.log(yaw);

                    //Add Link
                    hotSpots.push(new newHotSpot(0, yaw, linked_point.image.name, linked_point._id, 0, 0));
                }
                else {
                    //Link was external - add flag for when this link is used to jump to / create new scene
                    console.log("External Link");
                }
            });

            scenes[point._id] = newSceneObject("Waikato Virtual Tour!", url, hotSpots);
        }

        //let pointInfo = await (await fetch(SERVER_API_URL + 'project/' + hardcodedProject + '/area/' + hardcodedArea + '/level/' + hardcodedLevel + '/point/' + levelObj.payload.points[0]._id)).json();
        //if (pointInfo == null) { console.log('Could not get Point'); return; }
    });

    setupViewer(scenes, firstScene);
}

function newHotSpot(pitch, yaw, point_name, scene_id, targetYaw, targetPitch) {
    return {
        "pitch": pitch,
        "yaw": yaw,
        "type": "scene",
        "text": point_name,
        "sceneId": scene_id,
        "targetYaw": targetYaw,
        "targetPitch": targetPitch
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
function findPointById(points, link_id) {
    return points.find(point => point._id == link_id);
}







  
