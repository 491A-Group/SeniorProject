import './HomePage.css';

import Camera from "../images/camera.png";
import Garage from "../images/garage.png";
import Home from "../images/home.png";

import TestPage from './TestPage';


export default function GaragePage({setAppPage}){

      const changePage = () =>
    {
        setAppPage(<TestPage setAppPage={setAppPage}/>)
    }
  return (
    <>
        <button onClick={changePage}>Go to Test Page</button>
      <p>GET and POST test used to be here, now decommissioned. Richard has format</p>
    </>
  )
};