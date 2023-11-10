import './CameraPage.css';
import React from 'react';
import Webcam from 'react-webcam';
import { useState, useCallback} from 'react';
import {Buffer} from 'buffer';


export default function CameraPage({clientID}) {

    const vc = {
        facingMode: { exact: "environment" }
      }
    
      const webcamRef = React.useRef(null);
      const [imageSrc, setImageSource] = useState("");
      const [predictionResult, setPrediction] = useState("");
    
      //main function for prediction communication
      //sends image data over to server
      //gets string prediction back
      const fetchString = (base64String) => {
        // Convert base64 to binary, which will later become a uint8 array
        const binaryData = Buffer.from(
          base64String.slice(22), //drop the first characters //
          'base64'
        );

        // Send the POST request with the image data.
        fetch('https://sc-prediction-model.brian2002.com/predict', {
          method: 'POST',
          body: binaryData
        })
          .then((response) => response.text())
          .then((data) => {
            //get the prediction from the server, set the variable
            setPrediction(data);
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
          setImageSource(webcamRef.current.getScreenshot());

          //send screenshot, get prediction
          fetchString(imageSrc);      
        },

        //references used in callback
        //anything that the callback needs to "pay attention" to needs to be here
        [webcamRef, fetchString]
      );
    
    
      //returns the main camera page to be displayed
      return (
        <div className="CameraPage">
          <Webcam width="500" height="500" ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={vc}/>
          <button onClick={capture}>Take Photo</button> 
          <p>{predictionResult}</p>
        </div>
      );
};