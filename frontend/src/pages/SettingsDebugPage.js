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
            <div className='container'>
            <TestPage showDebugInfo = {true}/>
            </div>
        </>
    );
}    

export default SettingsDebugPage;
