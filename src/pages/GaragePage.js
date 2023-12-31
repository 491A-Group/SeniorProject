import './HomePage.css';
import React, { useState } from 'react';


export default function GaragePage(){
    
    const [getResult, setGetResult] = useState([]);
    const [postInputValue, setPostInputValue] = useState('');

    const handleGet = async () => {
        // Perform some logic and update the result state
        try {
            // Make a GET request using fetch
            const response = await fetch('https://sc-prediction-model.brian2002.com/show_all');
            
            // Check if the request was successful (status code 200)
            if (response.ok) {
              // Parse the response body as JSON
              const result = await response.json();
              console.log(result)
              // Update the state with the fetched data
              setGetResult(result);
            } else {
              console.error('Failed to fetch data:', response.statusText);
            }
          } catch (error) {
            console.error('Error during fetch:', error.message);
          }
    };

    const handlePost = async (event) => {
        // Prevent the default form submission behavior
        event.preventDefault();
    
        try {
            // Make a GET request using fetch
            const response = await fetch('https://sc-prediction-model.brian2002.com/put_api', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                // Add any other headers as needed
                },
                body: postInputValue,
            });
            
            // Check if the request was successful (status code 200)
            if (response.ok) {
              console.log(response);
              // Update the state with the fetched data
              console.log('Submitted:', postInputValue);
              setPostInputValue('');
            } else {
              console.error('Failed to fetch data:', response.statusText);
            }
          } catch (error) {
            console.error('Error during fetch:', error.message);
          }
    
        // Clear the input field after submission (optional)
      };

    return (
        <>
            <div>
                <h3>get</h3>
                <button onClick={handleGet}>GET</button>
                <ul>
                    {getResult.map(([index, val]) => <li key={index}>{val}</li>)}
                </ul>
            </div>

            <div>
                <h3>post</h3>
                <form onSubmit={handlePost}>
                    <input
                    type="text"
                    value={postInputValue}
                    onChange={(e) => setPostInputValue(e.target.value)}
                    placeholder="Type something to insert..."
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </>
    )
};