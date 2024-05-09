//BRIAN:
//I wrote this first version of this file. It makes 3 boxes in the view.
//  The first box lets you see all the manufacturers and how many profile pictures there are for them
//  The second box lets you see all the pfp for a manufacturer
//  The final box lets you post a pfp id to change your profile picture

import './SettingsPFP.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TestPage from './TestPage';
import './FeatureRequest.css';
import BackButton from '../components/BackButton';

const SettingsPFP = () => {
    const navigate = useNavigate();

    /*
        result of /settings/pfp
        pfp groups will have form like

        {
            "Acura": [id, quantity_logos],
            "Aston Martin": [8, 2],
            "Other": [0, 84]
            ...
        }
    */
    const [pfpGroups, setPfpGroups] = useState({})
    
    /*
        result of /settings/pfp/<manufacturer_id>
        simply a list of id's of profile pictures
    */
    const [brandPfpIds, setBrandPfpIds] = useState([])
    
    
    /*
        THIS DEBUG GARBAGE IS JUST TO PLAY AROUND WITH
        ONCE YOU ARE FAMILIAR WITH THE SYSTEM GET RID OF THESE DUMB INPUT FIELDS

        INSTEAD EVERYTHING WILL BE BUTTONS
        we know the id of all the brands and all the ids of the pictures..
        its given in the request before right

        so this is just a way to play around but get rid of all this following code for input fields
    */

    /*following function and effect load manufacturers on opening the page*/ 
    async function get_pfp_groups_request() {
        const response = await fetch(window.location.origin + '/settings/pfp')
        setPfpGroups(await response.json())
    }
    useEffect(() => {
        get_pfp_groups_request()
    }, [])

    /*some of the following code is actually remotely salvageable*/

    async function get_manufacturer_pfps(manufactureInput) {
        console.log("startedgmpfp")
        const response = await fetch(window.location.origin + '/settings/pfp/' + manufactureInput)
        const ids =  await response.json()
        console.log("gmpfp", ids)
        setBrandPfpIds(ids)
        //maybe fix this function to handle bad responses:
        //response may return like 'Invalid manufacturer', 404
        // truthfully you should only be sending valid manufacturer id's anyways
    }
    async function submit_new_pfp(pfpIdInput) {
        const response = await fetch(
            window.location.origin + '/settings/pfp',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    pfp: parseInt(pfpIdInput)
                }),
            }
        )
        // can get status from response... i didnt feel like it for this debug just check garage to see new pfp
    }

    return (
        <>
            <BackButton enableBackButton={true} />
            <div className="container">
                <h1 classname = "h1">Change Profile Picture</h1>
            </div>

            <div>
                <h1>Groups</h1>
                {Object.keys(pfpGroups).map((key) => (
                    <>
                        <button className="pfpGroupRow" onClick={() => get_manufacturer_pfps(pfpGroups[key][0]) }>
                            <img src={window.location.origin + "/brand/" + pfpGroups[key][0] + "/logo.svg"} alt={key}/>
                            {key}: {pfpGroups[key][1]}
                        </button>
                        <br/>
                    </>
                ))}
            </div>

            <div>
                <h1>Select PFP</h1>
                <p>
                    {brandPfpIds.map((pfp_id, index) => (
                        <button className="pfpButton" onClick={()=>submit_new_pfp(pfp_id)}>
                            <p>{pfp_id}</p>
                            <img src={window.location.origin + "/pfp/" + pfp_id}/>
                        </button>
                    ))}
                </p>
            </div>
        </>
    );
}    

export default SettingsPFP;
