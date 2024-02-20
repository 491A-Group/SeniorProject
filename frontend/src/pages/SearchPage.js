import './HomePage.css';

export default function SearchPage({changePage}) {

    //the main return to display the home page or main feed
    return (
      <div>
        <p>Welcome to the Search Page...</p>
        <button onClick={() => {changePage("Test")}}>Go to Test Page</button>
      </div>
    );
  }
  