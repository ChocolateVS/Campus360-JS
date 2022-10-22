import * as Marzipano from 'marzipano';
import React, {useEffect, useState, useRef} from "react";
import $ from 'jquery';
import './Pano.css'

function Pano(props) {
  const [image, setImage] = useState(null);
  const viewerRef = useRef(null);

  useEffect(() => {
      fetch("http://campus.rowansserver.com/images/" + props.level.points[0].image.name)
        .then((res) => res.blob())
        .then((data) => {
          let objURL = URL.createObjectURL(data);
          setImage(objURL)

          let panoElement = viewerRef.current;
        let viewerOpts = {
          controls: {
            mouseViewMode: 'drag'    // drag
          }
        };
        
        
        let viewer = new Marzipano.Viewer(panoElement, viewerOpts)
        
        var source = Marzipano.ImageUrlSource.fromString(image);
        var view = new Marzipano.RectilinearView();
        
        let geometry = new Marzipano.EquirectGeometry([{width: image.width}]);


        var scene = viewer.createScene({
          source: source,
          view: view,
          geometry:geometry
        });
        
        
        });


        
    }, []);

   

  return (
        <img id="panoviewer" src={image}/>

  );
}

export default Pano;