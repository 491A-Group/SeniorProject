import './HomePage.css';
import React, { useState } from 'react';

import Garage from './GaragePage';

export default function SearchPage({changePage, setActivePage}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };
  
    const handleSubmit = (event) => {
        event.preventDefault();
        try {
            fetch(window.location.origin + '/search_users/' + searchTerm)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                //console.log(data);
                setSearchResults(data)
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
        } catch (error) {
            console.error('Error fetching query:', error);
        }
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
                <ul>
                    {searchResults.map((item, index) => (
                        <li key={index}>
                            <button onClick={() => setActivePage(<Garage changePage={changePage} profile={item}/>)}>
                                {item}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
  