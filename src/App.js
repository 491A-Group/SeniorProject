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
    // Remove the data URI prefix and decode the base64 string.
    const binaryData = atob(base64String);
  
    // Create an array to store the binary data.
    const byteArray = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      byteArray[i] = binaryData.charCodeAt(i);
    }
  
    // Create a Blob from the binary data.
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });
  
    // Create a FormData object to send the Blob as a file in the POST request.
    const formData = new FormData();
    formData.append('image', blob, 'image.jpg'); // You can adjust the file name as needed
  
    // Send the POST request with the image data.
    fetch('https://sc-prediction-model.brian2002.com/predict', {
      method: 'POST',
      body: formData,
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
