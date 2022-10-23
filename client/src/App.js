import React from "react";
import logo from "./logo.svg";
import Pano from './components/Pano.js';
import Map from './components/Map.js';
import "./App.css";


const hardcodedProject = "485b3c31c3d347ae84108de9";
const hardcodedArea = "cea7fe83458047069d96a023";
const hardcodedLevel = "49337c5c0aac47919a5ab35c";


function App() {
  const [data, setData] = React.useState(null);
  const [currLevel, setCurrLevel] = React.useState(null);
  React.useEffect(() => {
    fetch("http://campus.rowansserver.com/api/project/"+hardcodedProject+ "/area/" + hardcodedArea + "/level/" + hardcodedLevel)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setCurrLevel(data.payload)
      });
  }, []);



  return (
    <div className="App">
      <header className="App-header">
        {
          currLevel ? 
        (<Map id="mapImage" imageName={currLevel.image.name}/>)
        : null
        }
        {
          currLevel ? 
        (<Pano id="panoImage" level={currLevel}/>)
        : null
        }
      </header>
    </div>
  );
}

export default App;