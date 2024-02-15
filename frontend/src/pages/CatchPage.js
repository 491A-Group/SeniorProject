import './HomePage.css';

export default function CatchPage({CatchPage}) {
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
      </div>
    );
  }
  