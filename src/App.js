import './App.css';
import CameraPage from './pages/CameraPage';
import HomePage from './pages/HomePage';
import React from 'react';
import { useState } from 'react';

function App() {

  const [activePage, setActivePage] = useState(<HomePage/>)

  const setPage = () => {
    setActivePage(<CameraPage clientID={123}/>);
  };


  return (
    <div>
      {activePage}
      <div>
        <p>This is the navBar</p>
        <button onClick={setPage}>Camera</button>
      </div>
    </div>
  );
  
}

//<Card make="Ferrari" rarity={100} model="250 Testa Rossa" generation="1957-1961"/>

export default App;
