import './CameraPage.css';
import React from 'react';
import Webcam from 'react-webcam';
import { useState, useCallback, useEffect} from 'react';

import Garage from "../images/garage.png";
import Home from "../images/home.png";
import Circle from "../images/circle-100.png";

export default function CameraPage({changePage}) {

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

  const toCatch = () => {
    changePage("Catch");
  }


  
    
  const webcamRef = React.useRef(null);
  const [imageSrc, setImageSource] = useState("");


  //main function for prediction communication
  //sends image data over to server
  //gets string prediction back

  //function for getting the screenshot
  //automatically sends prediction to the server
  const capture = useCallback(
    () => {
      setImageSource(webcamRef.current.getScreenshot());
      localStorage.setItem("imageBase", imageSrc);
      toCatch();
    },
    [webcamRef]
    );


      return (
        <div>
          <div className="Camera">
            <Webcam className="Camera" ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={vc}/>
            {/*catchWindow*/}
            <div className="navBar">
              <button onClick={() => {changePage("Home")}} className="navButton"><img width="50vw" src={Home}/></button>
              <button onClick={capture} className="navButton"><img width="100vw" src={Circle}/></button>
              <button onClick={() => {changePage("Garage")}} className="navButton"><img width="50vw" src={Garage}/></button>
            </div>
          </div>
        </div>
      );

};