// Import React and use State 
import React, { useState, useEffect} from 'react';

//firestore functions for saving a report
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase/firebaseConfig'; // Adjust the path as needed

// import navigation hook
import { useNavigate } from 'react-router-dom';

// css style
import './css/createReport.css';

// Import icons for UI
import BackIcon from "./assets/back.png";
import HomeIcon from "./assets/home.png";
import SettingsIcon from "./assets/settings.png";

export default function CreateReport() {

  const navigate = useNavigate();

  // Form state variables
  const [title, setTitle] = useState("");          // Report title
  const [category, setCategory] = useState("");    // Category dropdown
  const [description, setDescription] = useState(""); // Description text

  // Location stored as lat/lng
  const [location, setLocation] = useState({ lat: null, lng: null });

  const [username, setUsername] = useState(""); // stores username from localStorage
  
  useEffect(() => {
    const savedName = localStorage.getItem("nw_username");
    if (savedName) setUsername(savedName);
  }, []);

  
  
    // get user location
  async function getUserLocation() {
    // check if browser supports geolocation
    if (!navigator.geolocation) {
      alert("Geolocation not supported by this browser.");
      return;
    }

    // ask browser for current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Save latitude and longitude to state
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => alert("Unable to retrieve your location.")
    );
  }

  // save the report to firestore
  async function handleSaveReport(e) {
    e.preventDefault(); // prevents page reloading

    // basic validation
    if (!title.trim()) return alert("Title is required.");
    if (!category) return alert("Select a category");
    if (!description.trim()) return alert("Description is required.");
    if (!location.lat || !location.lng) return alert("Get your location first");

    try {
      //add a new document to Firestore
      const docRef = await addDoc(collection(db, "reports"), {
        title,
        category,
        description,
        location,
        username,
        hasPhoto: false, // update later on
        createdAt: serverTimestamp(),
      });

      const newId = docRef.id; // <-- IMPORTANT: get the Firestore ID

      alert("Report saved! Now add a photo.");

      //Navigate to camera page
      navigate(`/add-photo/${newId}`);

    } catch (error) {
      console.error(error);
      alert("Error saving report");
    }
  }

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
        <h1 className="headerTitle">Create Report</h1>

        {/* Spacer to balance layout */}
        <div style={{ width: 30 }}></div>
      </div>

      {/* MAIN CONTENT */}
      <div className="content">

        {/* Title field */}
        <h3 className="label">Title</h3>
        <input
          type="text"
          value={title}
          className="inputField"
          placeholder="Enter a report title"
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Category field */}
        <h3 className="label">Category</h3>
        <select
          value={category}
          className="inputField"
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
          value={description}
          className="inputField"
          placeholder="Describe what you saw..."
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Location field */}
        <h3 className="label">Location</h3>
        <p className="value">
          {location.lat
            ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`
            : "No location yet"}
        </p>

        {/* GET LOCATION BUTTON */}
        <button className="actionButton" onClick={getUserLocation}>
          Get Location
        </button>

        {/* SAVE & TAKE PHOTO BUTTON */}
        <button type="submit" className="actionButton" onClick={handleSaveReport}>
          Save & Take Photo
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
