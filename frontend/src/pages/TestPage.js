import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react'; //brian test
//Testpage done by Richard unless noted otherwise

export default function TestPage() {
    const navigate = useNavigate();
    const [location, setLocation] = useState(null);
    const [speed, setSpeed] = useState(null);

    const convertToFreedomUnits = (speed) => {
        return speed * 2.23694;
    }

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
                setSpeed(convertToFreedomUnits(position.coords.speed));
                checkDrivingSpeed(speed);
            };

            const error = (err) => {
                console.error('Error obtaining geolocation: ', err);
            };

            const id = navigator.geolocation.watchPosition(success, error, options);

            return () => navigator.geolocation.clearWatch(id);
        };
        
        watchUserLocation();
    }, []); 

    const checkDrivingSpeed = (speed) => {
        if (speed > 1) {
            if (window.confirm('Are you currently driving? Please confirm that you are a passenger.')) {
                console.log("User confirmed that they are a passenger")
            }
            else {
                console.log("User said no for some reason.")
            }
        }
    };

    //Richard
    //render buttons that all call the changePage function 
    return (
        <div>
            <button onClick={() => {navigate("/login")}}>Login Page!</button>
            <button onClick={() => {navigate("/garage")}}>Garage Page!</button>
            <button onClick={() => {navigate("/home")}}>Home Page!</button>
            <button onClick={() => {navigate("/camera")}}>Camera Page!</button>
            <button onClick={() => {navigate("/bug-report")}}>Feature Request Page!</button>
            <button onClick={logout}>Log Out</button>

            {location && (
                <>
                <p>Latitude: {location.latitude}</p>
                <p>longitude: {location.longitude}</p>
                <br />
                <span style = {{color: 'white'}}>Speed: {speed ? speed.toFixed(2) : '0'} mph</span>
                
                
                </>
                

            )}


        </div>
    );

};
