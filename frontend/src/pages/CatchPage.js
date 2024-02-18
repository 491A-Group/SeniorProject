import {useState} from 'react';
import { Buffer } from 'buffer';
import './HomePage.css';


const CatchPage = (props) =>{

  const [prediction, setPrediction] = useState("");

  const fetchString = () => {
    // const binaryData = Buffer.from(
    //   base64String.slice(22), // Drop the first characters
    //   'base64'
    // );
    
    // // Create a Blob object from the binary data
    // const blobData = new Blob([binaryData]);
    
    // // Create a FormData object and append the Blob data to it
    // const formData = new FormData();
    // formData.append('file', blobData, 'filename.jpg'); // 'file' is the name of the form field
    
    // Send the POST request with the FormData object

    fetch('https://sc-backend.brian2002.com/predict', {
      method: 'POST',
      body: source
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

    //the main return to display the home page or main feed
    return (
      <div>
        <p>Welcome to the Catch Page. Our prediction is...</p>
        {props.source}
        <img src={source} alt="The photo" />
        {prediction}
        <button onClick={fetchString}>Confirm Photo</button>
        <button onClick={() => {props.changePage("Test")}}>Go to Test Page</button>
      </div>
    );
  }

  export default CatchPage;
  