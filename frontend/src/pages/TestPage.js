import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react'; //brian test
//Testpage done by Richard unless noted otherwise

export default function TestPage({showDebugInfo}) {
    const navigate = useNavigate();
    const [location, setLocation] = useState(null);
    const [speed, setSpeed] = useState(null);
    const [isDriving, setIsDriving] = useState(false);

    const [denied, setDenied] = useState(false);

    const convertToFreedomUnits = (speed) => {
        return speed * 2.23694;
    }

    const checkSpeed = (speed) => {
        if (speed > 7) {
            setIsDriving(true);
        }
        else {
            setIsDriving(false);
        }
    };

    useEffect(() => {
        if (isDriving) {
            handleDrivingCheck();
        }
    }, [isDriving]);

    //LOGOUT FUNCTION MOVED TO SETTINGS PAGE


    useEffect(() => {
        const watchUserLocation = () => {
            if (denied){
                return; //stop watching a user's location if they've already denied the pop up
            }
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
    }, [denied]); 

    //alerts if the user is moving too fast and has not denied the prompt
    const handleDrivingCheck = () => {
        if(denied){
            return;
        }
        else{
            setDenied(true);
            window.alert("Are you currently driving? \n\nPlease know that we strongly reccomend that you not utilize the application while driving and that by closing this popup you are accepting responsibility for any consequences that may occur.");
        }
        
      };

    const resetDenied = () => {
        setDenied(false);
    }



    //Richard
    //render buttons that all call the changePage function 
    return (
        <>
            {showDebugInfo && (
                <div className="debug-info">
                    <h1>Debug</h1>
                    {location ? (
                        <div>
                            <p>Latitude: {location.latitude}, Longitude: {location.longitude}</p>
                            {speed && <p>Speed: {speed} mph</p>}
                            <p>Denied: {denied.toString()}</p>
                            <button onClick={resetDenied}>Reset Denied</button>
                        </div>
                    ) : (
                        <p>No GPS information available.</p>
                    )}
                </div>
            )}
        </>
    );
};
