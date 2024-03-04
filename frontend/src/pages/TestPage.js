import React, { useState } from 'react';
import RenderUserList from '../components/RenderUserList';
//Testpage done by Richard unless noted otherwise

export default function TestPage({changePage}) {
    const [stateForTest, setStateForTest] = useState([
        {displayname: "peter_g", pfp_id: 58},
        {displayname: "john_cena", pfp_id: 26},
    ]);
  
  
    //Richard
  //handle logout
  function logout() {
    fetch(window.location.origin + "/logout", {
      method: 'GET'
    })
    .then (response => {
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
        <button onClick={() => {changePage("Login")}}>Login Page!</button>
        <button onClick={() => {changePage("Garage")}}>Garage Page!</button>
        <button onClick={() => {changePage("Home")}}>Home Page!</button>
        <button onClick={() => {changePage("Camera")}}>Camera Page!</button>
        <button onClick={logout}>Log Out</button>


        <p>brian test; safe to delete</p>
        <RenderUserList users={stateForTest}></RenderUserList>
    </div>
  );
  
};
