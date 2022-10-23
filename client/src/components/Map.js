import React, {useEffect, useRef, useState, Image} from "react";
import './Map.css'


function Map(props) {
  const [currPoint, setCurrPoint] = useState(null);


  const [image, setImage] = useState(null);
  const [imgSize, setImgSize] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const fakePoints = [[0,0],[0.1, 0.5], [0.2345, 0.2345]]


  let returnAreas = (coords, width, height) => {
    let pointSize = 30;
    return (
      <>
      {
        coords.map((coord, i) =>{
          
        return (<area key={i+""+coord[0]+""+coord[1]} shape="circle" onClick={()=>{
          console.log('Called ' + coord[0] + " " + coord[1])
        }} coords={coord[0]*width + ", " + coord[1]*height + ", " + pointSize}></area>)
      })
    }</>)}


  const [mapAreas, setMapAreas] = useState(()=>{
    return returnAreas(fakePoints, 200, 300)
  });

  useEffect(() => {
  
    fetch("http://campus.rowansserver.com/images/" + props.imageName)
      .then((res) => res.blob())
      .then((data) => {
        let objURL = URL.createObjectURL(data);
        setImage(objURL)
      })
      const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    for (var coord in fakePoints){
      let pointSize = 30;
    
      ctx.fillStyle = "#ff2626"; // Red color
  
      ctx.beginPath();
      ctx.arc(coord[0]*200, coord[1]*300, pointSize, 0, Math.PI * 2, true);
      ctx.fill();
    }

  }, []);
  

//Update on
  useEffect(() => {
   let canvas = canvasRef.current;
   let ctx = canvas.getContext('2d');
   canvas.width = document.getElementById('mapImage').width;
   canvas.height = document.getElementById('mapImage').height;
   ctx.width = canvas.width;
   ctx.height = canvas.height; 

  }, [image]);
  


  return (
    <>
    
      <img id="mapImage" ref={imageRef} src={image} map="#mapMap" className="imageMap"/>
      <map id="mapMap">
        <area shape="rect" coords="0,0,400,400" href="/api" onClick={()=>{
          console.log("Run")
        }}></area>
      </map>
      <canvas ref={canvasRef} id="mapCanvas" className="imageMap"></canvas>
      </>
  );
}

export default Map;