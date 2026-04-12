//Import React and hooks
import React, {useEffect, useState} from "react";
// Firestore imports
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";

// Dexie imports
import { db as dexieDB } from "./db"; // <-- your Dexie instance

//import navigation
import { useNavigate } from "react-router-dom";

//css
import "./css/settings.css";

//icons
import HomeIcon from "./assets/home.png";
import ProfileIcon from "./assets/profile.png";   
import SettingsIcon from "./assets/settings.png";
import BackIcon from "./assets/back.png";


export default function Settings(){

    //Navigation hook
    const navigate = useNavigate();

    //displays the users name
    const [username, setUsername] =useState(""); 
    // Live storage values
    const [reportCount, setReportCount] = useState(0);
    const [cachedPhotos, setCachedPhotos] = useState(0);
    const [profilePhotoCount, setProfilePhotoCount] = useState(0);const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [locationStatus, setLocationStatus] = useState("Checking...");
    const [cameraStatus, setCameraStatus] = useState("Checking...");

    useEffect(() => {
      // function runs whenver the browser connection changes
    function updateStatus() {
      setIsOnline(navigator.onLine); // navigator.onLine returns returns true (online) or false (offline)
    }
    // Triggered when the device regains internet connection
    window.addEventListener("online", updateStatus);
    // Triggered when the device loses internet connection
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
    }, []);

    useEffect(() => {
      // checks if the browser support API
      if (navigator.permissions) {
      //asks the brower for the current geolcatiob
      navigator.permissions.query({ name: "camera" }).then((result) => {
        // permission is already granted
        if (result.state === "granted") setCameraStatus("Allowed");
          // Browser will ask the user when needed
        else if (result.state === "prompt") setCameraStatus("Ask");
         // User has blocked camera access
        else setCameraStatus("Blocked");

      result.onchange = () => {
        setCameraStatus(result.state === "granted" ? "Allowed" : "Blocked");
      };
    });
  } else {
    // older browsers dont support API
    setCameraStatus("Unknown");
  }
}, []);

    useEffect(() => {
        // checks if the browser support API
      if (navigator.permissions) {
        //asks the brower for the current geolcatiob
        navigator.permissions.query({ name: "geolocation" }).then((result) => {
          // permission is already granted
          if (result.state === "granted") setLocationStatus("Allowed");
          // Browser will ask the user when needed
          else if (result.state === "prompt") setLocationStatus("Ask");
          // User has blocked location access
          else setLocationStatus("Blocked");
          //listens for changes
          result.onchange = () => {
          setLocationStatus(result.state === "granted" ? "Allowed" : "Blocked");
        };
      });
    } else {
      // older browsers dont support API
      setLocationStatus("Unknown");
    }
  }, []);

   
    // load saved username from localstorage 
    useEffect(()=> {
        const savedName =localStorage.getItem("nw_username")// read stored name
        if(savedName) setUsername(savedName); //set it into state if it exist 

            // load Firestore report count
            const loadReports = async () =>{
                 const snapshot = await getDocs(collection(db, "reports"));
                setReportCount(snapshot.size); // number of Firestore documents
            };
            //load Dexie cached photo
            const loadPhotos = async () => {
                const photos = await dexieDB.photos.toArray();
                setCachedPhotos(photos.length);
            };
            const loadProfilePhoto = async () => {
                const profile = await dexieDB.profile.toArray();
                setProfilePhotoCount(profile.length > 0 ? 1 : 0);
            };
            loadReports();
            loadPhotos();
            loadProfilePhoto();  
    }, []);

    //save the current username value into localStorage
    const handleSaveUsername = () =>{
        localStorage.setItem("nw_username", username);
        alert("Display name saved")
    };

    // clear all data data
    const handleClearData = () =>{
        localStorage.removeItem("nw_username");
        alert("App data cleared")
        setUsername(""); //reset state  
    };
    return (
    // Main container for the Settings screen
    <div className="settings-container">
      {/* Top header bar, same style idea as Dashboard */}
      <div className="headerBar">
      <img
        src={BackIcon}
        alt="back"
        className="backIcon"
        onClick={() => navigate("/dashboard")} 
  />
      
        <h1 className="headerTitle">Nature Watch</h1>
      </div>

      {/* Page title area */}
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
        <p className="settings-subtitle">
          Manage your Nature Watch preferences.
        </p>
      </div>

      {/* PROFILE SECTION */}
      <section className="settings-section">
        <h3 className="settings-section-title">Profile</h3>

        {/* Display name field */}
        <label className="settings-field">
          <span className="settings-label">Display Name:</span>
          <input
            type="text"
            className="settings-input"
            value={username}
            placeholder="Enter your name"
            onChange={(e) => setUsername(e.target.value)} // update state as user types
          />
        </label>

        {/* Save button for display name */}
        <button className="settings-button" onClick={handleSaveUsername}>
          Save Name
        </button>
        
      </section>

      {/* APP STATUS SECTION */}
      {/* APP STATUS SECTION */}
      <section className="settings-section">
          <h3 className="settings-section-title">App Status</h3>

          <p className="settings-text">
            Connection: {isOnline ? "🟢 Online" : "🔴 Offline"}
          </p>

          <p className="settings-text">
             Location Access: {locationStatus}
          </p>

          <p className="settings-text">
              Camera Access: {cameraStatus}
          </p>
        </section>


      {/* STORAGE SECTION */}
      <section className="settings-section">
        <h3 className="settings-section-title">Storage</h3>
        {/* These values can be made dynamic later */}
        <p className="settings-text">Saved Reports: {reportCount}</p>
        <p className="settings-text">Cached Photos: {cachedPhotos}</p>
        <p className="settings-text">Profile Photo: {profilePhotoCount}</p>


        {/* Clear data button */}
        <button className="settings-button danger" onClick={handleClearData}>
          Clear All Data
        </button>
      </section>

      {/* ABOUT SECTION */}
      <section className="settings-section">
        <h3 className="settings-section-title">About</h3>
        <p className="settings-text">Version: 1.1.0</p>
        <p className="settings-text">Created by: KristineK – B01741918</p>
      </section>

      {/* BOTTOM NAVIGATION BAR */}
      <div className="bottomNav">
        {/* Home icon - go to dashboard */}
        <img
          src={HomeIcon}
          className="navIcon"
          alt="home"
          onClick={() => navigate("/dashboard")}
        />

        {/* Profile icon - go to profile page (we'll build this next) */}
        <img
          src={ProfileIcon}
          className="navIcon"
          alt="profile"
          onClick={() => navigate("/profile")}
        />

        {/* Settings icon - stay on this page */}
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






