import './CameraPage.css';
import React from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";

export default function LoginPage(){

    return(

        <div className="bg">
            <img src=""/>
            
            <Link to="/home">
                <button  className="signin" onClick={null}>Sign In</button>
            </Link>
            <button className="register" onClick={null}>Create Account</button>

        </div>
    )
};