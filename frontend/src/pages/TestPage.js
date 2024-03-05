import React, { useState } from 'react';
import RenderUserList from '../components/RenderUserList';
//Testpage done by Richard unless noted otherwise

export default function TestPage({changePage}) {
    const [stateForTest, setStateForTest] = useState([
        {displayname: "this is an empty list", pfp_id: 29}
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
        <button onClick={() => {fetch(window.location.origin + "/user_function/get_relations/followers", {method: 'GET'})
                                    .then(response => {return response.json()})
                                    .then(data => {setStateForTest(data)}) }}>followers</button>
        <button onClick={() => {fetch(window.location.origin + "/user_function/get_relations/following", {method: 'GET'})
                                    .then(response => {return response.json()})
                                    .then(data => {setStateForTest(data)}) }}>following</button>
    </div>
  );
  
};
