import { useNavigate, useLocation } from 'react-router-dom';
import "./NavBar.css";

import GarageBlue from "../images/garageBlue.png";
import HomeBlue from "../images/homeBlue.png";
import CameraBlue from "../images/cameraBlue.png";
import SearchBlue from "../images/searchBlue.png";
import PuzzleBlue from "../images/puzzleBlue.png";
import GarageOrange from "../images/garageOrange.png";
import HomeOrange from "../images/homeOrange.png";
import CameraOrange from "../images/cameraOrange.png";
import SearchOrange from "../images/searchOrange.png";
import PuzzleOrange from "../images/puzzleOrange.png";

export default function NavBar() {
    const location = useLocation(); // State to track current page
    const navigate = useNavigate();

    // Function to handle navigation and update current page
    const handleNavigation = (path) => {
        navigate(path); // Navigate to the selected page
    };

    // Object to map page paths to corresponding blue and orange icons
    const buttonIcons = {
        "/home": { blue: HomeBlue, orange: HomeOrange },
        "/search": { blue: SearchBlue, orange: SearchOrange },
        "/camera": { blue: CameraBlue, orange: CameraOrange },
        "/daily": { blue: PuzzleBlue, orange: PuzzleOrange },
        "/garage": { blue: GarageBlue, orange: GarageOrange }
    };

    // Function to determine which icon to use based on the active state
    const getIcon = (path) => {
        const isActive = location.pathname === path;
        return isActive ? buttonIcons[path].orange : buttonIcons[path].blue;
    };

    return (
        <div className="navbar">
            {Object.keys(buttonIcons).map(path => (
                <button 
                    key={path}
                    onClick={() => handleNavigation(path)} 
                    className={`nbtn ${location.pathname === path ? "active" : ""}`}
                >
                    <img 
                        width="60%" 
                        src={getIcon(path)} 
                        alt={path.substring(1)} 
                        style={path === '/search' ? { maxWidth: '30px' } : null} // Conditional styling for the search button
                    />
                </button>
            ))}
        </div>
    );
}
