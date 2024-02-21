import './HomePage.css';
import React, { useState } from 'react';

export default function SearchPage({changePage}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleChange = (event) => {
      setSearchTerm(event.target.value);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      console.log("search here .. ", searchTerm);
    };

    //the main return to display the home page or main feed
    return (
      <>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search Profiles"
            value={searchTerm}
            onChange={handleChange}
          />
          <button type="submit">Search</button>
        </form>
        <div>

        </div>
      </>
    );
  }
  