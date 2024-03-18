import React, { useState, useEffect } from 'react';
import './BackButton.css';

const UpButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Check if the user has scrolled past a certain point (e.g., 100 pixels)
            const scrollPosition = window.scrollY;
            if (scrollPosition > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Attach event listener for scroll
        window.addEventListener('scroll', handleScroll);

        // Clean up by removing the event listener when component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button className={`upButton ${isVisible ? 'visible' : 'hidden'}`} onClick={scrollToTop}>
            &uarr;
        </button>
    );
}

export default UpButton;
