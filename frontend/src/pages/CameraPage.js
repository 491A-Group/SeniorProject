//All work done by Cameron Weiss, unless stated otherwise
import './CameraPage.css';
import React from 'react';
import Webcam from 'react-webcam';
import { useCallback, useEffect} from 'react';
import { Buffer } from 'buffer';

import Garage from "../images/garage.png";
import Home from "../images/home.png";
import Circle from "../images/circle-100.png";


//cameron
//overall camera page
export default function CameraPage({changePage, setSource, source}) {

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
  
  //cameron
  //webcam reference and imageSrc Reference to be seen later
  const webcamRef = React.useRef(null);

  const changeSource = () => {
    setSource(previousValue => {
      const newValue = webcamRef.current.getScreenshot() ? webcamRef.current.getScreenshot() : "data:image/jpg;base64,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"; 

      const binaryData = Buffer.from(
        newValue.slice(22),
        'base64'
      )
      fetch(window.location.origin + '/predict', {
        method: 'POST',
        body: binaryData
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not OK")
        }
        return response.json();
      })
      .then(data => {
          toCatch();
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
      return newValue; // Return the updated value
    });
  };
  //cameron
  //function for getting the screenshot and go to the catch results page
  const capture = useCallback(async () => {
    changeSource();
  }, [webcamRef, setSource, changeSource]);

      //cameron
      //main camera page JSX
      //spawns a webcam
      //main menu button on the bottom
      return (
        <div>
          <div className="Camera">
            {source}
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
