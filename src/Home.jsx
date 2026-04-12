import React from "react";
import "./css/home.css"; // your styling file
import bird from "./assets/bird.png"; 


// Home screen component
export default function Home() {
  return (
    // Main container for the home screen
    <div className="home-container">

  <div className="home-content">
    <h1 className="title">Welcome to Nature Watch</h1>

    <div className="headerWrapper">
      <img src={bird} className="headerImage" alt="bird" />
    </div>

    <p className="subTitle">Discover the wildlife around you</p>

    <button
      className="button"
      onClick={() => (window.location.href = "/dashboard")}
    >
      Explore
    </button>
  </div>

</div>

  );
}
