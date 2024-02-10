import React from 'react';
import LoginPage from './LoginPage';
import GaragePage from './GaragePage';
import CameraPage from './CameraPage';


export default function TestPage({setAppPage}) {
  const to_login = () => {
    setAppPage(<LoginPage setAppPage={setAppPage}/>)
  }

  const to_garage = () => {
    setAppPage(<GaragePage/>)
  }

  const to_camera = () => {
    setAppPage(<CameraPage/>)
  }

  return (
    <div>
      <button onClick={to_login}>To Login</button>
      <button onClick={to_garage}>To Garage</button>
      <button onClick={to_camera}>To Camera</button>
    </div>
  );
  
};
