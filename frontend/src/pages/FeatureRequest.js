import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import loading from "../images/loading.gif";

export default function FeatureRequest() {
    const navigate = useNavigate(0)
    const [field, setField] = useState('')
    const [status, setStatus] = useState('')

    const handleFieldUpdate = (event) => {
        setField(event.target.value)
    }

    const handleSubmit = async () => {
        try {
            setStatus('waiting')
            const response = await fetch(window.location.origin + '/brs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({message: field})
            })
            if (response.ok) {
                setStatus('success')
                return
            } else {
                setStatus('error')
                console.error('Fetch error:', response);
                return
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const renderStatus = () => { 
        //someone please fix this and the {renderStatus} line in the return
        switch(status) {
            case '':
                return ''
            case 'waiting':
                return <img src={loading} width="25vw"/>
            case 'error':
                return <p>error</p>
            case 'success':
                setField('')
                return <p>success</p>
        }
    }

    return (
        <>
            <button onClick={() => {navigate(-1)}}>Back</button>
            
            <p>only submit no more than 1 every 24 hours</p>
            <input type="text" value={field} onChange={handleFieldUpdate} placeholder="Describe Bug Or Suggestion"/>
            <button onClick={() => {handleSubmit()}}>Submit</button>
            <p style={{ color: 'black' }}>{field.length}/2048</p>
            
            {renderStatus}
        </>
    )
}
