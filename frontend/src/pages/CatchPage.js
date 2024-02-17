import { useEffect , useState} from 'react';
import { Buffer } from 'buffer';
import './HomePage.css';

export default function CatchPage({changePage}) {

  const [prediction, setPrediction] = useState("");

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
      setPrediction(data);
      console.log(data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  };

  useEffect(() => {
    console.log(localStorage.getItem("imageBase"));
    fetchString(localStorage.getItem("imageBase"));
  }, []);

    //the main return to display the home page or main feed
    return (
      <div>
        <p>Welcome to the Catch Page. Our prediction is...</p>
        {prediction}

        <button onClick={() => {changePage("Test")}}>Go to Test Page</button>
      </div>
    );
  }
  