function setupMap(imgLoc, points, currPointID){
    const img = document.getElementById("mapImage");
    const imgClickMap = document.getElementById("mapMap");
    img.src = "https://campus.rowansserver.com/images/" +imgLoc;
    //ToDo: Create clickable areas to move to.
}



function drawPoints(points, currPointID){
    const canvas = document.getElementById("mapCanvas");
    
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height)
    let pointSize = ctx.canvas.width * 0.02;

    for (var coord in points){
        if(points[coord]._id == currPointID) ctx.fillStyle = "blue"; // Red color
        else ctx.fillStyle = "red"; // Red color
        ctx.beginPath();
        ctx.arc(points[coord].x*ctx.canvas.width, points[coord].y*ctx.canvas.height, pointSize, 0, Math.PI * 2, true);
        ctx.fill();
    }
}

