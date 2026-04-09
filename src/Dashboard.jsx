// Import React so we can build components
import React, { useEffect, useState } from "react";

// Import Firestore functions for real-time updates
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

// Import Firestore database 
import { db } from "./firebase/firebaseConfig.js";

// Import CSS for styling this dashboard
import "./css/dashboard.css";

// Import icons (React Web uses normal <img>, not Image from RN)
import HomeIcon from "./assets/home.png";
import MapIcon from "./assets/map.png";
import MenuIcon from "./assets/menu.png";
import SettingsIcon from "./assets/settings.png";
import SyncIcon from "./assets/sync.png";

// Import navigation from React Router
import { useNavigate } from "react-router-dom";

// Export the Dashboard component so App.js can load it
export default function Dashboard() {

  // React Router navigation hook
  const navigate = useNavigate();

  // State to store Firestore reports
  const [reports, setReports] = useState([]);

  // Load Firestore reports in real-time
  useEffect(() => {
    // Create a Firestore query sorted by newest first
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));

    // Listen for live updates from Firestore
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Convert Firestore docs into plain JS objects
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,       // include document ID
        ...doc.data(),    // include all fields
      }));

      // Save updated list into state
      setReports(data);
    });

    // Cleanup listener when component unmounts
    return unsubscribe;
  }, []);

  return (
    // Main container for the dashboard
    <div className="dashboard-container">

      {/* Header bar */}
      <div className="headerBar">
        <img src={MenuIcon} className="menuIcon" alt="menu" />
        <h1 className="headerTitle">Nature Watch</h1>
      </div>

      {/* New Report button */}
      <button
        className="newReportButton"
        onClick={() => navigate("/create-report")}
      >
        New Report
      </button>

      {/* Section title */}
      <h2 className="sectionTitle">Recent Reports</h2>

      {/* Table container */}
      <div className="tableContainer">

        {/* Table header row */}
        <div className="tableHeader">
          <span className="tableHeaderText">Title</span>
          <span className="tableHeaderText">Category</span>
          <span className="tableHeaderText">Date</span>
          <span className="tableHeaderText">Time</span>
          <span className="tableHeaderText">View</span>
        </div>

        {/* Dynamic rows from Firestore */}
        {reports.map((item) => {
          // Convert Firestore timestamp to JS Date
          const date = item.createdAt?.toDate();
          const dateStr = date ? date.toLocaleDateString() : "—";
          const timeStr = date ? date.toLocaleTimeString() : "—";

          return (
            // Each row in the table
            <div key={item.id} className="tableRow">
              <span className="tableCell">{item.title}</span>
              <span className="tableCell">{item.category}</span>
              <span className="tableCell">{dateStr}</span>
              <span className="tableCell">{timeStr}</span>

              {/* View button */}
              <button
                className="viewCellButton"
                onClick={() => navigate(`/view-report/${item.id}`, { state: item })}

              >
                View
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom navigation bar */}
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
