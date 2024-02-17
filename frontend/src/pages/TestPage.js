import React from 'react';


export default function TestPage({changePage}) {

  function logout() {
    fetch(window.location.origin + "/logout", {
      method: 'GET'
    })
    .then (response => {
      if (response.ok) {
          console.log("logout response received ", response)
      } else {
          console.log("logout error")
      }
    })
  }

  return (
    <div>
        <button onClick={() => {changePage("Login")}}>Login Page!</button>
        <button onClick={() => {changePage("Garage")}}>Garage Page!</button>
        <button onClick={() => {changePage("Home")}}>Home Page!</button>
        <button onClick={() => {changePage("Camera")}}>Camera Page!</button>
        <button onClick={logout}>Log Out</button>
    </div>
  );
  
};
