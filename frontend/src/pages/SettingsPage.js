import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FeatureRequest.css';
import BackButton from '../components/BackButton';

const SettingsPage = () => {
    const navigate = useNavigate();

    function logout() {
        fetch(window.location.origin + "/logout", {
            method: 'GET'
        })
        .then(response => {
            //Richard
            //checks if the response is okay
            if (response.ok) {
            console.log("logout response received ", response)
            navigate('/login');
            } else {
            console.log("logout error")
            }
        })
    }

    return (
        <>
        <BackButton enableBackButton={true} /><div className="featureRequestPage">
            <div className="container">
                <h1 className="h1">Settings</h1>
                <button onClick={() => {navigate('/bug-report');}}>Feature Request/Bug Reporting</button>
                <button>todo Change Profile Picture</button>
                <button onClick={logout}>Logout</button>
            </div>
        </div></>
    );
}

export default SettingsPage;
