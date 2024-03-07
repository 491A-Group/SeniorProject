
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import RenderUserList from './RenderUserList';

// BRIAN: this component takes a state thats a list of objects. each object is a user with profile picture and displayname
//    this is to be used in at least 3 locations: search, followers, following. it's useful to keep them styled similarly

export default function RelationList({users, owner}) {
    const [filterText, setFilterText] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(users);

    const handleFilterChange = (event) => {
        setFilterText(event.target.value);
        console.log(filterText)
    };

    useEffect(() => {
        setFilteredUsers(users)
    }, [users])

    return <>
        <table>
            <tr>
                <button>back</button>
                <h2>{owner}</h2>
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
