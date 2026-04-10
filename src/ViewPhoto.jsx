import React from "react";
import { useParams, useNavigate } from "react-router-dom";

// Dexie function to load the base64 image
import { GetPhotoSrc } from "./db";

//css
import "./css/viewPhoto.css";


export default function ViewPhoto() {

  // Get the report ID from the URL
  const { id } = useParams();

  // Used to go back to the previous page
  const navigate = useNavigate();

  // Load the base64 image from Dexie
  const imgSrc = GetPhotoSrc(id);

  return (
    <div className="viewPhoto-container">

      <h1>Photo</h1>

      {/* If a photo exists, show it */}
      {imgSrc ? (
        <img 
          src={imgSrc} 
          alt="Report" 
          className="viewPhoto-image"
        />
      ) : (
        <p>No photo found for this report.</p>
      )}

      {/* Back button */}
      <button onClick={() => navigate(-1)} className="back-btn">
        Back
      </button>

    </div>
  );
}
