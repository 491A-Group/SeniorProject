
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import RenderUserList from './RenderUserList';

// BRIAN: this component takes a state thats a list of objects. each object is a user with profile picture and displayname
//    this is to be used in at least 3 locations: search, followers, following. it's useful to keep them styled similarly

export default function RelationList() {
    const navigate = useNavigate();
    const location = useLocation();

    const [allUsers, setAllUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filterText, setFilterText] = useState('');
   
    useEffect(() => {
        let target_api = window.location.origin;
        switch (location.state.relations) {
            case 'followers':
                target_api += "/user_function/get_relations/followers"
                break;
            case 'following':
                target_api += "/user_function/get_relations/following"
                break;
            default:
                return
        }
        fetch(target_api, {method: 'GET'})
        .then(response => {return response.json()})
        .then(data => {
            setAllUsers(data)
        })
    }, [])

    useEffect(() => {
        setFilteredUsers(allUsers)
    }, [allUsers])

    const handleFilterChange = (event) => {
        setFilterText(event.target.value);
        console.log(filterText)
    };

    return <>
        <table>
            <tr>
                <button onClick={() => {navigate(-1)}}>back</button>
                <h2>{location.state.owner}</h2>
            </tr>
        </table>
        <input
            type="text"
            value={filterText}
            onChange={handleFilterChange}
            placeholder="TODO filter"
        />
        <RenderUserList users={filteredUsers}></RenderUserList>
    </>
}
