import { useNavigate, useLocation } from 'react-router-dom';
import "./NavBar.css";

import Garage from "../images/garage.png";
import Home from "../images/home.png";
import camera from "../images/camera.png";
import search from "../images/search.png";

export default function NavBar() {
    const location = useLocation(); // State to track current page
    const navigate = useNavigate();

    // Function to handle navigation and update current page
    const handleNavigation = (path) => {
        navigate(path); // Navigate to the selected page
    };

    
    

    return (
        <div className="navbar">
            <button onClick={() => handleNavigation("/home")} className={`nbtn ${location.pathname === "/home" ? "active" : ""}`}>
                <img width="50%" src={Home} alt="Home Page"/>
            </button>
            <button onClick={() => handleNavigation("/search")} className={`nrej ${location.pathname === "/search" ? "active" : ""}`}>
                <img width="50%" src={search} alt="Search Page"/>
            </button>
            <button onClick={() => handleNavigation("/camera")} className={`nbtn ${location.pathname === "/camera" ? "active" : ""}`}>
                <img width="50%" src={camera} alt="Begin Identification"/>
            </button>
            <button onClick={() => handleNavigation("/garage")} className={`nrej ${location.pathname === "/garage" ? "active" : ""}`}>
                <img width="50%" src={Garage} alt="Garage Page"/>
            </button>
        </div>
    );
}
