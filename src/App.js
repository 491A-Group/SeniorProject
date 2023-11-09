import React from 'react';
import { useState, useCallback} from 'react';
import logo from './logo.svg';
import './App.css';
import Card from './components/Card';
import Webcam from 'react-webcam';

function App() {

  const vc = {
    facingMode: { exact: "environment" }
  }

  const webcamRef = React.useRef(null);
  const [imageSrc, setImageSource] = useState("result");

  const fetchString = (imageData) => {
    fetch('https://sc-prediction-model.brian2002.com/predict', {
      method: 'POST',
      body: imageData, // This should be the image data to send to the server
      headers: {
        // You may need to set appropriate headers based on your server's requirements
        // For example, 'Content-Type': 'image/jpeg' or 'Content-Type': 'multipart/form-data'
      },
    })
      .then((response) => response.text())
      .then((data) => {
        setImageSource(data);
        console.log(data);
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
    <div className="App">
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={vc}/>
      <button onClick={capture}>:3 pls work!!</button> 
      <p>{imageSrc}</p>
      <Card make="Ferrari" rarity={100} model="250 Testa Rossa" generation="1957-1961"/>
    </div>
  );
}

export default App;
