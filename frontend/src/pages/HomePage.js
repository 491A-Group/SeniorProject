// Jayvee wrote most of this file unless denoted otherwise

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";

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
export default function HomePage() {
    const navigate = useNavigate()

    // Jayvee
    // Initializing a state variable 'carData' using useState hook with an empty array as initial state.
    const [carData, setCardata] = useState([]);
    // State variable to track whether there are more posts to load
    const [hasMore, setHasMore] = useState(true);

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

    // Le Duong
    // test infinite scrolling
    const fetchMoreData = () => {
      // Fetch more data only if there is more to load
      if (hasMore) {
        // Implement the logic to fetch more data here
        // Similar to the fetchData logic in the useEffect hook
        const fetchData = async () => {
          try {
            // Fetching data from the specified endpoint
            const response = await fetch(window.location.origin + '/feed');
  
            // Checking if the response is okay, if not, logging a network error and throwing an error
            if (!response.ok) {
              console.log("network error");
              throw new Error('Failed to fetch data');
            }
  
            // Parsing the response data to JSON format
            const jsonData = await response.json();
  
            // If the fetched data is empty, there are no more posts to load
            if (jsonData.length === 0) {
              console.log("No more data to load");
              setHasMore(false); // Set hasMore to false to stop fetching data
              return;
            }
  
            // Updating the 'carData' state with the fetched JSON data
            setCardata(prevData => [...prevData, ...jsonData]);
          } catch (error) {
            // Catching any errors that occur during the fetch process and logging them
            console.error('Error fetching data', error);
          }
        };
  
        // Call the fetchData function
        fetchData();
      }
    };
    //Jayvee
    //the main return to display the home page or main feed
    return (
      <div className="homeContainer">
        <div>
          <h1 style={{color: 'red'}}>Sportscar Spotter</h1>
        <div className="searchPad">
          <img src={Filter} alt="Filter" />
          <p> Filters:</p>
          
          <button onClick={() => {navigate('/search')}}><img src={Search} alt="Search"/></button>
          </div>
        {/* Implement InfiniteScroll component for infinite scrolling */}
        <InfiniteScroll
          dataLength={carData.length}
          next={fetchMoreData} // Call fetchMoreData function on scroll
          hasMore={hasMore} // Indicates whether there is more data to load
          loader={<h4>Loading...</h4>} // Loader component while fetching data
          endMessage={<p>No more data to load</p>} // Message when all data is loaded
        >
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
        </InfiniteScroll>

        
        <button onClick={() => {navigate("/")}}>Go to Test Page</button>
        </div>
        <NavBar/>
      </div>
      
    );
  }