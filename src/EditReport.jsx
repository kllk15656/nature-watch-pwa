//import React and use state
import React, { useState } from "react";

//import navigation
import { useNavigate, useParams, useLocation } from "react-router-dom";

//fireStore update function
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";

// firebase Storage imports for uploading & deleting images
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// css 
import "./css/createReport.css";

//icons 
import BackIcon from "./assets/back.png";
import HomeIcon from "./assets/home.png";
import SettingsIcon from "./assets/settings.png";
import ProfileIcon from "./assets/profile.png"; 

export default function EditReport() {

  const navigate = useNavigate();
  const { id } = useParams();

  // Get the report passed from ViewReport
  const routeLocation = useLocation();
  const report = routeLocation.state || {};
  const username = report.username || "";
  
  // Pre-fill form fields
  const [title, setTitle] = useState(report.title || "");
  const [category, setCategory] = useState(report.category || "");
  const [description, setDescription] = useState(report.description || "");

  // Make location editable
  const [location, setLocation] = useState(report.location || { lat: null, lng: null });

  // Store the new image file selected by the user
  const [newPhoto, setNewPhoto] = useState(null);

  // Get updated GPS location
  async function updateLocation() {
    if (!navigator.geolocation) {
      return alert("Geolocation not supported.");
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        alert("Location updated!");
      },
      () => alert("Unable to retrieve location.")
    );
  }

  // Save updated report
  async function handleUpdate(e) {
    e.preventDefault();

    // basic validation
    if (!title.trim()) return alert("Title is required.");
    if (!category) return alert("Select a category");
    if (!description.trim()) return alert("Description is required.");

    try {
      const refDoc = doc(db, "reports", id);

      // Start with the existing photo URL
      let updatedPhotoUrl = report.photoUrl;

      // If the user selected a new image, upload it
      if (newPhoto) {
        const storage = getStorage();

        // Reference to the old image (if it exists)
        const oldImageRef = report.photoUrl ? ref(storage, report.photoUrl) : null;

        // Delete old image from Firebase Storage
        if (oldImageRef) {
          await deleteObject(oldImageRef).catch(() => {
            console.warn("Old image could not be deleted (may not exist).");
          });
        }

        // Upload new image to Firebase Storage
        const newImageRef = ref(storage, `reportImages/${id}`);
        await uploadBytes(newImageRef, newPhoto);

        // Get new download URL
        updatedPhotoUrl = await getDownloadURL(newImageRef);
      }

      // Update Firestore
      await updateDoc(refDoc, {
        title,
        category,
        description,
        location,
        username,
        photoUrl: updatedPhotoUrl,
        hasPhoto: true,
      });

      alert("Report updated!");

      // Navigate back to ViewReport with updated data
      navigate(`/view-report/${id}`, {
        state: {
          ...report,
          title,
          category,
          description,
          username,
          location,
          photoUrl: updatedPhotoUrl,
          hasPhoto: true,
        },
      });

    } catch (error) {
      console.error(error);
      alert("Error updating report");
    }
  }

  return (
    <div className="view-container">

      {/* HEADER BAR */}
      <div className="headerBar">
        <img
          src={BackIcon}
          className="backIcon"
          alt="back"
          onClick={() => navigate(`/view-report/${id}`, { state: report })}
        />
        <h1 className="headerTitle">Edit Report</h1>
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

        {/* Update Photo */}
        <h3 className="label">Update Photo</h3>
        <input
          type="file"
          accept="image/*"
          className="inputField"
          onChange={(e) => setNewPhoto(e.target.files[0])}
        />

        {/* Location */}
        <h3 className="label">Location</h3>
        <p className="value">
          {location?.lat && location?.lng
            ? `${Number(location.lat).toFixed(5)}, ${Number(location.lng).toFixed(5)}`
            : "No location recorded"}
        </p>

        <button className="saveButton" onClick={updateLocation}>
          Update Location
        </button>

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
