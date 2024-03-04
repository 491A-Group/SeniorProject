import { useEffect, useState } from 'react';
import './HomePage.css';
import { Buffer } from 'buffer';

import loading from "../images/loading.gif";

export default function CatchPage({changePage, iSource}) {

    const [predictions, setPredictions] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const binaryData = Buffer.from(
                iSource.slice(22),
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
                console.log(data)
                setPredictions(data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
        }

        fetchData()
    }, []); // Empty dependency array ensures that this effect runs only once after the initial render.

    function selectPrediction(label) {
        const body = {
            label: label
        }

        fetch(window.location.origin + '/select_prediction', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not OK")
            }
            console.log(response)
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        })
    }

    //the main return to display the home page or main feed
    return (
        <div>
        <h3>Predictions</h3>
        
        { predictions === null ? 
            (
                <p>Loading<img src={loading} width="15vw"/></p>
            ) 
        : 
            (
                <ol>
                    {predictions.map((prediction, index) => (
                        <li key={index}>
                            <button onClick={() => selectPrediction(prediction["label"])}>Select</button>
                            <h5>
                                {
                                    Math.floor(prediction["confidence"]*100) + '% ' +
                                    prediction["make_name"]  + ' ' +
                                    prediction["model_name"] + ' ' +
                                    prediction["year_start"] + '-' + prediction["year_end"]
                                }
                            </h5>
                            <p>{prediction["description"]}</p>
                        </li>
                    ))}
                </ol>
            )
        }

        <button onClick={() => {changePage("Test")}}>Go to Test Page</button>
        </div>
    );
}
  