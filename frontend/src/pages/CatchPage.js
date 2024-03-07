import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Buffer } from 'buffer';

import './CatchPage.css';
import NavBar from '../components/NavBar';
import loading from "../images/loading.gif";

export default function CatchPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [predictions, setPredictions] = useState(null);

    const [predID, setID] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            const binaryData = Buffer.from(
                location.state.image_source.slice(22),
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

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "scroll"
        };
    }, []); // No scroll effect

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
            navigate("/garage");
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            navigate("/garage")
        })
    }

    //the main return to display the home page or main feed
    return (
        <div width="100%">
            <div className="catchpage">
            <h1>Predictions</h1>
            
            { predictions === null? 
                (
                    <h1>Loading   <img src={loading} width="15vw"/></h1>
                ) 
            : 
                (
                    predictions.length < 1? 
                        (
                            <h1>Please take a photo of a car </h1>
                        )
                        :
                        (<div className="container">
                            {   <div>
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
                                    <img src={location.state.image_source} width="80%" height="80%"/>
                                    <h3>{predictions[predID]["description"]}</h3>
                                </div>
                            }
                        </div>
                        )
                    
                )
                        }
            <button className="inc" onClick={() => {navigate("/")}}>Prediction Incorrect?</button>
            
        </div>
        <NavBar/>
        </div>
        
    );
}
  
