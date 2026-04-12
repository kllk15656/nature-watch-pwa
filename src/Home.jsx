import React from "react";
import "./css/home.css";
import bird from "./assets/bird.png";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="title">Welcome to Nature Watch</h1>

        <div className="headerWrapper">
          <img src={bird} className="headerImage" alt="bird" />
        </div>

        <p className="subTitle">Discover the wildlife around you</p>

        <button
          className="button"
          onClick={() => navigate("/dashboard")}
        >
          Explore
        </button>
      </div>
    </div>
  );
}
