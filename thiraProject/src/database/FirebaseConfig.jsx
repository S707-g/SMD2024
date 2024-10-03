// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRtkR2HjpPHO8P6EB6P1YlJqQOYSnFbo4",
  authDomain: "socialmedia-23b9b.firebaseapp.com",
  projectId: "socialmedia-23b9b",
  storageBucket: "socialmedia-23b9b.appspot.com",
  messagingSenderId: "453909279920",
  appId: "1:453909279920:web:f480c3c0279437563ef775",
  measurementId: "G-E8HXQV3KNR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;
