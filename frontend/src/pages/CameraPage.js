//All work done by Cameron Weiss, unless stated otherwise
import './CameraPage.css';
import React from 'react';
import Webcam from 'react-webcam';
import { useState, useCallback, useEffect} from 'react';

import Garage from "../images/garage.png";
import Home from "../images/home.png";
import Circle from "../images/circle-100.png";


//cameron
//overall camera page
export default function CameraPage({changePage}) {

  //cameron
  //specs for the webcam module, makes the camera be the forward facing camera
  const vc = {
      facingMode: { exact: "environment" },
  }


  //cameron
  //THIS FUNCTION FORCES THE PAGE TO NOT SCROLL AT ALL
    useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
          document.body.style.overflow = "scroll"
      };
  }, []);

  //cameron
  //navigation function to call in the button callback
  const toCatch = () => {
    changePage("Catch");
  }

  const fetchString = (base64String) => {
    fetch('https://sc-backend.brian2002.com/predict', {
      method: 'POST',
      body: base64String
    })
    .then((response) => response.text())
    .then((data) => {
      //get the prediction from the server, set the variable
      setImageSource(data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  };


  
  //cameron
  //webcam reference and imageSrc Reference to be seen later
  const webcamRef = React.useRef(null);
  const [imageSrc, setImageSource] = useState("");


  //cameron
  //function for getting the screenshot and go to the catch results page
  const capture = useCallback(async () => {
    setImageSource(webcamRef.current.getScreenshot());
    localStorage.setItem("imageBase", imageSrc);
    // Now call toCatch()
    fetchString(imageSrc);
    toCatch();
  }, [webcamRef, imageSrc, toCatch]);

      //cameron
      //main camera page JSX
      //spawns a webcam
      //main menu button on the bottom
      return (
        <div>
          <div className="Camera">
            {imageSrc}
            <Webcam className="Camera" ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={vc}/>
            <div className="navBar">
              <button onClick={() => {changePage("Home")}} className="navButton"><img width="50vw" src={Home}/></button>
              <button onClick={capture} className="navButton"><img width="100vw" src={Circle}/></button>
              <button onClick={() => {changePage("Garage")}} className="navButton"><img width="50vw" src={Garage}/></button>
            </div>
          </div>
        </div>
      );

};