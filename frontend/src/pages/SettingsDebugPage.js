import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TestPage from './TestPage';
import './FeatureRequest.css';
import BackButton from '../components/BackButton';

const SettingsDebugPage = () => {
    const navigate = useNavigate();


    
    return (
        <>
            <BackButton enableBackButton={true} />
            <TestPage showDebugInfo = {true}/>
        </>
    );
}    

export default SettingsDebugPage;
