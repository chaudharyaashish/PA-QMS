// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDPVT9iuxVlvP_SW6IPlEuSuiw06Tslt-8",
  authDomain: "pa-qms.firebaseapp.com",
  projectId: "pa-qms",
  storageBucket: "pa-qms.firebasestorage.app",
  messagingSenderId: "81833286438",
  appId: "1:81833286438:web:fa598f17426398f2243fe7",
  measurementId: "G-8HE5WN02CG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
