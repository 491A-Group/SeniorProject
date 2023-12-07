import './App.css';
import HomePage from './pages/HomePage';
import CameraPage from './pages/CameraPage';
import GaragePage from './pages/GaragePage';
import React from 'react';
import { useState } from 'react';

import Camera from "./images/camera.png";
import Garage from "./images/garage.png";
import Home from "./images/home.png";

function App() {

  //active page variable
  //allows only one section of page to be rendered at a time
  const [activePage, setActivePage] = useState(<HomePage/>)


  //main app return
  //just renders the activePage and navbar
  return (
    <div class="app">
      <div className="topDisplay">
        <h1>Sportscar Spotter</h1>
      </div>
      <div className="content">
        {activePage}
      </div>
      
      <div className="nav">
            <button onClick={() => setActivePage(<HomePage/>)}>
              <img src={Home}/>
            </button>
            <button onClick={() => setActivePage(<CameraPage clientID={123}/>)}>
              <img src={Camera}/>
            </button>
            <button onClick={() => setActivePage(<GaragePage/>)}>
              <img src={Garage}/>
            </button>
      </div>
    </div>
  );
  
}

//<Card make="Ferrari" rarity={100} model="250 Testa Rossa" generation="1957-1961"/>

export default App;
