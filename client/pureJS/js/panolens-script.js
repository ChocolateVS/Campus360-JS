let SERVER_API_URL = 'http://campus.rowansserver.com/api/'
let SERVER_URL = 'http://campus.rowansserver.com/'

function id(id) { return document.getElementById(id); }

let panoramas = [];


var viewer, container, infospot, controlButton, modeButton, videoButton;

var controlIndex = PANOLENS.CONTROLS.ORBIT;
var modeIndex = 0;
var videoPlaying = false;

container = document.querySelector('#container');
controlButton = document.querySelector('#controlButton');
modeButton = document.querySelector('#modeButton');
videoButton = document.querySelector('#videoButton');

const hardcodedProject = "485b3c31c3d347ae84108de9";
const hardcodedArea = "cea7fe83458047069d96a023";
const hardcodedLevel = "49337c5c0aac47919a5ab35c";

initialize()
createScene(hardcodedProject, hardcodedArea, hardcodedLevel)

function initialize() {
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

    //Viewer Controls to change view type
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

function setupViewer(panoramas) {
    console.log("Config pano")
    
    viewer = new PANOLENS.Viewer({ output: 'console', container: container, horizontalView: false });

    for (p in panoramas) {
        viewer.add(panoramas[p].panorama);
    }
}

async function createScene(project, area, level) {
    panoramas = []
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
    
    //Add each Panorama to an array
    for (point in levelObj.payload.points) {
        var panorama;
        panorama = new PANOLENS.ImagePanorama(SERVER_URL + 'images/' + levelObj.payload.points[point].image.name);

        //Set the orientation of the panorama? This probably hardcodes a position, not what we want
        panorama.addEventListener('enter-fade-start', function() {
            viewer.tweenControlCenter(new THREE.Vector3(0, 0, 0), 0);
        });
        
        panoramas.push({'point': levelObj.payload.points[point], 'panorama': panorama});
    }

    setupViewer(panoramas);

    //Link Panoramas
    for (p in panoramas) {
        console.log("\n Checking Links for Point:", panoramas[p].point.link_ids);

        //If the panorama should be linked
        if (panoramas[p].point.link_ids != null) {

            console.log("Links:", panoramas[p].point.link_ids);

            //For each link
            for (link in panoramas[p].point.link_ids) {
                
                let linked_panorama = findPanoramaById(panoramas, panoramas[p].point.link_ids[link]);
                
                console.log(linked_panorama);
                
                //If link is internal
                if (linked_panorama != null) {
                    //Link was internal
                    console.log("Internal Link");

                    //Add Link
                    panoramas[p].panorama.link(linked_panorama, new THREE.Vector3(-100, -500, -5000));
                    //panoramas[p].panorama.link(linked_panorama, new THREE.Vector3(0, 0, -Number.MAX_SAFE_INTEGER));
                }
                else {
                    //Link was external - add flag for when this link is used to jump to / create new scene
                    console.log("External Link");
                }
            }
        }

        //let pointInfo = await (await fetch(SERVER_API_URL + 'project/' + hardcodedProject + '/area/' + hardcodedArea + '/level/' + hardcodedLevel + '/point/' + levelObj.payload.points[0]._id)).json();
        //if (pointInfo == null) { console.log('Could not get Point'); return; }
    
        
    }
    


    //Add Links
    //infospot = new PANOLENS.Infospot(350, PANOLENS.DataImage.Info);
    //infospot.position.set(0, -2000, -5000);
    //default_panorama.add(infospot);
}

function findPanoramaById(panoramas, link_id) {
    //panoramas = [{_id, panorama}, {id, panorama}]
    console.log(panoramas)
    return panoramas.find(panorama => panorama.point._id == link_id);
}







  
