import { useEffect, useState } from 'react';
import './CatchPage.css';
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
        <div className="catchpage">
            <h1>Predictions</h1>
            
            { predictions === null ? 
                (
                    <h1>Loading   <img src={loading} width="15vw"/></h1>
                ) 
            : 
                (
                    <ol className="container">
                        {predictions.map((prediction, index) => (
                            <li key={index}>
                                <button className="btn" onClick={() => selectPrediction(prediction["label"])}>Select</button>
                                <h2>
                                    {
                                        Math.floor(prediction["confidence"]*100) + '% ' +
                                        prediction["make_name"]  + ' ' +
                                        prediction["model_name"] + ' ' +
                                        prediction["year_start"] + '-' + prediction["year_end"]
                                    }
                                </h2>
                                <img src={iSource}/>
                                <h3>{prediction["description"]}</h3>
                            </li>
                        ))}
                    </ol>
                )
            }

            <button className="btn" onClick={() => {changePage("Test")}}>Go to Test Page</button>
        </div>
    );
}
  
