// Import React so we can build components
import React from "react";

// Import navigation tools from React Router
import { useNavigate, useParams, useLocation } from "react-router-dom";

// Import Firestore delete functions
import { deleteDoc, doc } from "firebase/firestore";

// Import our Firestore database instance
import { db } from "./firebase/firebaseConfig";

// Import CSS for styling this screen
import "./css/viewReport.css";

// Import icons for UI
import BackIcon from "./assets/back.png";
import HomeIcon from "./assets/home.png";
import MapIcon from "./assets/map.png";
import SettingsIcon from "./assets/settings.png";
import SyncIcon from "./assets/sync.png";


// VIEW REPORT COMPONENT
export default function ViewReport() {

  // React Router navigation hook for moving between screens
  const navigate = useNavigate();

  // Extract the dynamic URL parameter (report ID)
  const { id } = useParams();

  // Retrieve additional data passed through navigation state
  const location = useLocation();

  // Extract the report object (title, category, etc.)
  const report = location.state || {};

  // Destructure all fields from the report object
  const {
    title,
    category,
    description,
    photoURL,
    lat,
    lng,
    createdAt,
  } = report;


  // DELETE REPORT FUNCTION
  
  async function handleDelete() {
    // If no ID was passed, stop and warn the user
    if (!id) {
      alert("Missing report ID");
      return;
    }

    try {
      // Build a reference to the Firestore document
      const ref = doc(db, "reports", id);

      // Delete the document from Firestore
      await deleteDoc(ref);

      // Notify the user
      alert("Report deleted");

      // Navigate back to the dashboard
      navigate("/dashboard");

    } catch (error) {
      // Log the error for debugging
      console.error(error);

      // Show an error message
      alert("Error deleting report");
    }
  }


  // EDIT REPORT FUNCTION
  function handleEdit() {
    // Navigate to the edit screen and pass the report data forward
    navigate(`/edit-report/${id}`, { state: report });
  }

  // RENDER UI
  return (
    // Root container for the entire screen
    <div className="view-container">

      {/* HEADER BAR */}
      <div className="headerBar">

        {/* Back button to return to dashboard */}
        <img
          src={BackIcon}
          className="backIcon"
          alt="back"
          onClick={() => navigate("/dashboard")}
        />

        {/* Screen title */}
        <h1 className="headerTitle">Report Details</h1>

        {/* Spacer to balance layout */}
        <div style={{ width: 30 }}></div>
      </div>


      {/* MAIN CONTENT */}
      <div className="content">

        {/* Title field */}
        <h3 className="label">Title</h3>
        <p className="value">{title}</p>

        {/* Category field */}
        <h3 className="label">Category</h3>
        <p className="value">{category}</p>

        {/* Date field */}
        <h3 className="label">Date</h3>
        <p className="value">
          {createdAt ? new Date(createdAt).toLocaleString() : "Unknown"}
        </p>

        {/* Description field */}
        <h3 className="label">Description</h3>
        <p className="value">{description}</p>

        {/* Photo preview */}
        <h3 className="label">Photo</h3>
        {photoURL ? (
          // Show the image if available
          <img src={photoURL} className="photo" alt="report" />
        ) : (
          // Fallback text if no image exists
          <p className="value">No photo available</p>
        )}

        {/* Location field */}
        <h3 className="label">Location</h3>
        <p className="value">
          {lat && lng
            ? `${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}`
            : "No location recorded"}
        </p>


        {/* ACTION BUTTONS */}
        <div className="buttonRow">

          {/* Edit button */}
          <button className="editButton" onClick={handleEdit}>
            Edit
          </button>

          {/* Delete button */}
          <button className="deleteButton" onClick={handleDelete}>
            Delete
          </button>

        </div>
      </div>


      {/* BOTTOM NAVIGATION BAR */}
      <div className="bottomNav">

        {/* Home button */}
        <img
          src={HomeIcon}
          className="navIcon"
          alt="home"
          onClick={() => navigate("/")}
        />

        {/* Map button */}
        <img
          src={MapIcon}
          className="navIcon"
          alt="map"
          onClick={() => navigate("/map")}
        />

        {/* Sync button */}
        <img
          src={SyncIcon}
          className="navIcon"
          alt="sync"
          onClick={() => navigate("/sync")}
        />

        {/* Settings button */}
        <img
          src={SettingsIcon}
          className="navIcon"
          alt="settings"
          onClick={() => navigate("/settings")}
        />

      </div>
    </div>
  );
}
