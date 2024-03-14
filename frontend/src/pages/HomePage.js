// Jayvee wrote most of this file unless denoted otherwise

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import Search from "../images/search.png";
import Filter  from "../images/filter.png";
import NavBar from '../components/NavBar';
import InfiniteScroll from 'react-infinite-scroll-component';


// Jayvee
// Overall Main/Home page
export default function HomePage() {
    const navigate = useNavigate()

    // Jayvee
    // Initializing a state variable 'postData' using useState hook with an empty array as initial state.
    const [postData, setPostData] = useState([]);
    const [page, setPage] = useState(1); // State for tracking current page
    const [hasMore, setHasMore] = useState(true); // State for indicating whether there is more data to fetch


      // Jayvee
      // Async function to fetch data from the specified endpoint.
    const fetchData = async () => {
      try {
        // Jayvee
        // Fetching data from the provided API endpoint.
        const response = await fetch(window.location.origin + '/feed');

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
        // Updating the 'postData' state with the fetched JSON data.
        setPostData(prevData => [...prevData, ...jsonData]);
        setPage(page + 1);
        setHasMore(jsonData.length > 0);

      } catch (error) {
        // Jayvee
        // Catching any errors that occur during the fetch process and logging them.
        console.error('Error fetching data', error);
      };
    
      // Jayvee
      // Calling the fetchData function when the component mounts.
      //fetchData();
    
      //test scrolling
      //const handleScroll = () => {
      //  if (
      //    window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isLoading
      //  ) return;
      //  fetchData();
      //};

      //window.addEventListener('scroll', handleScroll);
      //return () => window.removeEventListener('scroll', handleScroll);
    }
  
    // Jayvee
    // useEffect hook to perform side effects like data fetching when the component mounts.
    useEffect(() => {
      fetchData(); // Fetch initial data on component mount
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
        <InfiniteScroll
            dataLength={postData.length} // Number of items
            next={fetchData} // Function to call when scrolling reaches the bottom
            hasMore={hasMore} // Indicate whether there is more data to fetch
            loader={<h4>Loading...</h4>} // Loading indicator
            endMessage={<p>No more posts</p>} // Message when all data is fetched
        >  
          <ul className="content">
              {postData.map((post, index) => (    
                  <li className="post" key={index}>
                      <div>
                          <p> {post.poster_displayname}</p> {/* Displaying Poster Username */}
                          <img src={window.location.origin + '/pfp/' + post.poster_pfp} alt={post.poster_displayname} /> {/* Displaying Poster's Profile Picture */}
                      </div>
                      <div className="cardHeader">
                         <img src={post.icon} alt={post.name} /> {/* Display Car Brand Icon/Logo */}
                          <h2>
                              {
                                  post.car_make + ' ' +
                                  post.car_model + ' ' +
                                  post.car_start_year + '-' + post.car_end_year
                              }
                          </h2> {/* Display Car's Name (Year/Make/Model) */}
                      </div>

                      <div className="main">
                          <div className="imageContainer">
                              {/*<img src={post.icon} alt={post.name} />*/} {/* Redisplay Car Brand Icon/Logo */}
                              <img src={'data:image/jpg;base64,' + post.post_image} alt={post.car_model} /> {/* Display Car Image */}
                          </div>
                          <div>
                              <p>{post.car_details}</p> {/* Display Car Details */}
                              <p>Likes: {post.post_likes}</p> {/* Display Number of Likes on Post */}
                              <p>{post.post_uuid} {post.post_timestamp} {post.post_location}</p>
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