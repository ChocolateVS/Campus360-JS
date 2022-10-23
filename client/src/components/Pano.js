import React, {useEffect, useState, useRef} from "react";
import {Pannellum} from 'pannellum-react';
import './Pano.css'


function find_angle(A,B,C) {
  var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));    
  var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2)); 
  var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
  return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
}

function Pano(props) {
  const [image, setImage] = useState(null);
  const [currPoint, setCurrPoint] = useState(() => {
    return props.level.points[0]
  });
  const [pointObj, setPointObj] = useState(null);

  const [hotspots, setHotspots] = useState(null);

  useEffect(() => {
    fetch(props.currURL + "/point/" + currPoint._id)
    .then((res) => res.blob())
    .then((data) => {
      setPointObj(data.payload);
    });

      fetch("http://campus.rowansserver.com/images/" + currPoint.image.name)
        .then((res) => res.blob())
        .then((data) => {
          let objURL = URL.createObjectURL(data);
          setImage(objURL);
        });
    }, [currPoint._id, currPoint.image.name, props.currURL, props.level.points]);



// useEffect(()=>{
//   setHotspots(getItems())
// }, [pointObj])


let getItems = () =>
{
  if(!pointObj) return;
  for (var index in pointObj.links){

    let angle = find_angle({x:currPoint.x, y: 0}, currPoint, pointObj.links[index])
    let arc = ( 2 * (Math.PI) * (document.getElementById('currPointPano').width || 500)/(Math.PI)) * ( angle / 360 ) //Find arc length of the 'north' facing angle differennce, to give YAW
    return (<Pannellum.Hotspot
    type="custom"
    pitch={0}
    yaw={arc}
    handleClick={(evt, name) => console.log(currPoint)}
    name={currPoint._id}
  />);

  }
}


console.log("http://campus.rowansserver.com/images/" + currPoint.image.name)

  return (
    <Pannellum
    id="currPointPano"
    width="100%"
    height="99vh"
    image={"http://campus.rowansserver.com/images/" + currPoint.image.name}
    autoLoad
    showZoomCtrl={false}
  >
</Pannellum>

  );
}

export default Pano;