import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react'; //brian test
//Testpage done by Richard unless noted otherwise

export default function TestPage() {
    const navigate = useNavigate();
    const [location, setLocation] = useState(null);
    const [speed, setSpeed] = useState(null);
    const [isDriving, setIsDriving] = useState(false);

    const convertToFreedomUnits = (speed) => {
        return speed * 2.23694;
    }

    const checkSpeed = (speed) => {
        if (speed > 1) {
            setIsDriving(true);
        }
        else {
            setIsDriving(false);
        }
    };

    //Richard
    //handle logout
    function logout() {
        fetch(window.location.origin + "/logout", {
            method: 'GET'
        })
        .then(response => {
            //Richard
            //checks if the response is okay
            if (response.ok) {
            console.log("logout response received ", response)
            } else {
            console.log("logout error")
            }
        })
    }


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
            <button onClick={() => {navigate("/login")}}>Login Page!</button>
            <button onClick={() => {navigate("/garage")}}>Garage Page!</button>
            <button onClick={() => {navigate("/home")}}>Home Page!</button>
            <button onClick={() => {navigate("/camera")}}>Camera Page!</button>
            <button onClick={() => {navigate("/bug-report")}}>Feature Request Page!</button>
            <button onClick={() => {navigate("/settings")}}>Settings Page!</button>
            
            <button onClick={logout}>Log Out</button>
    
            {location && (
                <>
                    <p>Latitude: {location.latitude}</p>
                    <p>Longitude: {location.longitude}</p>
                    <br />
                    <span style={{ color: 'white' }}>Speed: {speed ? speed.toFixed(2) : '0'} mph</span>
                </>
            )}
    
            {isDriving && (
                <div className="popup">
                    <div className="popup-inner">
                        <h2>Are you currently driving?</h2>
                        <p>Please confirm that you are not driving and accept full responsibility for anything that may occur.</p>
                        <button>I Agree</button>
                    </div>
                </div>
            )}
        </div>
    );
}    
