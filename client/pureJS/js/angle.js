/**
 * Determines angle between current point and linked point  
 * returns supposed Yaw
 */
 function angleBetweenPoints(currPointx, currPointy, point2x, point2y, widthOfPano) {    
    let rad = find_angle({x:currPointx, y: 0}, {x:currPointx,y:currPointy}, {x:point2x, y:point2y}) //Angle
    let arc = widthOfPano * ( rad / Math.PI ) //Find arc length of the 'north' facing angle differennce, to give YAW
    return arc
}
/**
 * Gets Radians between A & C, rotating about B  
 * A - point 1  
 * B - Centre point  
 * C - point 2  
 * Returns - Radians angle
 */
function find_angle(A,B,C) {
    var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));    
    var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2)); 
    var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
    return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
}

function findAngleBetweenPoints(A, B) {

    let width = 1919;
    let height = 959; 
    let x1 = (A.x * width)
    let x2 = (B.x * width)
    let y1 = (A.y * height)
    let y2 = (B.y * height)

    return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
}