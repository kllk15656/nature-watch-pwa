// import React and hooks
import React, { useEffect, useState } from "react";

// import navigation
import { useNavigate } from "react-router-dom";

// import Firestore 
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";

// import Dexie 
import { db as dexieDB } from "./db";

// css
import "./css/profile.css";

// icons
import BackIcon from "./assets/back.png";
import HomeIcon from "./assets/home.png";
import ProfileIcon from "./assets/profile.png";
import SettingsIcon from "./assets/settings.png";

export default function Profile() {
  // navigation hook
  const navigate = useNavigate();

  // username from localStorage
  const [username, setUsername] = useState("");

  // placeholder for future profile picture
  const [profilePhoto, setProfilePhoto] = useState(null);

  // my Reports (we will fill this in next step)
  const [myReports, setMyReports] = useState([]);

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0]; // get the selected file
    if (!file) return; // no file then stop


    const reader = new FileReader(); //create a file reader
    reader.onloadend = async () => {
      // Save image into Dexie under id profile
      await dexieDB.profile.put({
        id: "profile",
        image: reader.result,
      });
      // update the UI instantly with new image
      setProfilePhoto(reader.result);
    };
    //convert the image to a base 64 string
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = async () => {
  // Delete from Dexie
  await dexieDB.profile.delete("profile");

  // Reset UI
  setProfilePhoto(null);
};


  // Load username + profile picture + reports
  useEffect(() => {
    // Load username
    const savedName = localStorage.getItem("nw_username");
    if (savedName) setUsername(savedName);

    // Load profile picture (Dexie)
    const loadProfilePhoto = async () => {
      const result = await dexieDB.profile.where("id").equals("profile").toArray();
      if (result.length > 0) {
        setProfilePhoto(result[0].image);
      }
    };

    // Load My Reports (Firestore)
    const loadMyReports = async () => {
      if (!savedName) return;

      // Query Firestore for reports where username matches
      const q = query(
        collection(db, "reports"),
        where("username", "==", savedName)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMyReports(data);
    };

    loadProfilePhoto();
    loadMyReports();
  }, []);

  return (
    <div className="profile-container">

      {/* Header */}
      <div className="headerBar">
        <img
          src={BackIcon}
          alt="back"
          className="backIcon"
          onClick={() => navigate("/dashboard")}
        />
        <h1 className="headerTitle">Profile</h1>
      </div>

      {/* Username Section */}
      <section className="profile-section">
        <h2 className="profile-title">Your Profile</h2>

        {/* Profile Picture Placeholder */}
        <div className="profile-photo-box">
          {profilePhoto ? (
            <img src={profilePhoto} alt="profile" className="profile-photo" />
          ) : (
            <div className="profile-photo-placeholder">
              No Profile Photo
            </div>
          )}
        </div>
        
        <label htmlFor="profileUpload" className="uploadButton">
        Upload Profile Photo</label>
        <input
        id="profileUpload"
        type="file"
        accept="image/*"
        onChange={handleProfileUpload}
        className="profile-upload-input"
        />

          {profilePhoto && (
            <button className="removePhotoButton" onClick={handleRemovePhoto}>
              Remove Photo
            </button>
          )}



        {/* Username */}
        <p className="profile-username">
          <strong>Name:</strong> {username || "Not set"}
        </p>

        <p className="profile-note">
          Tap the button above to update your profile picture.    
        </p>
      </section>

      {/* My Reports Section */}
      <section className="profile-section">
        <h2 className="profile-title">My Reports</h2>

        {myReports.length === 0 ? (
          <p className="profile-empty">No reports found.</p>
        ) : (
          <div className="profile-report-list">
            {myReports.map((item) => (
              <div key={item.id} className="profile-report-item">
                <span>{item.title}</span>
                <button
                  className="viewButton"
                  onClick={() =>
                    navigate(`/view-report/${item.id}`, { state: item })
                  }
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom Navigation */}
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
