import React from "react";
import "./css/home.css"; // your styling file
import bird from "./assets/bird.png"; // adjust path if needed

// Home screen component
export default function Home() {
  return (
    // Main container for the home screen
    <div className="home-container">

      {/* Title text */}
      <h1 className="title">Welcome to Nature Watch</h1>

      {/* Image wrapper */}
      <div className="headerWrapper">
        <img src={bird} className="headerImage" alt="bird" />
      </div>

      {/* Subtitle text */}
      <p className="subTitle">Discover the wildlife around you</p>

      {/* Explore button that navigates to the dashboard */}
      <button
        className="button"
        onClick={() => (window.location.href = "/dashboard")} 
      >
        Explore
      </button>
    </div>
  );
}
