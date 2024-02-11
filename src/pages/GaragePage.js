import './HomePage.css';

export default function GaragePage({changePage}){

  return (
    <>
        <button onClick={changePage("Test")}>Go to Test Page</button>
      <p>GET and POST test used to be here, now decommissioned. Richard has format</p>
    </>
  )
};