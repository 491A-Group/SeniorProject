
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import RenderUserList from './RenderUserList';
import BackButton from './BackButton';

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
                target_api += "/user_function/get_relations/followers/" + location.state.owner
                break;
            case 'following':
                target_api += "/user_function/get_relations/following/" + location.state.owner
                break;
            default:
                return
        }
        
        //console.log(target_api)

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
        const searchText = event.target.value.toLowerCase();
        setFilterText(searchText);
        const filtered = allUsers.filter(user => user.displayname.toLowerCase().includes(searchText));
        setFilteredUsers(filtered)
    };

    return <>
    <BackButton enableBackButton={true}/>
        <table>
            <tr>
                <h2>{location.state.owner}</h2>
            </tr>
        </table>
        <input
            type="text"
            value={filterText}
            onChange={handleFilterChange}
            placeholder="Displayname"
        />
        <RenderUserList users={filteredUsers}></RenderUserList>
    </>
}
