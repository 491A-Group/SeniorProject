import { useEffect, useState } from 'react';
import './CatchPage.css';
import { Buffer } from 'buffer';
import NavBar from '../components/NavBar';

import loading from "../images/loading.gif";

export default function CatchPage({changePage, iSource}) {

    const [predictions, setPredictions] = useState(null);

    const [predID, setID] = useState(0);
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

        setPredictions([{"label": "ACUNSX91", "confidence": "0.810218", "make_name": "ACURA", "model_name": "NSX", "year_start": "1991", "year_end": "2001", "description": "This is a car"},
                        {"label": "ACUNSX01", "confidence": "0.700218", "make_name": "ACURA", "model_name": "NSX", "year_start": "2001", "year_end": "2005", "description": "This is a car"},
                        {"label": "ACUNSX16", "confidence": "0.540218", "make_name": "ACURA", "model_name": "NSX", "year_start": "2016", "year_end": "2023", "description": "This is a car"}]);
    }, []); // Empty dependency array ensures that this effect runs only once after the initial render.


    function nextCar() {
        setID((predID + 1) % predictions.length)
    }
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
            console.log(response);

            changePage("Garage");
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            changePage("Garage")
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
                    <div className="container">
                        {<div>
                                <div className="blist">
                                    <button className="btn" onClick={() => selectPrediction(predictions[predID]["label"])}>Select</button>
                                    <button className="rej" onClick={() => nextCar()}>X</button>
                                </div>
                                <h2>
                                    {
                                        Math.floor(predictions[predID]["confidence"]*100) + '% ' +
                                        predictions[predID]["make_name"]  + ' ' +
                                        predictions[predID]["model_name"] + ' ' +
                                        predictions[predID]["year_start"] + '-' + predictions[predID]["year_end"]
                                    }
                                </h2>
                                <img src={iSource}/>
                                <h3>{predictions[predID]["description"]}</h3>
                            </div>
                        }
                    </div>
                )
            }
            <button className="inc" onClick={() => {changePage("Test")}}>Prediction Incorrect?</button>
            <NavBar changePage={changePage}/>
        </div>
    );
}
  
