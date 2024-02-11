import React from 'react';


export default function TestPage({changePage}) {

  return (
    <div>
        <h1>test correct ! ! ! pls flask 🙏🙏🙏</h1>
        <button onClick={changePage("Login")}>Login Page!</button>
        <button onClick={changePage("Garage")}>Garage Page!</button>
        <button onClick={changePage("Home")}>Home Page!</button>
    </div>
  );
  
};
