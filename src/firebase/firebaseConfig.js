// Connect to Firebase
import { initializeApp } from "firebase/app";

// Firestore with offline support
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from "firebase/firestore";

// Firebase Storage for file uploads
import { getStorage } from "firebase/storage";


// Your Firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyD0FDAnJqJ5T8WsVA1Rbp57xPLKpNEP4zo", // Public API key
  authDomain: "naturewatch-a5452.firebaseapp.com", // Auth domain
  projectId: "naturewatch-a5452", // Project ID
  storageBucket: "naturewatch-a5452.firebasestorage.app", // Correct storage bucket
  messagingSenderId: "1049620952770", // Messaging ID
  appId: "1:1049620952770:web:cb585465c909ecdc3f2d5b" // App ID
};


// Start Firebase
export const app = initializeApp(firebaseConfig);

// Start Firestore with offline caching
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager() // Share cache across tabs
  })
});

// Start Firebase Storage
export const storage = getStorage(app);
