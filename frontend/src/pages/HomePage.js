// Jayvee wrote most of this file unless denoted otherwise

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import Search from "../images/search.png";
import Filter  from "../images/filter.png";
import NavBar from '../components/NavBar';
import Post from '../components/Post';
import UpButton from '../components/UpButton';
import heart from '../images/heart.png';
import TestPage from './TestPage';
import Logo from '../images/genericLogo.png';
//Le Duong, installed react infinite scroll dependency in frontend node_modules folder, might need to install locally
import InfiniteScroll from 'react-infinite-scroll-component';



// Jayvee
// Overall Main/Home page
export default function HomePage() {
    const navigate = useNavigate()

    // Jayvee
    // Initializing a state variable 'postData' using useState hook with an empty array as initial state.
    const [postData, setPostData] = useState([])
    const [postsData, setPostsData] = useState()
    // this below version is about appropriate for debug
    // const [postData, setPostData] = useState([
    //     {
    //         poster_displayname: "?displayname",
    //         poster_pfp: 1,
    //         post_image: "",
    //         car_model: "?model",
    //         car_make: "?make",
    //         car_details: "?details",
    //         car_start_year: "?0",
    //         car_end_year: "?1970",
    //         post_uuid: "?uuid",
    //         post_timestamp: Date(),
    //         post_likes: -1,
    //         post_location: ["State", "County", "Place"]
    //     }
    // ]);
    //Le Duong
    const [page, setPage] = useState(1); // State for tracking current page
    const [hasMore, setHasMore] = useState(true); // State for indicating whether there is more data to fetch


    // Filter state variables
    const [modelFilter, setModelFilter] = useState("");
    const[makeFilter, setMakeFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const[locationFilter, setLocationFilter] = useState("");
    
      // Jayvee
      // Async function to fetch data from the specified endpoint.
    const fetchData = async () => {
      try {
        // Filtering parameters
        // let apiUrl = window.location.origin + '/feed';
        // apiUrl += '?model=${modelFilter}&make=${makeFilter}&year=${yearFilter}&location=${locationFilter}';

        // Jayvee
        // Fetching data from the provided API endpoint.
        // const response = await fetch(apiUrl);
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
        setPostsData(jsonData)

        for (const element of jsonData) {
            element.post_timestamp = new Date(element.post_timestamp)
        }

        // Jayvee, Edited by Le Duong
        // Updating the 'postData' state with the fetched JSON data.
        setPostData(prevData => [...prevData, ...jsonData]); //concatenantes prevData with new data (jsonData)
        setPage(page + 1); //increments page to load new set of posts when scrolling
        setHasMore(jsonData.length > 0); //checks if there is more posts to fetch and populate on main feed
        //otherwise, hasMore will be set to false meaning no new posts can be fetched
      } catch (error) {
        // Jayvee
        // Catching any errors that occur during the fetch process and logging them.
        console.error('Error fetching data', error);
      };
    
    }
 
    // Handle model filter change
    const handleModelFilterChange = (event) => {
      setModelFilter(event.target.value);
    }

    // Handle make filter change
    const handleMakeFilterChange = (event) => {
      setMakeFilter(event.target.value);
    }

    // Handle year filter change
    const handleYearFilterChange = (event) => {
      setYearFilter(event.target.value);
    }

    // Handle location filter change
    const handleLocationFilterChange = (event) => {
      setLocationFilter(event.target.value);
    }

  const renderUpButton = () => {
    if (postsData && postsData.length > 0) {
        return <UpButton />;
    }
  };

    // Applying filters
    const filteredPosts = postData.filter(post => {
      return (
        (modelFilter === "" || post.car_model === modelFilter) &&
        (makeFilter === "" || post.car_make === makeFilter) &&
        (yearFilter === "" || (post.car_start_year <= yearFilter && post.car_end_year >= yearFilter)) &&
        (locationFilter === "" || post.post_location.includes(locationFilter))
      );
    });
    // Jayvee
    // useEffect hook to perform side effects like data fetching when the component mounts.
    useEffect(() => {
      setPostsData([]) // just clear the feed until new data is loaded. probably tinker with this
      fetchData(); // Fetch initial data on component mount
    }, []); // Empty dependency array ensures that this effect runs only once after the initial render.


    //Jayvee
    //the main return to display the home page or main feed
    return (
      <div className="homeContainer">
        <TestPage setDebugInfo = {false}/>
        <div>
          {/* <img src={Logo} alt="Logo" style={{ marginRight: '10px'}} /> */}
          <h1 style={{color: 'red'}}>Sportscar Spotter</h1> {/* HomePage Title */}
        <div className="searchPad">
          <img src={Filter} alt="Filter" /> {/* Filter icon */}
          <p> Filters:</p>
         
          <button onClick={() => {navigate('/search')}}><img src={Search} alt="Search"/></button> {/* Search Button */}
        </div>
        <InfiniteScroll
            //Le Duong
            dataLength={postData.length} // Number of items
            next={fetchData} // Function to call when scrolling reaches the bottom
            hasMore={hasMore} // Indicate whether there is more data to fetch
            loader={<h4>Loading...</h4>} // Loading indicator
            endMessage={<p>No more posts</p>} // Message when all data is fetched
        >  
            <ul className="content">
                {postData.map((post, index) => (    
                        <Post key={index} post={post} /> // Render the Post component for each post
                ))}
            </ul>
        </InfiniteScroll> 
        </div>
        {renderUpButton()}
        <NavBar/>
      </div>
      
    );
  }