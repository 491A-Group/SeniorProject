import React from 'react';

function WorkTest({ changePage, iSource, setSource}) {

    const changeSource = () => {
        setSource(iSource + "A");
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