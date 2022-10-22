import * as Marzipano from 'marzipano';
import React from "react";

function Pano(props) {
  const [image, setImage] = React.useState(null);

  React.useEffect(() => {
    fetch("http://campus.rowansserver.com/images/" + props.imageName)
      .then((res) => res.blob())
      .then((data) => {
        let objURL = URL.createObjectURL(data);
        setImage(objURL)
      });
  }, []);


  var panoElement = document.getElementById('panoviewer');
    var viewerOpts = {
      controls: {
        mouseViewMode: 'drag'    // drag|qtvr
      }
    };
var viewer = new Marzipano.Viewer(panoElement, viewerOpts)

  return (
        <div id="panoviewer">{!image ? "Loading..." : "Viewer should show now"}</div>
  );
}

export default Pano;