//All Work is Done by Cameron Weiss, unless stated otherwise

import './App.css';
import React from 'react';
import { useState } from 'react';

import TestPage from './pages/TestPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import GaragePage from './pages/GaragePage';
import CameraPage from './pages/CameraPage';
import CatchPage from './pages/CatchPage';
import WorkTest from './pages/WorkTest';

//cameron
//the overall main app function
function App() {

  //cameron
  //the active page is the variable we use to switch pages. The value is the page the user is viewing
  //setActivePage changes the variable activaPage via react's useState
  const [activePage, setActivePage] = useState(null);

  const [imageSrc, setImageSource] = useState("");

  const [prediction, setPrediction] = useState("NO PREDICTION");


  //cameron
  //the navigation function
  //page = the string of the page you want to go to
  const  changePage = (page) =>
    {

      console.log("PAGE SENT: " + page);

      //cameron
      //the overall page navigation logic
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
          setActivePage(<CameraPage changePage={changePage} setSource={setImageSource} setPredict={setPrediction}/>)
          break;

        case "Test":
          setActivePage(<TestPage changePage={changePage}/>)
          break;

        case "Catch":
          setActivePage(<CatchPage changePage={changePage} prediction={prediction} iSource={imageSrc}/>)
          break;

        default:
          setActivePage(<TestPage changePage={changePage} />)
          break;
      }
        
    }
  

    //cameron
    //the actual view of the app
  return (

    //cameron
    //the logic of the app. If activePage is null, we create a page. 
    //This does not set the activePage variable, but no route out of there 
    //allows for it to NOT be set and still exit the page
    //this allows full navigation of the site while maintaining the same URL
    <div className="app">
      {imageSrc}
      {prediction}
      {activePage ? activePage : <WorkTest changePage={changePage} iSource={imageSrc} setSource={setImageSource}/>}
    </div>
  );
  
}

export default App;
