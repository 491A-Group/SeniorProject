import React, { useEffect, useState } from 'react';
import './HomePage.css';
import RenderUserList from '../components/RenderUserList';
import NavBar from '../components/NavBar';

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        document.body.style.overflowX = 'hidden';
    }, []);

    const handleChange = (event) => {
        const newSearchTerm = event.target.value;
        setSearchTerm(newSearchTerm);
        //console.log(newSearchTerm.length, 'newSearchTerm', newSearchTerm)
        if (newSearchTerm.length === 0) {
            setSearchResults([])
            return
        }
        try {
            fetch(window.location.origin + '/search_users/' + newSearchTerm)
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
            <form onSubmit={e => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Search Profiles"
                  value={searchTerm}
                  onChange={handleChange}
                  style={{width: '98%'}}
                />
            </form>
            <RenderUserList users={searchResults}></RenderUserList>
            <NavBar />
        </>
    );
}
  