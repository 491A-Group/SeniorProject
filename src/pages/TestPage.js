import React from 'react';
import CameraPage from './CameraPage';
import GaragePage from './GaragePage';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import GaragePage from './GaragePage';
import CameraPage from './CameraPage';


export default function TestPage({setAppPage}) {
    const changePage = (page) => () =>
    {
      setAppPage(<LoginPage setAppPage={setAppPage}/>)
      switch(page)
      {
        case 1:
          setAppPage(<LoginPage setAppPage={setAppPage}/>)
          break;
        
        case 2:
          setAppPage(<GaragePage setAppPage={setAppPage}/>)
          break;

        case 3:
          setAppPage(<HomePage setAppPage={setAppPage}/>)
          break;

        case 4:
          setAppPage(<CameraPage setAppPage={setAppPage}/>)
          break;
      }
        
    }

  return (
    <div>
        <button onClick={changePage(1)}>Login Page!</button>
        <button onClick={changePage(2)}>Garage Page!</button>
        <button onClick={changePage(3)}>Home Page!</button>
        <button onClick={changePage(4)}>Garage Page!</button>
    </div>
  );
  
};
