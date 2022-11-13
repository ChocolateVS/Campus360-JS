let floorplan_overlay;

let temp_points;
let temp_current;

function setupMap(imgLoc){
    $(".floorplan").attr("src", API_PREFIX + "/images/" + imgLoc);
     floorplan_overlay = $("#floorplan_click_overlay");
}

function drawPoints(points, currPointID){

    //For Resize Event
    temp_points = points;
    temp_current = currPointID;

    $(".floorplan_buttons_container").width($(".floorplan").width());
    $(".floorplan_buttons_container").height($(".floorplan").height());

    let pointSize = $(".floorplan").width() * 0.04;

    $(".floorplan_buttons_container").empty();

    //For each point, create a button and put it in the buttons container
    //Set the top and right margins to position it
    for (var coord of points) {
    
        let x = coord.x * $(".floorplan").width();
        let y = coord.y * $(".floorplan").height();

        let button = document.createElement('input');
        button.setAttribute('type', 'button');
        button.setAttribute('class', 'floorplan_button');
        button.setAttribute('onclick', 'navigateToPoint("' + coord._id + '")');
        button.style.width = pointSize + "px";
        button.style.height = pointSize + "px";
        button.style.marginLeft = (x - (pointSize / 2)) + "px";
        button.style.marginTop = (y - (pointSize / 2)) + "px";
        button.style.marginBottom = "0px";
        button.style.marginRight = "0px";
        button.style.padding = "0px";
        button.style.backgroundColor = "transparent";

        if(coord._id == currPointID) {
          button.style.backgroundImage = "url('./images/current_location.png')";
          
        }
        else button.style.backgroundImage = "url('./images/location_blue.png')";
        

        $(".floorplan_buttons_container").append(button);
    }
}

function navigateToPoint(point) {
    console.log("Navigating to point", point);
    viewer.loadScene(point);
}

$(".cornerMap").hover(
    function() {
        console.log("OK");
      $(".floorplan_buttons_container").addClass("hover");
    }, 
    function() {
      $(".floorplan_buttons_container").removeClass("hover");
    }
  );

  window.addEventListener("resize", e => {
    drawPoints(temp_points, temp_current);
    console.log("resize");
  });

