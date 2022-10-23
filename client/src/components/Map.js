import React, {useEffect, useRef, useState, Image} from "react";
import $ from 'jquery'
import './Map.css'


function Map(props) {
  const [currPoint, setCurrPoint] = useState(() => {
    return props.level.points[0]
  });
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);


  


  const [mapAreas, setMapAreas] = useState(null);

  //get image from API and apply to tag
  useEffect(() => {
  
    fetch("http://campus.rowansserver.com/images/" + props.imageName)
      .then((res) => res.blob())
      .then((data) => {
        let objURL = URL.createObjectURL(data);
        setImage(objURL)
        
      })
     

  }, [props.imageName]);



//Update canvas width to exactly overlay img
  useEffect(() => {
    let canvas = canvasRef.current;
    let ctx = canvas.getContext('2d');
    canvas.width = document.getElementById('mapImage').width;
    canvas.height = document.getElementById('mapImage').height;
    ctx.width = canvas.width;
    ctx.height = canvas.height; 
  }, [image]);
  


  let returnAreas = (coords, width, height) => {
    let pointSize = width*0.04;
    return (
      <>
      {
        coords.map((coord, i) =>{
          
        return (<area alt="Point To Click" key={i+""+coord[0]+""+coord[1]} shape="circle" coords={coord[0]*width + ", " + coord[1]*height + ", " + pointSize} href="click.html" ></area>)
      })
    }</>)}

    //Update canvas with points
  useEffect(()=>{
    const ctx = document.getElementById('mapCanvas').getContext('2d')
    ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height)
    let pointSize = ctx.canvas.width * 0.02;
    
    for (var coord in props.level.points){
      ctx.fillStyle = "red"; // Red color
      ctx.beginPath();
      ctx.arc(props.level.points[coord].x*ctx.canvas.width, props.level.points[coord].y*ctx.canvas.height, pointSize, 0, Math.PI * 2, true);
      ctx.fill();
    }
 
    if(currPoint){
      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.arc(currPoint.x*ctx.canvas.width, currPoint.y*ctx.canvas.height, pointSize, 0, Math.PI * 2, true);
      ctx.fill();
    }
    setMapAreas(returnAreas(props.level.points, ctx.canvas.width, ctx.canvas.height))
  }, [props.level, image, currPoint])

  //Getsize of shape to influence coordinate decisions
  // useEffect(()=>{
  //   let widthOfImgMapper = document.getElementById('imageMap').width
  //   let heightOfImgMapper = document.getElementById('imageMap').height

  //   setMapAreas({
  //     id:'currLevelFloorplanClicks',
  //     name: "Floorplan",
  //     areas: returnAreas(props.level.points, widthOfImgMapper, he)
  //     });
  // }, [image, props.level.points])
  //-------------------
  // let returnAreas = (coords, width, height) => {
  //   let pointSize = width*0.04;
  //   return (
  //       coords.map((coord, i) =>{
  //       return {id:i+coord[0]+""+coord[1],  
  //       shape:"circle", 
  //       coords:[coord.x*width, coord.y*height, pointSize],
  //       preFillColor: 'red'}

  //    })
  //    )
  //   }

  return (
    <>
    
      <img id="mapImage" ref={imageRef} src={image} map="#mapMap" alt="mapOfLevel" className="imageMap"/>
      <map id="mapMap">
       {mapAreas}
      </map>
      <canvas ref={canvasRef} id="mapCanvas" className="imageMap"  pointerEvents='none' style={{zIndex: 3}}></canvas>
      </>
  );
}

export default Map;