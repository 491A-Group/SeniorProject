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

  const fetchString = (base64String) => {
    // Remove the data URI prefix, if it exists
    const base64Data = base64String.split(',')[1];

    // Decode the Base64 string into a Uint8Array
    const binaryData = atob(base64Data);

    // Create an ArrayBuffer from the Uint8Array
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const view = new Uint8Array(arrayBuffer);

    for (let i = 0; i < binaryData.length; i++) {
      view[i] = binaryData.charCodeAt(i);
    }
    // Send the POST request with the image data.
    fetch('https://sc-prediction-model.brian2002.com/predict', {
      method: 'POST',
      body: view,
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
      <button onClick={capture}>:3....pls work!!</button> 
      <p>{imageSrc}</p>
      <Card make="Ferrari" rarity={100} model="250 Testa Rossa" generation="1957-1961"/>
    </div>
  );
}

export default App;
