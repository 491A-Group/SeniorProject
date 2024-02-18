import React from 'react';

function WorkTest({ changePage, iSource, setSource}) {

    const changeSource = () => {
        setSource(previousValue => {
            const newValue = previousValue + "A";
            fetch('https://sc-backend.brian2002.com/predict', {
                method: 'POST',
                body: newValue
            })
            .then((response) => response.text())
            .then((data) => {
                // Handle response data if needed
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
            return newValue; // Return the updated value
        });
    };


  return (
    <div>
      <p>Image Source: {iSource}</p>
      <button onClick={() => {changePage("Test")}}>Go to Test Page</button>
      <button onClick={changeSource}>CHANGE SOURCE</button>
    </div>
  );
}

export default WorkTest;