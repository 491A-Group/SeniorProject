// Jayvee wrote most of this file unless denoted otherwise

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './HomePage.css';
import Search from "../images/search.png";
import Filter  from "../images/filter.png";
// import CarData from "./CarData.json";
// import Ferrari from "../images/ferrari.png";
// import Testa from "../images/testa_rossa.jpeg";
// import Ford from "../images/ford.png";
// import FordGT from "../images/ford-gt40.jpg";
// import Porsche from "../images/porsche-_car.jpg";
// import PorLogo from "../images/porsche.png";

import NavBar from '../components/NavBar';

// Jayvee
// Overall Main/Home page
export default function HomePage({changePage}) {
    const navigate = useNavigate()

    // Jayvee
    // Initializing a state variable 'carData' using useState hook with an empty array as initial state.
    const [carData, setCardata] = useState([]);

    // Jayvee
    // useEffect hook to perform side effects like data fetching when the component mounts.
    useEffect(() => {

      // Jayvee
      // Async function to fetch data from the specified endpoint.
      const fetchData = async () => {
        try {

         // Jayvee
         // Fetching data from the provided API endpoint.
         const response =  await fetch(window.location.origin + '/api/home_1');

         // Jayvee
         // Checking if the response is okay, if not, logging a network error and throwing an error.
          if (!response.ok) {
            console.log("network error")
            throw new Error('Failed to fetch data');
          }

          // Jayvee
          // Parsing the response data to JSON format.
          const jsonData = await response.json();

          // Jayvee
          // Updating the 'carData' state with the fetched JSON data.
          setCardata(jsonData);

        } catch(error){
          // Jayvee
          // Catching any errors that occur during the fetch process and logging them.
            console.error('Error fetching data', error);
        }
      };
     
      // Jayvee
      // Calling the fetchData function when the component mounts.
      fetchData();
    }, []); // Empty dependency array ensures that this effect runs only once after the initial render.

    // Cameron
    // Function to navigate to the 'Test' page when called.

    //Jayvee
    //the main return to display the home page or main feed
    return (
      <div>
        <div>
        <div className="searchPad">
          <img src={Filter} alt="Filter" />
          <p> Filters:</p>
          
          <button onClick={() => {navigate('/search')}}><img src={Search} alt="Search"/></button>
        </div>
        <ul className="content">
          {carData.map((car, index) => (
            <li className="post" key={index}>
              <div className="cardHeader">
                <img src={car.icon} alt={car.name} />
                <h2>{car.name}</h2>
              </div>
    
              <div className="main">
                <img src={car.icon} alt={car.name} /> {/* Reuse the same image as header, replace with appropriate image if needed */}
                <div>
                  <p>{car.details}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        
        <button onClick={() => {navigate("/")}}>Go to Test Page</button>
      </div>
      <NavBar/>
      </div>
      
    );
  }