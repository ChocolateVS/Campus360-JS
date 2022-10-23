import React, {useEffect, useState, useRef} from "react";

import './Pano.css'

function Pano(props) {
  const [image, setImage] = useState(null);
  const viewerRef = useRef(null);

  useEffect(() => {
      fetch("http://campus.rowansserver.com/images/" + props.level.points[0].image.name)
        .then((res) => res.blob())
        .then((data) => {
          let objURL = URL.createObjectURL(data);
          setImage(objURL);
        });
    
        
    }, []);

  return (
        <img id="panoviewer" src={image}/>

  );
}

export default Pano;