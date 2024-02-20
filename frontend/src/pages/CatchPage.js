import { useEffect, useState } from 'react';
import './HomePage.css';
import { Buffer } from 'buffer';

export default function CatchPage({changePage, iSource}) {

  const [prediction, setPrediction] = useState([]);


  /*      const binaryData = Buffer.from(
        newValue.slice(22),
        'base64'
      )
      fetch("https://sc-backend.brian2002.com/predict", {
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
          setPredict(data);
          toCatch();
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });*/



  useEffect(() => {
    const fetchData = async () => {
      try {
        const binaryData = Buffer.from(
          iSource.slice(22),
          'base64');

        // Jayvee
        // Fetching data from the provided API endpoint.
        const response =  await fetch(window.location.origin + '/predict', {
          method: 'POST',
          body: binaryData
        });

        // Jayvee
        // Checking if the response is okay, if not, logging a network error and throwing an error.
        if (!response.ok) {
          console.log("network error")
          throw new Error('Failed to fetch data');
        }

        // Jayvee
        // Parsing the response data to JSON format.
        const jsonData = await response.json();

        // Jayvee
        // Updating the 'carData' state with the fetched JSON data.
        setPrediction(jsonData);

      } catch(error){
        // Jayvee
        // Catching any errors that occur during the fetch process and logging them.
          console.error('Error fetching data', error);
      }
    };
    
    // Jayvee
    // Calling the fetchData function when the component mounts.
    fetchData();
    }, [iSource]); // Empty dependency array ensures that this effect runs only once after the initial render.


    //the main return to display the home page or main feed
    return (
      <div>
        <p>Welcome to the Catch Page. Our prediction is...</p>
        {prediction.map((pred, index) => (
            <li className="post" key={index}>
              <div className="cardHeader">
                <p>{pred.name} </p>
                <p>{pred.conf}</p>
              </div>
            </li>
          ))}
        <button onClick={() => {changePage("Test")}}>Go to Test Page</button>
      </div>
    );
  }
  