import React from 'react';
import './BackButton.css';

const UpButton = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button className="upButton" onClick={scrollToTop}>
            &uarr;
        </button>
    );
}

export default UpButton;
