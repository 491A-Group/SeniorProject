import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react'; //brian test
//Testpage done by Richard unless noted otherwise

export default function TestPage() {
    const navigate = useNavigate();
    const [location, setLocation] = useState(null);
    const [speed, setSpeed] = useState(null);
    const [isDriving, setIsDriving] = useState(false);

    const [denied, setDenied] = useState(0);

    const convertToFreedomUnits = (speed) => {
        return speed * 2.23694;
    }

    const checkSpeed = (speed) => {
        if (speed > 1) {
            setIsDriving(true);
            if (denied < 2) {
                setDenied(1);
            }
        }
        else {
            setIsDriving(false);
        }
    };

    //LOGOUT FUNCTION MOVED TO SETTINGS PAGE


    useEffect(() => {
        const watchUserLocation = () => {
            const options = {
                enableHighAccuracy: true,
                timeout: 1000, //How often we're checking their speed (1 second)
                maximumAge: 0
            };

            const success = (position) =>{
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                const speedFreedomUnits = convertToFreedomUnits(position.coords.speed);
                setSpeed(speedFreedomUnits);
                checkSpeed(speedFreedomUnits);
            };

            const error = (err) => {
                console.error('Error obtaining geolocation: ', err);
            };

            const id = navigator.geolocation.watchPosition(success, error, options);

            return () => navigator.geolocation.clearWatch(id);
        };
        
        watchUserLocation();
    }, []); 




    //Richard
    //render buttons that all call the changePage function 
    return (
        <div>

            {denied}
            
            {denied == 1 && ( (
                <div className="popup">
                    <div className="popup-inner">
                        <h2>Are you currently driving?</h2>
                        <p>Please confirm that you are not driving and accept full responsibility for anything that may occur.</p>
                        <button onClick={() => {setDenied(2)}}>I Agree</button>
                    </div>
                </div>
            ))}
        </div>
    );
}    
