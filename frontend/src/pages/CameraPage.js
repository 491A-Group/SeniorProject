import './CameraPage.css';
import React from 'react';
import Webcam from 'react-webcam';
import { useState, useCallback, useEffect} from 'react';
import {Buffer} from 'buffer';

import Camera from "../images/camera.png";
import Garage from "../images/garage.png";
import Home from "../images/home.png";
import Circle from "../images/circle-100.png";

export default function CameraPage({changePage, clientID}) {

  const vc = {
      facingMode: { exact: "environment" },
  }


  //THIS FUNCTION FORCES THE PAGE TO NOT SCROLL AT ALL
    useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
          document.body.style.overflow = "scroll"
      };
  }, []);
    
  const webcamRef = React.useRef(null);
  const [imageSrc, setImageSource] = useState("");

  //main function for prediction communication
  //sends image data over to server
  //gets string prediction back
  const fetchString = (base64String) => {
    console.log("Got the string, now fetching...");
    // Convert base64 to binary, which will later become a uint8 array
    const binaryData = Buffer.from(
      base64String.slice(22), //drop the first characters
      'base64'
    );
    // Send the POST request with the image data.
    fetch('https://sc-backend.brian2002.com/predict', {
      method: 'POST',
      body: binaryData
    })
    .then((response) => response.text())
    .then((data) => {
      //get the prediction from the server, set the variable
      //setPrediction(data);
      console.log(data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  };

  //function for getting the screenshot
  //automatically sends prediction to the server
  const capture = useCallback(
    () => {
      //get screenshot
      console.log("IS THIS WORKING??");
      setImageSource(webcamRef.current.getScreenshot());
        //references used in callback
        //anything that the callback needs to "pay attention" to needs to be here

      fetchString(imageSrc);
    },
    [webcamRef]
    );
    
    
      //returns the main camera page to be displayed

      //<Webcam width="100%" height="100%" ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={vc}/>


      return (
        <div>
          <div className="Camera">
            <Webcam className="Camera" ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={vc}/>
            {/*catchWindow*/}
            <div className="navBar">
              <button onClick={changePage("Home")} className="navButton"><img width="50vw" src={Home}/></button>
              <button onClick={capture} className="navButton"><img width="100vw" src={Circle}/></button>
              <button onClick={changePage("Garage")} className="navButton"><img width="50vw" src={Garage}/></button>
            </div>
          </div>
        </div>
      );

};