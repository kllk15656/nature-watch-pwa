//Import React and use state
import React, { useState } from "react";

//import navigation
import { useNavigate, useParams, useLocation } from "react-router-dom";

//FireStore update function
import {doc, updateDoc} from "firebase/firestore";
import {db} from "./firebase/firebaseConfig";

// css by CreateReport
import "./css/createReport.css";

//Import icons for  UI
import BackIcon from "./assets/back.png";
import HomeIcon from "./assets/home.png";
import SettingsIcon from "./assets/settings.png";

export default function EditReport() {

  const navigate = useNavigate();
  const { id } = useParams();

  // Get the report passed from ViewReport
  const routeLocation = useLocation();
  const report = routeLocation.state || {};

  // Pre-fill form fields
  const [title, setTitle] = useState(report.title || "");
  const [category, setCategory] = useState(report.category || "");
  const [description, setDescription] = useState(report.description || "");
  const [location] = useState(report.location || { lat: null, lng: null });

  // Save updated report
  async function handleUpdate(e) {
    e.preventDefault();

    if (!title.trim()) return alert("Title is required.");
    if (!category) return alert("Select a category");
    if (!description.trim()) return alert("Description is required.");

    try {
      const ref = doc(db, "reports", id);

      await updateDoc(ref, {
        title,
        category,
        description,
        location,
      });

      alert("Report updated!");

      // Navigate back to ViewReport with updated data
      navigate(`/view-report/${id}`, {
        state: { ...report, title, category, description },
      });

    } catch (error) {
      console.error(error);
      alert("Error updating report");
    }
  }

  return (
    // Root container for the entire screen
    <div className="view-container">

      {/* HEADER BAR */}
      <div className="headerBar">

        {/* Back button */}
        <img
          src={BackIcon}
          className="backIcon"
          alt="back"
          onClick={() => navigate(`/view-report/${id}`, { state: report })}
        />

        {/* Screen title */}
        <h1 className="headerTitle">Edit Report</h1>

        {/* Spacer */}
        <div style={{ width: 30 }}></div>
      </div>


      {/* MAIN CONTENT */}
      <div className="content">

        {/* Title field */}
        <h3 className="label">Title</h3>
        <input
          type="text"
          className="inputField"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Category field */}
        <h3 className="label">Category</h3>
        <select
          className="inputField"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select a category...</option>
          <option value="Bird">Bird</option>
          <option value="Plant">Plant</option>
          <option value="Mammal">Mammal</option>
          <option value="Insect">Insect</option>
          <option value="Reptile">Reptile</option>
          <option value="Fungus">Fungus</option>
        </select>

        {/* Description field */}
        <h3 className="label">Description</h3>
        <textarea
          className="inputField"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Location field (read-only) */}
        <h3 className="label">Location</h3>
        <p className="value">
          {location?.lat && location?.lng
            ? `${Number(location.lat).toFixed(5)}, ${Number(location.lng).toFixed(5)}`
            : "No location recorded"}
        </p>

        {/* SAVE CHANGES BUTTON */}
        <button className="saveButton" onClick={handleUpdate}>
          Save Changes
        </button>

      </div>


      {/* BOTTOM NAVIGATION BAR */}
      <div className="bottomNav">

        <img
          src={HomeIcon}
          className="navIcon"
          alt="home"
          onClick={() => navigate("/dashboard")}
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