let floorplan_overlay;

function setupMap(imgLoc){
    $(".floorplan").attr("src", "http://campus.rowansserver.com/images/" + imgLoc);
     floorplan_overlay = $("#floorplan_click_overlay");

    //ToDo: Create clickable areas to move to.
}

function drawPoints(points, currPointID){
    $(".floorplan_buttons_container").width($(".floorplan").width());
    $(".floorplan_buttons_container").height($(".floorplan").height());

    let pointSize = $(".floorplan").width() * 0.04;

    $(".floorplan_buttons_container").empty();

    for (var coord of points) {
        let color = "red"
        if(coord._id == currPointID) color = "blue";

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
        button.style.backgroundColor = color;
        button.style.padding = "0px";

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

