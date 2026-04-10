// Import React so we can build components and use state
import React, { useState } from "react";

// Import navigation hook from React Router for screen changes
import { useNavigate } from "react-router-dom";

// Import Firestore and Storage instances from your Firebase config
import { db, storage } from "./firebase/firebaseConfig";

// Import Firestore functions for adding a new document and timestamps
import { collection, addDoc, Timestamp } from "firebase/firestore";

// Import Firebase Storage helpers for uploading files and getting URLs
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Import CSS file that styles this Create Report screen
import "./css/createReport.css";

// Import icon images for header and bottom navigation
import BackIcon from "./assets/back.png";
import HomeIcon from "./assets/home.png";
import SettingsIcon from "./assets/settings.png";
import SyncIcon from "./assets/sync.png";
import MapIcon from "./assets/map.png";

// Export the CreateReport component so App.js can route to it
export default function CreateReport() {

  // React Router navigation hook for moving between pages
  const navigate = useNavigate();

  // State to store the report title text
  const [title, setTitle] = useState("");

  // State to store the selected category text
  const [category, setCategory] = useState("");

  // State to control whether the category modal is visible
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  // State to store the description text
  const [description, setDescription] = useState("");

  // State to store the GPS location as latitude and longitude
  const [location, setLocation] = useState({ lat: null, lng: null });

  // State to store the selected photo file from the file input
  const [photoFile, setPhotoFile] = useState(null);

  // Function to request and fetch the user's current location using browser geolocation
  function handleGetLocation() {
    // Check if the browser supports geolocation
    if (!navigator.geolocation) {
      alert("Location not supported in this browser");
      return;
    }

    // Ask the browser to get the current position
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // On success, update state with latitude and longitude
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (error) => {
        // On error, show a simple alert
        console.error(error);
        alert("Unable to retrieve location");
      }
    );
  }

  // Function that runs when the user selects a photo file
  function handlePhotoChange(event) {
    // Get the first file from the file input
    const file = event.target.files[0];

    // If a file exists, store it in state
    if (file) {
      setPhotoFile(file);
    }
  }

  // Main function that validates inputs and saves the report
  async function handleSaveReport() {
    // Check that the title is not empty
    if (!title.trim()) return alert("Please enter a title");

    // Check that a category has been selected
    if (!category) return alert("Please select a category");

    // Check that the description is not empty
    if (!description.trim()) return alert("Please enter a description");

    // Check that location has been captured
    if (!location.lat || !location.lng) return alert("Please get your location");

    // Check that a photo file has been chosen
    if (!photoFile) return alert("Please choose a photo");

    try {
      // Inform the user that the photo is being uploaded
      alert("Uploading photo...");

      // Upload the photo file to Firebase Storage and get its URL
      const photoURL = await uploadPhotoToStorage(photoFile);

      // Inform the user that the report is being saved
      alert("Saving report...");

      // Save the report data into Firestore with all fields
      await addDoc(collection(db, "reports"), {
        title,
        category,
        description,
        lat: location.lat,
        lng: location.lng,
        photoURL,
        createdAt: Timestamp.now(),
      });

      // Notify the user that the report was saved successfully
      alert("Report saved!");

      // Navigate back to the dashboard screen
      navigate("/dashboard");

    } catch (error) {
      // Log any errors to the console for debugging
      console.error(error);

      // Show a user-friendly error message
      alert("Error saving report");
    }
  }

  // Helper function that uploads a photo file to Firebase Storage
  async function uploadPhotoToStorage(file) {
    // Build a unique filename using the current time and original file name
    const filename = `reports/${Date.now()}_${file.name}`;

    // Create a reference in Firebase Storage for this file
    const storageRef = ref(storage, filename);

    // Upload the file bytes to Firebase Storage
    await uploadBytes(storageRef, file);

    // Get the public download URL for the uploaded file
    const url = await getDownloadURL(storageRef);

    // Return the URL so it can be stored in Firestore
    return url;
  }

  // Return the JSX that renders the Create Report screen
  return (
    // Root container for the entire Create Report page
    <div className="create-container">

      {/* Header bar at the top of the screen */}
      <div className="headerBar">

        {/* Back button icon that returns to the dashboard */}
        <img
          src={BackIcon}
          className="backIcon"
          alt="back"
          onClick={() => navigate("/dashboard")}
        />

        {/* Title text in the header */}
        <h1 className="headerTitle">Create Report</h1>

        {/* Empty spacer to balance the header layout */}
        <div style={{ width: 30 }}></div>
      </div>

      {/* Scrollable main content area for the form fields */}
      <div className="content">

        {/* Label for the title input */}
        <label className="label">Title</label>

        {/* Text input for entering the report title */}
        <input
          className="input"
          placeholder="Enter a report title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Label for the category section */}
        <label className="label">Category</label>

        {/* Button that opens the category selection modal */}
        <button
          className="dropdownButton"
          onClick={() => setCategoryModalVisible(true)}
        >
          {/* Show selected category or placeholder text */}
          {category ? category : "Select a category..."}
        </button>

        {/* Label for the description input */}
        <label className="label">Description</label>

        {/* Text area for entering a longer description of the sighting */}
        <textarea
          className="textarea"
          placeholder="Describe what you saw..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Label for the location section */}
        <label className="label">Location</label>

        {/* Text showing either the coordinates or a placeholder message */}
        <p className="locationText">
          {location.lat
            ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`
            : "No location yet"}
        </p>

        {/* Button that triggers the browser geolocation request */}
        <button className="actionButton" onClick={handleGetLocation}>
          Get Location
        </button>

        {/* Label for the photo upload section */}
        <label className="label">Photo</label>

        {/* File input that lets the user choose or capture an image */}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoChange}
        />

        {/* If a photo file is selected, show a preview image */}
        {photoFile && (
          <img
            src={URL.createObjectURL(photoFile)}
            className="photoPreview"
            alt="preview"
          />
        )}

        {/* Button that validates and saves the report */}
        <button className="saveButton" onClick={handleSaveReport}>
          Save Report
        </button>
      </div>

      {/* Conditional rendering of the category modal overlay */}
      {categoryModalVisible && (
        // Semi-transparent overlay that covers the screen
        <div className="modalOverlay">

          {/* Centered box that contains the category options */}
          <div className="modalBox">

            {/* Title text inside the modal */}
            <h3 className="modalTitle">Choose Category</h3>

            {/* Map over a list of category names to create buttons */}
            {["Bird", "Plant", "Mammal", "Insect", "Reptile", "Fungus"].map(
              (item) => (
                // Button for each category option
                <button
                  key={item}
                  className="modalItem"
                  onClick={() => {
                    // When clicked, set the category and close the modal
                    setCategory(item);
                    setCategoryModalVisible(false);
                  }}
                >
                  {/* Show the category name as button text */}
                  {item}
                </button>
              )
            )}

            {/* Button that closes the modal without selecting a category */}
            <button
              className="modalCancel"
              onClick={() => setCategoryModalVisible(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Bottom navigation bar fixed at the bottom of the screen */}
      <div className="bottomNav">

        {/* Home icon that navigates to the home page */}
        <img
          src={HomeIcon}
          className="navIcon"
          alt="home"
          onClick={() => navigate("/")}
        />

        {/* Map icon that navigates to the map page */}
        <img
          src={MapIcon}
          className="navIcon"
          alt="map"
          onClick={() => navigate("/map")}
        />

        {/* Sync icon that navigates to the sync page */}
        <img
          src={SyncIcon}
          className="navIcon"
          alt="sync"
          onClick={() => navigate("/sync")}
        />

        {/* Settings icon that navigates to the settings page */}
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
