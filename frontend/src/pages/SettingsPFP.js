import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TestPage from './TestPage';
import './FeatureRequest.css';
import BackButton from '../components/BackButton';

const SettingsPFP = () => {
    const navigate = useNavigate();

    
    return (
        <>
            <BackButton enableBackButton={true} />
            <div className="container">
                <h1 classname = "h1">Change Profile Picture</h1>
            </div>
        </>
    );
}    

export default SettingsPFP;
