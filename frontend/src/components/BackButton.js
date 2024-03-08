import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./BackButton.css"

export default function BackButton({ enableBackButton }){
    const navigate = useNavigate();

    //Forced width for button cause I can't figure out why the FeatureRequestPage.css is overriding it and I'm too lazy to work on it further tonight.
    

    if (enableBackButton) {
        return (
            <button className="backButton" style ={{width: '10%'}} onClick={() => navigate(-1)}>
                 &lt;
            </button>
        );
    } else {
        return null;
    }
};

