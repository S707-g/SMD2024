// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJVvaKFgl8gWju7ooodfn5918vmirYyXE",
  authDomain: "postandlike-35031.firebaseapp.com",
  projectId: "postandlike-35031",
  storageBucket: "postandlike-35031.appspot.com",
  messagingSenderId: "935404166455",
  appId: "1:935404166455:web:728656020c43b738678eb2",
  measurementId: "G-H3LY1SG32L",
};

// Main DataBase
// apiKey: "AIzaSyCRtkR2HjpPHO8P6EB6P1YlJqQOYSnFbo4",
// authDomain: "socialmedia-23b9b.firebaseapp.com",
// projectId: "socialmedia-23b9b",
// storageBucket: "socialmedia-23b9b.appspot.com",
// messagingSenderId: "453909279920",
// appId: "1:453909279920:web:f480c3c0279437563ef775",
// measurementId: "G-E8HXQV3KNR",

//  BackUp DataBase
//   apiKey:"AIzaSyDJVvaKFgl8gWju7ooodfn5918vmirYyXE",
//   authDomain: "postandlike-35031.firebaseapp.com",
//   projectId: "postandlike-35031",
//   storageBucket: "postandlike-35031.appspot.com",
//   messagingSenderId: "935404166455",
//   appId: "1:935404166455:web:728656020c43b738678eb2",
//   measurementId: "G-H3LY1SG32L"

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export the Firestore instance as the default export
export default db;
