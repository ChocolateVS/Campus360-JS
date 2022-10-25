import React from "react";
import logo from "./logo.svg";
import Pano from './components/Pano.js';
import Map from './components/Map.js';
import "./App.css";

const hardcodedProject = "485b3c31c3d347ae84108de9";
const hardcodedArea = "d56b5b91eb4b4faab2ff4a4a";
const hardcodedLevel = "8535bdd97dd844289e3f2936";


function App() {
  const builtURL = "http://campus.rowansserver.com/api/project/"+hardcodedProject+ "/area/" + hardcodedArea + "/level/" + hardcodedLevel
  const [data, setData] = React.useState(null);
  const [currLevel, setCurrLevel] = React.useState(null);
  
  React.useEffect(() => {
    fetch(builtURL)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setCurrLevel(data.payload)
      });
  }, [builtURL]);



  return (
    <div className="App">
      <header className="App-header">
        {
          currLevel ? 
        (<Map id="mapImage" currURL={builtURL} imageName={currLevel.image.name} level={currLevel}/>)
        : null
        }
        {
          currLevel ? 
        (<Pano id="panoImage" currURL={builtURL} level={currLevel}/>)
        : null
        }
      </header>
    </div>
  );
}

export default App;