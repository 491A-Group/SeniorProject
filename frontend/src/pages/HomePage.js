// Jayvee wrote most of this file unless denoted otherwise
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import Search from "../images/search.png";
import Filter  from "../images/filter.png";
import SearchPage from './SearchPage';

// Jayvee
// Overall Main/Home page
export default function HomePage() {
    const navigate = useNavigate();

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
    const toTest = () => {
        navigate("/");
    }
  
    //Jayvee
    //the main return to display the home page or main feed
    return (
      <div>
        <div className="searchPad">
          <img src={Filter} alt="Filter"/>
          <p> Filters: Only the coolest cars (Not objective at all)</p>
          <img src={Search} alt="Search"/>
        </div>
        <ul className="content">
          {carData.map((car, index) => (
            <li className="post" key={index}>
              <div>
                <p>Posted by: {car.poster_displayname}</p>
                <img src={car.poster_pfp} alt={car.poster_displayname} />
              </div>
              <div className="cardHeader">
                <img src={car.icon} alt={car.name} />
                <h2>{car.name}</h2>
              </div>
    
              <div className="main">
                <div className="imageContainer">
                  <img src={car.icon} alt={car.name}/> {/* Reuse the same image as header, replace with appropriate image if needed */}
                  <img src={car.image} alt={car.name} /> 
                </div>
                <div>
                  <p>{car.details}</p>
                  <p>Likes: {car.likes}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <button onClick={() => {navigate("/")}}>Go to Test Page</button>
        <button onClick={() => {navigate("/search")}}>Go to Search Page</button>
      </div>
    );
  }