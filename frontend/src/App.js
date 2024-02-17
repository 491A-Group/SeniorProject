import './App.css';
import React from 'react';
import { useState } from 'react';

import TestPage from './pages/TestPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import GaragePage from './pages/GaragePage';
import CameraPage from './pages/CameraPage';
import CatchPage from './pages/CatchPage';

function App() {

  const [activePage, setActivePage] = useState(null);

  const changePage = (page) => () =>
    {
      setActivePage(<LoginPage changePage={changePage}/>)
      switch(page)
      {
        case "Login":
          setActivePage(<LoginPage changePage={changePage}/>)
          break;
        
        case "Garage":
          setActivePage(<GaragePage changePage={changePage}/>)
          break;

        case "Home":
          setActivePage(<HomePage changePage={changePage}/>)
          break;

        case "Camera":
          setActivePage(<CameraPage changePage={changePage}/>)
          break;

        case "Test":
          setActivePage(<TestPage changePage={changePage}/>)
          break;

        case "Catch":
          setActivePage(<CatchPage changePage={changePage} />)
          break;

        default:
          setActivePage(<TestPage changePage={changePage}/>)
          break;
      }
        
    }
  

  return (
    <div className="app">
      {activePage ? activePage : <TestPage changePage={changePage} />}
    </div>
  );
  
}

export default App;
