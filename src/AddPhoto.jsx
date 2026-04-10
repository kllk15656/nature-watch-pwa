//import React and useState for storing the captured image
import React,{useState, useRef} from "react";

//update Firestore function
import {doc,updateDoc} from "firebase/firestore";
import {db as firestoreDB} from "./firebase/firebaseConfig";

// Dexie function to save the photo locally
import {addPhoto} from "./db";

//css
import "./css/addPhoto.css";
import { useNavigate, useParams } from "react-router-dom";

export default function AddPhoto(){

    // Get the report ID from URL
    const{id} = useParams();

    // used to navigate = back after saving
    const navigate = useNavigate();

    //Store the captured base64 image
    const [photo, setPhoto] =useState(null);

    //Webcam
    const videoRef = useRef(null);

    //hidden canvas used to capture image
    const canvasRef =useRef(null);

    // start the web camera 
    async function startCamera(){
        try{
            const stream =await navigator.mediaDevices.getUserMedia({ video:true });
            videoRef.current.srcObject = stream;
            videoRef.current.play();
        } catch (error){
            alert("Camera access denied");
            console.error(error);
        }    
    }

    // capture a photo from webcam
    function capturePhoto(){
        const video = videoRef.current;
        const canvas = canvasRef.current;

        //set canvas sizes to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current video frame
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video,0,0);

        // convert canvas to base64 image
        const imgData = canvas.toDataURL("image/jpeg",0.8);

        // Save base64 image in state
        setPhoto(imgData);

    }
    async function handleSave() {
        if (!photo) return alert("Take a photo first");
        try {
      // Save base64 image to Dexie
        await addPhoto(id, photo);

      // Update Firestore to mark that this report has a photo
        const ref = doc(firestoreDB, "reports", id);
        await updateDoc(ref, { hasPhoto: true });

        alert("Photo saved!");

      // Navigate back to the report page
        navigate(`/view-report/${id}`);

        } catch (error) {
            console.error(error);
            alert("Error saving photo");
    }
  }
  return (
    <div className="addPhoto-container">

      <h1>Add Photo</h1>

      {/* Webcam preview */}
      <video ref={videoRef} className="camera-preview"></video>

      {/* Hidden canvas used to capture the image */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      {/* Start camera button */}
      <button onClick={startCamera}>Start Camera</button>

      {/* Capture photo button */}
      <button onClick={capturePhoto}>Capture Photo</button>

      {/* Show preview of captured image */}
      {photo && (
        <img src={photo} alt="Captured" className="photo-preview" />
      )}

      {/* Save photo button */}
      <button onClick={handleSave} className="save-btn">
        Save Photo
      </button>

    </div>
  );
}  



