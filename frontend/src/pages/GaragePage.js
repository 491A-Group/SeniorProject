import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import './HomePage.css';
import './GaragePage.css';
// import AcuraLogo from "..images/CarLogos/AcuraLogo.png"; find new Acura logo cause this broken
import ProfilePic from '../images/DefaultProfilePicture.png';

//This function handles all garage pages, a user viewing their own or anyone else's page
export default function Garage() {
    const navigate = useNavigate();
    const {profile} = useParams();

    // If profile is undefined, view your own page
    // Otherwise, profile should be a valid displayname to view
    const is_self = profile === undefined;
    const [followers, setFollowers] = useState(-1)
    const [following, setFollowing] = useState(-1)
    const [catches, setCatches] = useState(-1)
    const [followStatus, setFollowStatus] = useState('')
    const [displayname, setDisplayname] = useState('')
    const [pfpId, setPfpId] = useState(1)

    //Brian helped work on this function to fetch data from the database
    const fetchData = async () => {
        try {
            const query_destination = window.location.origin + '/garage' + (is_self ? '' : '/' + profile)
            //console.log("about to get @: ", query_destination)
            const response = await fetch(query_destination);
            if (!response.ok) {
                console.log("network error")
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.json();
            
            //The following 5 lines put the data from the Fetch response into React states
            setFollowers(jsonData["followers"])
            setFollowing(jsonData["following"])
            setFollowStatus(jsonData["follow_status"])
            setCatches(jsonData["catches"])
            setDisplayname(jsonData["displayname"])
            setPfpId(jsonData["pfp_id"])
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        //GET INFORMATION ON THE PAGE WHEN THE PAGE LOADS
        //This functions dependencies is [] so it only runs when this module is loaded
        //console.log(is_self, profile, profile===null)
        fetchData();
    }, []);

    function renderFollowButton(status) {
        switch(status) {
            case "following":
                return <div>
                    <button onClick={() => {unfollow()}}>
                        Unfollow
                    </button>
                </div>
            case "stranger":
                return <div>
                    <button onClick={() => {follow()}}>
                        Follow
                    </button>
                </div>
        }
    }

    async function follow() {
        try {
            const query_destination = window.location.origin + '/user_function/follow/' + profile
            console.log("about to post @: ", query_destination)
            const response = await fetch(query_destination, {method: 'POST'});
            if (!response.ok) {
                console.log("network error")
                throw new Error('Network response was not ok');
            }

            fetchData()
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    async function unfollow() {
        try {
            const query_destination = window.location.origin + '/user_function/unfollow/' + profile
            console.log("about to post @: ", query_destination)
            const response = await fetch(query_destination, {method: 'POST'});
            if (!response.ok) {
                console.log("network error")
                throw new Error('Network response was not ok');
            }

            fetchData()
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    return (
        <div className="garageContainer">
            <div className="userInfo">
                <div className="userProfile">
                    <img src={window.location.origin + '/pfp/' + pfpId} />
                    <div className="displayname">{displayname}</div>
                </div>
                <div className="userStats">
                    <div className="userStatsItem">
                        <div>Followers</div>
                        <div>{followers}</div>
                    </div>
                    <div className="userStatsItem">
                        <div>Following</div>
                        <div>{following}</div>
                    </div>
                    <div className="userStatsItem">
                        <div>Catches</div>
                        <div>{catches}</div>
                    </div>
                </div>
            </div>

            {renderFollowButton(followStatus)}

            <div className="carViewOptions">
                <button>Grid View</button>
                <button>List View</button>
            </div>
            <div className="carGrid">
                {/* Car brand logos will be rendered here */}
                {/* <div className="carItem">
                    <img src = {AcuraLogo}/> Find new Acura Logo, cause this shit is brocken
                </div> */}
                <div className="carItem">
                    <img src={window.location.origin + "/pfp/50"}/>
                </div>
                <div className="carItem">
                    <img src={window.location.origin + "/pfp/2"}/>
                </div>
                <div className="carItem">
                    <img src={window.location.origin + "/pfp/3"}/>
                </div>
                <div className="carItem">
                    <img src={window.location.origin + "/pfp/4"}/>
                </div>
                <div className="carItem">
                    <img src={window.location.origin + "/pfp/5"}/>
                </div>
                <div className="carItem">
                    <img src={window.location.origin + "/pfp/6"}/>
                </div>
                <div className="carItem">
                    <img src={window.location.origin + "/pfp/70"}/>
                </div>
                <div className="carItem">
                    <img src={window.location.origin + "/pfp/28"}/>
                </div>
                <div className="carItem">
                    <img src={window.location.origin + "/pfp/30"}/>
                </div>
                {/* Add more car items as needed */}
            </div>
            {/* Or, for list view */}
            {/* <ul className="carList">
                <li>Car Brand 1</li>
                <li>Car Brand 2</li>
                <li>Car Brand 3</li>
                // Add more list items as needed
            </ul> */}

            <button onClick={() => {navigate('/');}}>Go to Test Page</button>
        </div>
    );
}
