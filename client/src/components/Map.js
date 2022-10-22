import {useEffect, useRef, useState} from "react";
import './Map.css'

function Map(props) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetch("http://campus.rowansserver.com/images/" + props.imageName)
      .then((res) => res.blob())
      .then((data) => {
        let objURL = URL.createObjectURL(data);
        setImage(objURL)
      });   
      
      
      
  }, []);


  
  let drawCoordinates = (x, y) =>{
    let pointSize = 7;
    let ctx = document.getElementById("mapCanvas").getContext("2d");

  	ctx.fillStyle = "#ff2626"; // Red color

    ctx.beginPath();
    ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
    ctx.fill();
  }

 
 
  
  return (
    <>
      { image ? 
      (
       <>
            <div class="outsideWrapper">
          <div class="insideWrapper">
              <img id="mapImage" src={image} className="coveredImage"/>
              <canvas id="mapCanvas" className="coveringCanvas"></canvas>
              <map>
                <area></area>

              </map>


            </div>
           </div>

        </>
      )
      : (<div>Loading...</div>)
      }
      </>
  );
}

export default Map;