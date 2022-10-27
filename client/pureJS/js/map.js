let floorplan_overlay;
let floorplan_canvas = document.querySelector(".floorplan_canvas");

function setupMap(imgLoc){
    $(".floorplan").attr("src", "http://campus.rowansserver.com/images/" + imgLoc);
     floorplan_overlay = $("#floorplan_click_overlay");

    //ToDo: Create clickable areas to move to.
}

function drawPoints(points, currPointID){
    let ctx = floorplan_canvas.getContext('2d');
    ctx.canvas.width = $(".floorplan").width();
    ctx.canvas.height = $(".floorplan").height();
    ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);

    let pointSize = ctx.canvas.width * 0.02;

    for (var coord in points){
        if(points[coord]._id == currPointID) ctx.fillStyle = "blue"; // Red color
        else ctx.fillStyle = "red"; // Red color
        ctx.beginPath();
        ctx.arc(points[coord].x*ctx.canvas.width, points[coord].y*ctx.canvas.height, pointSize, 0, Math.PI * 2, true);
        ctx.fill();
    }
}

