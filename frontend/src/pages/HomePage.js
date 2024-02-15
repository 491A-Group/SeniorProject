import './HomePage.css';
import CarData from "./CarData.json";
// import Ferrari from "../images/ferrari.png";
// import Testa from "../images/testa_rossa.jpeg";
// import Ford from "../images/ford.png";
// import FordGT from "../images/ford-gt40.jpg";
import Search from "../images/search.png";
import Filter  from "../images/filter.png";
// import Porsche from "../images/porsche-_car.jpg";
// import PorLogo from "../images/porsche.png";

export default function HomePage(changePage) {
    //the main return to display the home page or main feed
    return (
      <div>
        <div className="searchPad">
          <img src={Filter} />
          <p> Filters: Only the coolest cars (Not objective at all)</p>
          <img src={Search} />
        </div>
        <ul className="content">
          {CarData.map((car, index) => (
            <div className="post" key={index}>
              <div className="cardHeader">
                <img src={car.icon} alt={car.name} />
                <h2>{car.name}</h2>
              </div>
  
              <div className="main">
                <img src={car.icon} alt={car.name} /> {/* Reuse the same image as header, replace with appropriate image if needed */}
                <div>
                  <p>{car.details}</p>
                </div>
              </div>
            </div>
          ))}
        </ul>
<button onClick={changePage("Test")}>Go to Test Page</button>
      </div>
    );
  }
  