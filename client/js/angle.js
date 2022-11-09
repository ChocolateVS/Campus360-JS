/**
 * Determines angle between current point and linked point  
 * returns supposed Yaw in degrees
 */
 function angleBetweenPoints(currPoint, linkPoint) {    
    let rad = find_angle({x:currPoint.x, y: 10000},currPoint, linkPoint) //Angle
    let arc = rad * (180 / (Math.PI)) //Find arc length of the 'north' facing angle differennce, to gi
    return arc
}

/*
 function angleBetweenPoints(currPoint, linkPoint, widthOfMap, heightOfMap) {    
    let rad = find_angle({x:currPoint.x*widthOfMap, y: 0}, {x:currPoint*widthOfMap, y:currPoint.y*heightOfMap}, {x:linkPoint.x * widthOfMap, y: linkPoint.y * heightOfMap}) //Angle
    let arc = rad * (180 / (Math.PI)) //Find arc length of the 'north' facing angle differennce
    return arc
}
*/
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