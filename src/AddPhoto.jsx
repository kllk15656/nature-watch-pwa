// React 
import React, { useState, useRef } from "react";

// firestore update
import { doc, updateDoc } from "firebase/firestore";
import { db as firestoreDB } from "./firebase/firebaseConfig";

// firebase Storage
import { storage } from "./firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Dexie offline copy
import { addPhoto } from "./db";

// css
import "./css/addPhoto.css";
// router
import { useNavigate, useParams } from "react-router-dom";

export default function AddPhoto() {

  const { id } = useParams();        // report ID from URL
  const navigate = useNavigate();    // navigation

  const [photo, setPhoto] = useState(null); // base64 image

  const videoRef = useRef(null);     // webcam video
  const canvasRef = useRef(null);    // hidden canvas


  // start webcam
  async function startCamera() {
    try {
      //ask the broswers for permission 
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // webcam streams to the video element
      videoRef.current.srcObject = stream;
      //start playing live camera
      videoRef.current.play();
    } catch (error) {
      //if the users blocks camera or an error happens
      alert("Camera access denied");
      console.error(error);
    }
  }


  // capture photo from webcam
  function capturePhoto() {
    //gets the video element showing the webcam
    const video = videoRef.current;
    //get the hidden canva to take the snap shot
    const canvas = canvasRef.current;

    // the canvas size of the webcam
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    //gets a draeeing tool for the canva
    const ctx = canvas.getContext("2d");
    // draw webcam frame onto the canva

    ctx.drawImage(video, 0, 0);
    //convert the canva into a base64
    const imgData = canvas.toDataURL("image/jpeg", 0.8);
    //store the base64 image in state
    setPhoto(imgData);
  }


  // upload from device
  function handleFileUpload(e) {
    //get the first select file
    const file = e.target.files[0];
    // stop if no file is selected
    if (!file) return;

    // create a file reader to convert the image into base64
    const reader = new FileReader();
    // when the file fully read, save the base64 image
    reader.onloadend = () => setPhoto(reader.result);
    //read the file as base64 data url
    reader.readAsDataURL(file);
  }


  // convert base64 → Blob
  function base64ToBlob(base64) {
    //decode the base64 into binary text
    const byteString = atob(base64.split(",")[1]);
    //create a buffer the same length as the binary data
    const arrayBuffer = new ArrayBuffer(byteString.length);
    // create a typed array to hold each byte
    const intArray = new Uint8Array(arrayBuffer);
    
    //copy each byte intot the typed array
    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
    //return blob containg the image data as jepg
    return new Blob([intArray], { type: "image/jpeg" });
  }


  // save photo to Firebase Storage and Firestore
  async function handleSave() {
    //stops if no phot has been taken or uploaded
    if (!photo) return alert("Take or upload a photo first");

    try {
      // converts base64 image into a blob
      const blob = base64ToBlob(photo);   
      //creates a storage path            
      const storageRef = ref(storage, `images/${id}.jpg`); 
      //upload the blob to firestorage
      await uploadBytes(storageRef, blob);
      // get the public download URL for uploaded image            
      const downloadURL = await getDownloadURL(storageRef); 

      // update the firestore report with the photo url
      const refDoc = doc(firestoreDB, "reports", id); // firestore doc
      await updateDoc(refDoc, {
        hasPhoto: true,
        photoUrl: downloadURL
      });
      // save a local copy in dexie if offline
      await addPhoto(id, photo);  
      // notify user
      alert("Photo uploaded successfully!");
      // go back to the dashboard
      navigate("/dashboard");  

    } catch (error) {
      // handles any error
      console.error(error);
      alert("Error uploading photo");
    }
  }


  return (
    <div className="addPhoto-container">
      <h1>Add Photo</h1>

      {/* Webcam preview */}
      <video ref={videoRef} className="camera-preview"></video>

      {/* Hidden canvas */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      {/* Buttons */}
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={capturePhoto}>Capture Photo</button>

      {/* Upload from device */}
      <input
        type="file"
        accept="image/*"
        id="fileInput"
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />
      <button onClick={() => document.getElementById("fileInput").click()}>
        Upload from Device
      </button>

      {/* Preview */}
      {photo && <img src={photo} alt="Captured" className="photo-preview" />}

      {/* Save */}
      <button onClick={handleSave} className="save-btn">
        Save Photo
      </button>
    </div>
  );
}
