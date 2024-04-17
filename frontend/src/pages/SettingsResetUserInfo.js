import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TestPage from './TestPage';
import './FeatureRequest.css';
import BackButton from '../components/BackButton';

const SettingsResetUserInfo = () => {
    const navigate = useNavigate();

    
    return (
        <>
            <BackButton enableBackButton={true} />
            <div className='container'>
            <h1 classname = "h1">Reset DisplayName/Password</h1>
            </div>
        </>
    );
}    

export default SettingsResetUserInfo;