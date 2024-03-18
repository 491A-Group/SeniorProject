import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import './HomePage.css';
import './GaragePage.css';

import NavBar from '../components/NavBar';
import BackButton from '../components/BackButton';
import UpButton from '../components/UpButton';
import Post from '../components/Post';
import InfiniteScroll from 'react-infinite-scroll-component';

//This function handles all garage pages, a user viewing their own or anyone else's page
export default function Garage() {
    const navigate = useNavigate();
    const location = useLocation();
    const {profile} = useParams();
    //console.log('garage page loaded for profile:', profile)

    // If profile is undefined, view your own page
    // Otherwise, profile should be a valid displayname to view
    const is_self = profile === undefined;
    const [followers, setFollowers] = useState(-1)
    const [following, setFollowing] = useState(-1)
    const [catches, setCatches] = useState(-1)
    const [followStatus, setFollowStatus] = useState('')
    const [displayname, setDisplayname] = useState('')
    const [pfpId, setPfpId] = useState(1)

    // -2 for manufacturerList
    // -1 for list
    // positive integer for manufacturer ID
    const [viewState, setViewState] = useState(-2)
    const [gridButtonColor, setGridButtonColor] = useState("#983517");
    const [listButtonColor, setListButtonColor] = useState("#FF521B");
    const [manufacturerList, setManufacturerList] = useState([{id: 96, name: "", count: "",}])
    const [postsData, setPostsData] = useState()

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
            //console.log(jsonData)
            
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

    const fetchManufacturerList = async () => {
        try {
            let request_header = new Headers();
            request_header.append('Type', 'MAKE')
            const query_destination = window.location.origin + '/garage_feed' + (is_self ? '' : '/' + profile)
            //console.log("about to get @: ", query_destination)
            const response = await fetch(
                query_destination,
                {
                    headers: request_header
                }
            );
            if (!response.ok) {
                console.log("network error for manufacturer list")
                throw new Error('Network response was not ok');
            }
            const jsonData = await response.json();
            //console.log(jsonData)
            setManufacturerList(jsonData)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        // updates feeds since they share the posts data state
        //      since the manufacturer list has its own state it isn't included here.
        //      you can change this however is cleanest to program/whatever you see fit.
        //      i just decided to do it like this since im clueless about frontend
        //      however the manufacturerList should be a comparatively small amount of data
        setPostsData([]) // just clear the feed until new data is loaded. probably tinker with this
        
        const query_destination = window.location.origin + '/garage_feed' + (is_self ? '' : '/' + profile)
        let request_header = new Headers();
        
        const fetch_feed = async () => {
            try {
                //console.log("about to get @: ", query_destination)
                const response = await fetch(
                    query_destination,
                    {
                        headers: request_header
                    }
                );
                if (!response.ok) {
                    console.log("network error for manufacturer list")
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                //console.log(jsonData)
                setPostsData(jsonData)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        if (viewState == -1) {
            request_header.append("Type", "LIST")
            fetch_feed()
        }

        else if (viewState > 0) {
            request_header.append("Type", "MAKE")
            request_header.append("Make", viewState)
            fetch_feed()
        }

        handleGridViewClick();

    }, [viewState]);

    useEffect(() => {
        //GET INFORMATION ON THE PAGE WHEN THE PAGE LOADS
        //This functions dependencies is [profile] so it runs whenever we view a new profile and that displayname 
        //      is passed into the url (see app.js route for this component)
        //I CHANGED THIS FROM DEPENDENCY ARRAY FROM [] TO FIX NO-REFRESH BUG WHEN COMING FROM OTHER PAGES, SAY FROM SEARCH
        //      so if stuff breaks maybe learn how this is supposed to work.
        //console.log(is_self, profile, profile===null)
        fetchData();
        fetchManufacturerList();
    }, [profile]);

    function renderFollowButton(status) {
        switch(String(status)) {
            case "self":
                return <button className="sbtn" onClick={() => {navigate("/bug-report")}}>Report Bug / Make Suggestion</button>
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

    const renderBackButton = () => {
        if (location.state !== null && location.state !== undefined) {
            if (location.state.enable_back_button) {
                return <BackButton enableBackButton={true} />
            } 
        } 
    };

    const renderUpButton = () => {
        if (postsData && postsData.length > 0) {
            return <UpButton />;
        }
    };

    const handleGridViewClick = () => {
        setViewState(-2);
        setGridButtonColor("#983517"); 
        setListButtonColor("#FF521B"); 
    };

    const handleListViewClick = () => {
        setViewState(-1);
        setListButtonColor("#983517"); 
        setGridButtonColor("#FF521B"); 
    };

    return (
        <div>
            {renderBackButton()}
            {renderUpButton()}

            <div className="garageContainer">
            <div className="userInfo">
                <div className="userProfile">
                    <img src={window.location.origin + '/pfp/' + pfpId} />
                    <div className="displayname">{displayname}</div>
                </div>
                <div className="userStats">
                    <div className="userStatsItem">
                        <div>Followers</div>
                        <button className="userStatsItem" onClick={() => {
                            navigate('/relations', {state: {relations: "followers", owner: displayname}})
                        }}>{followers}</button>
                    </div>
                    <div className="userStatsItem">
                        <div>Following</div>
                        <button className="userStatsItem"  onClick={() => {
                            navigate('/relations', {state: {relations: "following", owner: displayname}})
                        }}>{following}</button>
                    </div>
                    <div className="userStatsItem">
                        <div>Catches</div>
                        <p className="userStatsItem" >{catches}</p>
                    </div>
                </div>
            </div>

            {renderFollowButton(followStatus)}

            <div className="carViewOptions">
            <button className="carbtn" style={{ backgroundColor: gridButtonColor }} onClick={handleGridViewClick}> Grid View </button>
                <button className="carbtn" style={{ backgroundColor: listButtonColor }} onClick={handleListViewClick}> List View </button>
            </div>

            {
                viewState == -2 &&
                <div className="manufacturerGrid">
                    {/* Car brand logos will be rendered here */}
                    {manufacturerList.map((manufacturer, index) => (   
                        <button className="manufacturerButton" onClick={() => setViewState(manufacturer.id) }>
                            <img src={window.location.origin + "/brand/" + manufacturer.id + "/logo.svg"}/>
                            <p style = {{color : 'white'}}>{manufacturer.name}: {manufacturer.count}</p>
                        </button>
                    ))}
                </div>
            }

            
            {
                viewState > -2 &&
                <div>
                    {/* THIS PORTION IS REPEATED FROM MAIN FEED PLEASE MAKE A REUSABLE COMPONENT*/}
                    {postsData.map((post, index) => (
                        <Post key = {index} post = {post} />
                    ))}
                    {/* THIS IS WAY TOO LONG TO REPEAT LIKE THIS PLEASE MAKE A REUSABLE COMPONENT */}
                </div>
            }

            {/* Or, for list view */}
            {/* <ul className="carList">
                <li>Car Brand 1</li>
                <li>Car Brand 2</li>
                <li>Car Brand 3</li>
                // Add more list items as needed
            </ul> */}
            
            <button onClick={() => {navigate('/');}}>Go to Test Page</button>
            <br/><br/><br/><p><br/><br/><br/></p><br/><br/><br/>
        </div>
        <NavBar/>
        </div>
        
    );
}
