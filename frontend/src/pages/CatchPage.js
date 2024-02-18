import './HomePage.css';

export default function CatchPage({changePage, iSource, prediction}) {

    //the main return to display the home page or main feed
    return (
      <div>
        <p>Welcome to the Catch Page. Our prediction is...</p>
        {prediction}
        <button onClick={() => {changePage("Test")}}>Go to Test Page</button>
      </div>
    );
  }
  