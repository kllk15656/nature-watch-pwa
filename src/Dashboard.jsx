// Import react 
import React, { useEffect, useState } from "react";

// import Firestore functions for real-time updates
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

// import Firestore database 
import { db } from "./firebase/firebaseConfig.js";

// import CSS for styling this dashboard
import "./css/dashboard.css";

// import icons 
import HomeIcon from "./assets/home.png";
import SettingsIcon from "./assets/settings.png";
import ProfileIcon from "./assets/profile.png"; 

// import navigation from React Router
import { useNavigate } from "react-router-dom";


export default function Dashboard() {

  // react Router navigation hook
  const navigate = useNavigate();

  // state to store Firestore reports
  const [reports, setReports] = useState([]);

  // load Firestore reports in real-time
  useEffect(() => {
    // create a Firestore query sorted by newest first
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));

    // listen for live updates from Firestore
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // convert Firestore docs into plain JS objects
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,       // include document ID
        ...doc.data(),    // include all fields
      }));

      // save updated list into state
      setReports(data);
    });

    // cleanup listener when component unmounts
    return unsubscribe;
  }, []);

  return (
    // Main container for the dashboard
    <div className="dashboard-container">

      {/* Header bar */}
      <div className="headerBar">
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
                className="viewButton"
                onClick={() => navigate(`/view-report/${item.id}`, { state: item })}

              >
                View
              </button>
            </div>
          );
        })}
      </div>

      {/* BOTTOM NAVIGATION BAR */}
      <div className="bottomNav">
        {/* Home icon - go to dashboard */}
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
