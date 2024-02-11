import './App.css';
import HomePage from './pages/HomePage';
import CameraPage from './pages/CameraPage';
import GaragePage from './pages/GaragePage';
import React from 'react';

import { useState } from 'react';

import LoginPage from './pages/LoginPage';

import TestPage from './pages/TestPage';


function App() {

  const [activePage, setActivePage] = useState(null);
  

  return (
    <div class="app">
      {activePage ? activePage : <TestPage setAppPage={setActivePage} />}
    </div>
  );
  
}

export default App;
