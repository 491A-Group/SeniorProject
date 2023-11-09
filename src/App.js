import React from 'react';
import { useState, useCallback} from 'react';
import logo from './logo.svg';
import './App.css';
import Card from './components/Card';
import Webcam from 'react-webcam';
import { METHODS } from 'http';

function App() {

  const vc = {
    facingMode: { exact: "environment" }
  }

  const webcamRef = React.useRef(null);
  const [imageSrc, setImageSource] = useState("result");

  const fetchPrediction = () => {
    let fetch_res = fetch(
      "http://192.168.1.69:3030/predict",
      {
        method: 'POST',
        data: imageSrc,
      });

      setImageSource(fetch_res);
  };

  const capture = useCallback(
    () => {
      setImageSource(webcamRef.current.getScreenshot());
      fetchString();
      
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
