import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TestPage from './TestPage';
import './FeatureRequest.css';
import BackButton from '../components/BackButton';

const DebugInfoContainer = () => {
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
                setLocation={setLocation}
                setSpeed={setSpeed}
                setDenied={setDenied}
            />
            <SettingsDebugPage
                location={location}
                speed={speed}
                denied={denied}
                resetDenied={resetDenied}
            />
            <BackButton enableBackButton={true} />
        </>
    );
};

export default DebugInfoContainer;
