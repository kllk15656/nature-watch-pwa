import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Firestore imports
import { doc, getDoc } from "firebase/firestore";
import { db as firestoreDB } from "./firebase/firebaseConfig";

// CSS
import "./css/viewPhoto.css";

export default function ViewPhoto() {
  // Get report ID from URL
  const { id } = useParams();

  // Navigation
  const navigate = useNavigate();

  // Store the photo URL from Firestore
  const [photoUrl, setPhotoUrl] = useState(null);

  // Load the photo URL from Firestore
  useEffect(() => {
    async function loadPhoto() {
      try {
        // points to the report document
        const ref = doc(firestoreDB, "reports", id);
        //get the document data
        const snapshot = await getDoc(ref);
        // if exist get the url data
        if (snapshot.exists()) {
          const data = snapshot.data();
          setPhotoUrl(data.photoUrl || null);
        }
        //log errors
      } catch (error) {
        console.error("Error loading photo:", error);
      }
    }
    // run loadPhone when id changes
    loadPhoto();
  }, [id]);

  return (
    <div className="viewPhoto-container">
      <h1>Photo</h1>

      {/* If a photo URL exists, show it */}
      {photoUrl ? (
        <img
          src={photoUrl}
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
