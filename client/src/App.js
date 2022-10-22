import React from "react";
import logo from "./logo.svg";
import Pano from './components/Pano.js';
import Map from './components/Map.js';
import "./App.css";


const hardcodedProject = "dfde9b0c81dc4e81a91e7b24";
const hardcodedArea = "706f8b03f1364b7d96f79400";
const hardcodedLevel = "6c780aaa2b13426a89802c6d";


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
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : JSON.stringify(currLevel)}</p>
        <div id="panoviewer"></div>
        {
          currLevel ? 
        (<Map id="mapImage" imageName={currLevel.image.name}/>)
        : null
        }
      </header>
    </div>
  );
}

export default App;