import "./NavBar.css"

import { useNavigate } from 'react-router-dom';


import Garage from "../images/garage.png";
import Home from "../images/home.png";
import camera from "../images/camera.png";

export default function NavBar({changePage}) {

    const navigate = useNavigate();

    
    return (<div className="navbar">
    <button onClick={() => {navigate("/home")}} className="nbtn"><img width="50%" src={Home}/></button>
    <button onClick={() => {navigate("/camera")}} className="nrej"><img width="50%" src={camera}/></button>
    <button onClick={() => {navigate("/garage")}} className="nbtn"><img width="50%" src={Garage}/></button>
</div>)
}