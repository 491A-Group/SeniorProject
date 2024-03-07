import React, { useEffect, useState } from 'react';
import RenderUserList from '../components/RenderUserList';
import { useNavigate } from 'react-router-dom';
import RelationList from '../components/RelationList';
//Testpage done by Richard unless noted otherwise

export default function TestPage() {
    const navigate = useNavigate();
  
    //Richard
  //handle logout
  function logout() {
    fetch(window.location.origin + "/logout", {
      method: 'GET'
    })
    .then(response => {
      //Richard
      //checks if the response is okay
      if (response.ok) {
          console.log("logout response received ", response)
      } else {
          console.log("logout error")
      }
    })
  }

  //Richard
  //render buttons that all call the changePage function 
  return (
    <div>
        <button onClick={() => {navigate("/login")}}>Login Page!</button>
        <button onClick={() => {navigate("/garage")}}>Garage Page!</button>
        <button onClick={() => {navigate("/home")}}>Home Page!</button>
        <button onClick={() => {navigate("/camera")}}>Camera Page!</button>
        <button onClick={logout}>Log Out</button>
        
    </div>
  );
  
};
