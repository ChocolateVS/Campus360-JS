/**
 * Determines angle between current point and linked point  
 * returns supposed Yaw in degrees
 */
 function angleBetweenPoints(currPoint, linkPoint) {    
    let rad = find_angle({x:currPoint.x, y: 10000},currPoint, linkPoint) //Angle
    let arc = rad * (180 / (Math.PI)) //Find arc length of the 'north' facing angle differennce
    return arc
}


/** 
 * Finds degree northOffset from centre
*/
function findNorthOffset(percent, defaultPercent = 0.5)
{
    return (percent - defaultPercent) * 360;
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

function findAngleBetweenPoints(currPoint, linkPoint) {
    let x1 = currPoint.x;
    let y1 = currPoint.y;
    let x2 = linkPoint.x;
    let y2 = linkPoint.y;
    return 270 + Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;//atan returns radians 
}