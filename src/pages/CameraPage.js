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
    
      const fetchString = (base64String) => {
        // Convert base64 to binary, which will later become a uint8 array
        const binaryData = Buffer.from(
          base64String.slice(22), //drop the first characters //
          'base64'
        );
    
        if (imageSrc.length < 5)
        {
            capture();
            return;
        }
        // Send the POST request with the image data.
        fetch('https://sc-prediction-model.brian2002.com/predict', {
          method: 'POST',
          body: binaryData
        })
          .then((response) => response.text())
          .then((data) => {
            setPrediction(data);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      };
    
      
      const capture = useCallback(
        () => {
          setImageSource(webcamRef.current.getScreenshot());
          fetchString(imageSrc);      
        },
        [webcamRef, fetchString]
      );
    
    
      return (
        <div className="CameraPage">
          <Webcam width="1920" height="1080" ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={vc}/>
          <button onClick={capture}>Take Photo</button> 
          <p>{predictionResult}</p>
        </div>
      );
};