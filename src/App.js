import './App.css';
import HomePage from './pages/HomePage';
import CameraPage from './pages/CameraPage';
import GaragePage from './pages/GaragePage';
import React from 'react';

import LoginPage from './pages/LoginPage';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  
  //main app return
  //just renders the activePage and navbar
  return (
    <div class="app">
      <Router>
        <Routes>
          <Route exact path="/SeniorProject" element={<LoginPage/>}/>
          <Route exact path="/home" element={<HomePage/>}/>
          <Route exact path="/camera" element={<CameraPage/>}/>
          <Route exact path="/garage" element={<GaragePage/>}/>
          <Route path="*" element={<Navigate to="/SeniorProject" />}/>
        </Routes>
      </Router>
    </div>
  );
  
}

export default App;
