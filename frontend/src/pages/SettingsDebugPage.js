import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TestPage from './TestPage';
import './FeatureRequest.css';
import BackButton from '../components/BackButton';

const SettingsDebugPage = () => {
    const navigate = useNavigate();

    const [location, setLocation] = useState(null);
    const [speed, setSpeed] = useState(null);
    const [denied, setDenied] = useState(null);

    const resetDenied = () => {
        setDenied(false);
    };

    
    return (
        <>
            <TestPage
                location={location}
                speed={speed}
                denied={denied}
                resetDenied={resetDenied}
            />
            <BackButton enableBackButton={true} />
            <div className="featureRequestPage">
                <div className="container">
                    <h1 className="h1">Debug</h1>
                    {location ? (
                        <div>
                            <p>
                                Latitude: {location.latitude}, Longitude: {location.longitude}
                            </p>
                            {speed && (
                                <p>
                                    Speed: {speed} mph
                                </p>
                            )}
                            <p>
                                Denied: {denied.toString()}
                            </p>
                            <button onClick={resetDenied}>Reset Denied</button>
                        </div>
                    ) : (
                        <p>No GPS information is available.</p>
                    )}
                </div>
            </div>
        </>
    );
}    

export default SettingsDebugPage;