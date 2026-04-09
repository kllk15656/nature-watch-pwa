import { initializeApp } from "firebase/app"; // Connects your React Native app to Firebase

import { getFirestore } from "firebase/firestore"; // Firestore = database for storing your reports

import { getStorage } from "firebase/storage"; // Storage = where your wildlife photos will be uploaded



const firebaseConfig = {
  apiKey: "AIzaSyD0FDAnJqJ5T8WsVA1Rbp57xPLKpNEP4zo", // public key  that communicates with the firebase services
  authDomain: "naturewatch-a5452.firebaseapp.com", // Firebase Authorcation
  projectId: "naturewatch-a5452", // Project name
  storageBucket: "naturewatch-a5452.appspot.com",// store images
  messagingSenderId: "1049620952770", //send notifications
  appId: "1:1049620952770:web:cb585465c909ecdc3f2d5b" //identifies the app inside firebase
};

const app = initializeApp(firebaseConfig); // connects React native to firebaseproject

export const db = getFirestore(app); // read/write widldlife reports in firestore
export const storage = getStorage(app); // uploads and downsload wildlife photos
