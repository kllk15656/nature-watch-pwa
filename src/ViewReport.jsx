// react for building the component
import React from "react";

// navigation tools
import { useNavigate, useParams, useLocation } from "react-router-dom";

// firestore delete functions
import { deleteDoc, doc } from "firebase/firestore";

// firestore database
import { db } from "./firebase/firebaseConfig";

//css
import "./css/viewReport.css";

// icons
import BackIcon from "./assets/back.png";
import HomeIcon from "./assets/home.png";
import SettingsIcon from "./assets/settings.png";
import ProfileIcon from "./assets/profile.png";



export default function ViewReport() {

  const navigate = useNavigate();     //  page navigation
  const { id } = useParams();         // report ID from URL

  const routeLocation = useLocation(); // data passed from previous page
  const report = routeLocation.state || {}; // report object

  // pull fields from the report
  const {
    title,
    category,
    description,
    location,
    createdAt,
    username,
    photoUrl,   // photo URL from Firebase Storage
    hasPhoto
  } = report;


  // DELETE REPORT
  async function handleDelete() {
    if (!id) {
      alert("Missing report ID");
      return; // stops if no id
    }

    try {
      //create a reference to the report document
      const ref = doc(db, "reports", id); 
      //delete the document
      await deleteDoc(ref);              
      // tells users it works
      alert("Report deleted");
      // take back to dashboard
      navigate("/dashboard");             

    } catch (error) {
      // log a error for debugging
      console.error(error);
      alert("Error deleting report");
    }
  }

//edit function
  function handleEdit() {
    // goes to the edit page for this report and passes report data 
    navigate(`/edit-report/${id}`, { state: report }); 
  }


  return (
    <div className="view-container">

      {/* HEADER */}
      <div className="headerBar">
        <img
          src={BackIcon}
          className="backIcon"
          alt="back"
          onClick={() => navigate("/dashboard")}
        />
        <h1 className="headerTitle">Report Details</h1>
        <div style={{ width: 30 }}></div>
      </div>


      {/* MAIN CONTENT */}
      <div className="content">

        <h3 className="label">Title</h3>
        <p className="value">{title}</p>

        <h3 className="label">Category</h3>
        <p className="value">{category}</p>

        <h3 className="label">Report Owner</h3>
        <p className="value">{username || "Unknown"}</p>

        <h3 className="label">Date</h3>
        <p className="value">
          {createdAt?.seconds
            ? new Date(createdAt.seconds * 1000).toLocaleString()
            : "Unknown"}
        </p>

        <h3 className="label">Description</h3>
        <p className="value">{description}</p>


        {/* PHOTO SECTION */}
        <h3 className="label">Photo</h3>

        {photoUrl ? (
          <>
            {/* Small preview */}
            <img 
              src={photoUrl}
              alt="Report"
              className="thumbnailPhoto"
            />

            {/* Button to open full photo */}
            <button 
              className="viewPhotoButton"
              onClick={() => navigate(`/view-photo/${id}`)}
            >
              View Full Photo
            </button>
          </>
        ) : (
          <p className="value">No photo added yet.</p>
        )}


        {/* LOCATION */}
        <h3 className="label">Location</h3>
        <p className="value">
          {location?.lat && location?.lng
            ? `${Number(location.lat).toFixed(5)}, ${Number(location.lng).toFixed(5)}`
            : "No location recorded"}
        </p>


        {/* EDIT + DELETE BUTTONS */}
        <div className="buttonRow">
          <button className="editButton" onClick={handleEdit}>
            Edit
          </button>

          <button className="deleteButton" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>


      {/* BOTTOM NAV BAR */}
      <div className="bottomNav">
        <img
          src={HomeIcon}
          className="navIcon"
          alt="home"
          onClick={() => navigate("/dashboard")}
        />
        <img
          src={ProfileIcon}
          className="navIcon"
          alt="profile"
          onClick={() => navigate("/profile")}
        />
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
