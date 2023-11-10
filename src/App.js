import './App.css';
import HomePage from './pages/HomePage';
import CameraPage from './pages/CameraPage';
import React from 'react';
import { useState } from 'react';

function App() {

  //active page variable
  //allows only one section of page to be rendered at a time
  const [activePage, setActivePage] = useState(<HomePage/>)


  //main app return
  //just renders the activePage and navbar
  return (
    <div>
      {activePage}
      <div>
            <p>This is the navBar</p>
            <button onClick={() => setActivePage(<CameraPage clientID={123}/>)}>Camera</button>
      </div>
    </div>
  );
  
}

//<Card make="Ferrari" rarity={100} model="250 Testa Rossa" generation="1957-1961"/>

export default App;
