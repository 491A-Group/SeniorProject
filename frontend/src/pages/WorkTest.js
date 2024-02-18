import React from 'react';

function WorkTest({ changePage, iSource, setSource}) {

    const changeSource = () => {
        setSource(iSource + "A");
        fetch('https://sc-backend.brian2002.com/predict', {
            method: 'POST',
            body: iSource
            })
            .then((response) => response.text())
            .then((data) => {
            })
            .catch((error) => {
            console.error('Error fetching data:', error);
            });
    }
  return (
    <div>
      <p>Image Source: {iSource}</p>
      <button onClick={() => {changePage("Test")}}>Go to Test Page</button>
      <button onClick={changeSource}>CHANGE SOURCE</button>
    </div>
  );
}

export default WorkTest;