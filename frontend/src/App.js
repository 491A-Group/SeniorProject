//All Work is Done by Cameron Weiss, unless stated otherwise

import './App.css';
import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';

import TestPage from './pages/TestPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import GaragePage from './pages/GaragePage';
import CameraPage from './pages/CameraPage';
import CatchPage from './pages/CatchPage';
import SearchPage from './pages/SearchPage';

//cameron
//the overall main app function
// function AppOld() {

//   //cameron
//   //the active page is the variable we use to switch pages. The value is the page the user is viewing
//   //setActivePage changes the variable activaPage via react's useState
//   const [activePage, setActivePage] = useState(null);
//   const [imageSrc, setImageSource] = useState("");


//   //cameron
//   //the navigation function
//   //page = the string of the page you want to go to
//   const  changePage = (page) =>
//     {

//       console.log("PAGE SENT: " + page);

//       //cameron
//       //the overall page navigation logic
//       switch(page)
//       {
//         case "Login":
//           setActivePage(<LoginPage changePage={changePage}/>)
//           break;
        
//         case "Garage":
//           setActivePage(<GaragePage changePage={changePage}/>)
//           break;

//         case "Home":
//           setActivePage(<HomePage changePage={changePage} setActivePage={setActivePage}/>)
//           break;

//         case "Camera":
//           setActivePage(<CameraPage changePage={changePage} setActivePage={setActivePage}/>)
//           break;

//         case "Test":
//           setActivePage(<TestPage changePage={changePage}/>)
//           break;

//         case "Catch":
//           setActivePage(<CatchPage changePage={changePage} iSource={imageSrc}/>)
//           break;

//         case "Search":
//           setActivePage(<SearchPage changePage={changePage}/>)
//           break;

//         default:
//           setActivePage(<TestPage changePage={changePage}/>)
//           break;
//       }
        
//     }
  

//     //cameron
//     //the actual view of the app
//   return (

//     //cameron
//     //the logic of the app. If activePage is null, we create a page. 
//     //This does not set the activePage variable, but no route out of there 
//     //allows for it to NOT be set and still exit the page
//     //this allows full navigation of the site while maintaining the same URL
//     <div className="app">
//       {activePage ? activePage : <TestPage changePage={changePage} />}
//     </div>
//   );
  
// }


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/"> {/* can put an element here https://www.w3schools.com/react/react_router.asp */}
                    <Route index element={<TestPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/garage/:profile?" element={<GaragePage />} />
                    <Route path="/camera" element={<CameraPage />} />
                    <Route path="/catch" element={<CatchPage />} />
                    <Route path="/search" element={<SearchPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);