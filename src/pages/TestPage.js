import React from 'react';
import LoginPage from './LoginPage';


export default function TestPage({setAppPage}) {
    const changePage = () =>
    {
        setAppPage(<LoginPage setAppPage={setAppPage}/>)
    }

  return (
    <div>
        <button onClick={changePage}>Click me!</button>
    </div>
  );
  
};