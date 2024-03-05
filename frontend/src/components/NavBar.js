import "./NavBar.css"

import Garage from "../images/garage.png";
import Home from "../images/home.png";
import Circle from "../images/camera.png";

export default function NavBar({changePage}) {
    return (<div className="navbar">
    <button onClick={() => {changePage("Home")}} className="nbtn"><img width="50%" src={Home}/></button>
    <button onClick={null} className="nrej"><img width="50%" src={Circle}/></button>
    <button onClick={() => {changePage("Garage")}} className="nbtn"><img width="50%" src={Garage}/></button>
</div>)
}