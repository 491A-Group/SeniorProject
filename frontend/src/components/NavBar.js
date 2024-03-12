import "./NavBar.css"

import { useNavigate } from 'react-router-dom';


import Garage from "../images/garage.png";
import Home from "../images/home.png";
import camera from "../images/camera.png";


//this creates the main navbar component to be found on every page
export default function NavBar({changePage}) {

    //allows navigation of site
    const navigate = useNavigate();

    //the buttons that make up the navbar!
    return (<div className="navbar">
    <button onClick={() => {navigate("/home")}} className="nbtn"><img width="50%" src={Home} alt="Home Page"/></button>
    <button onClick={() => {navigate("/camera")}} className="nrej"><img width="50%" src={camera} alt="Begin Identification"/></button>
    <button onClick={() => {navigate("/garage")}} className="nbtn"><img width="50%" src={Garage} alt="Garage Page"/></button>
</div>)
}