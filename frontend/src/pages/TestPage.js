import React from 'react';


export default function TestPage({changePage}) {

  return (
    <div>
        <button onClick={changePage("Login")}>Login Page!</button>
        <button onClick={changePage("Garage")}>Garage Page!</button>
        <button onClick={changePage("Home")}>Home Page!</button>
        <button onClick={changePage("Camera")}>Camera Page!</button>
    </div>
  );
  
};
