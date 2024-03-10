// Jayvee wrote most of this file unless denoted otherwise

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import Search from "../images/search.png";
import Filter  from "../images/filter.png";
import NavBar from '../components/NavBar';

// Jayvee
// Overall Main/Home page
export default function HomePage() {
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


    //Jayvee
    //the main return to display the home page or main feed
    return (
      <div className="homeContainer">
        <div>
          <h1 style={{color: 'red'}}>Sportscar Spotter</h1> {/* HomePage Title */}
        <div className="searchPad">
          <img src={Filter} alt="Filter" /> {/* Filter icon */}
          <p> Filters:</p>
          
          <button onClick={() => {navigate('/search')}}><img src={Search} alt="Search"/></button> {/* Search Button */}
        </div>
        <ul className="content">
          {carData.map((car, index) => (    
            <li className="post" key={index}>
              <div>
                <p> Posted by: {car.poster_displayname}</p> {/* Displaying Poster Username */}
                <img src={car.poster_pfp} alt={car.poster_displayname} /> {/* Displaying Poster's Profile Picture */}
              </div>
              <div className="cardHeader">
                <img src={car.icon} alt={car.name} /> {/* Display Car Brand Icon/Logo */}
                <h2>{car.name}</h2> {/* Display Car's Name (Year/Make/Model) */}
              </div>
    
              <div className="main">
                <div className="imageContainer">
                  <img src={car.icon} alt={car.name} /> {/* Redisplay Car Brand Icon/Logo */}
                  <img src={car.image} alt={car.name} /> {/* Display Car Image */}
                </div>
                <div>
                  <p>{car.details}</p> {/* Display Car Details */}
                  <p>Likes: {car.likes}</p> {/* Display Number of Likes on Post */}
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