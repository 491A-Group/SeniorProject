import React, { useState } from 'react';
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
    const [manufactureInput, setManufactureInput] = useState('')
    const [pfpIdInput, setPfpIdInput] = useState('') // backend endpoint might be able to handle string OR int
    const handleManuChange = (event) => {
        setManufactureInput(event.target.value);
    };
    const handlePfpChange = (event) => {
        setPfpIdInput(event.target.value);
    };


    /*some of the following code is actually remotely salvageable*/
    async function get_pfp_groups_request() {
        const response = await fetch(window.location.origin + '/settings/pfp')
        setPfpGroups(await response.json())
    }
    async function get_manufacturer_pfps() {
        const response = await fetch(window.location.origin + '/settings/pfp/' + manufactureInput)
        setBrandPfpIds(await response.json())
        //maybe fix this function to handle bad responses:
        //response may return like 'Invalid manufacturer', 404
        // truthfully you should only be sending valid manufacturer id's anyways
    }
    async function submit_new_pfp() {
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



            <div className="container">
                <h1 classname = "h1">entry request example</h1>
                <button onClick={get_pfp_groups_request}>get pfp groups</button>
                <p>
                    {Object.keys(pfpGroups).map((key) => (
                        <li key={key}>
                            {key}:<br/>
                            id {pfpGroups[key][0]}<br/>
                            quantity {pfpGroups[key][1]}
                        </li>
                    ))}
                </p>
            </div>
            <div className="container">
                <h1 classname = "h1">manufacture request example</h1>

                <input 
                    type="text"
                    value={manufactureInput}
                    onChange={handleManuChange}
                    placeholder="manufacture id"
                />
                <button onClick={get_manufacturer_pfps}>get manufacture pfp list</button>

                <p>
                    {brandPfpIds.map((pfp_id, index) => (
                        <p>{pfp_id}</p>
                    ))}
                </p>
            </div>
            <div className="container">
                <h1 classname = "h1">post pfp example</h1>

                <input 
                    type="text"
                    value={pfpIdInput}
                    onChange={handlePfpChange}
                    placeholder="pfp id"
                />
                <button onClick={submit_new_pfp}>post new pfp</button>

            </div>
        </>
    );
}    

export default SettingsPFP;
