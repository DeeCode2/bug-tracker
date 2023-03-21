// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUiVeOHvWAoNEYj3Ubg91Q3C9Xa2VByJU",
  authDomain: "doc-tracker-ae6fc.firebaseapp.com",
  projectId: "doc-tracker-ae6fc",
  storageBucket: "doc-tracker-ae6fc.appspot.com",
  messagingSenderId: "92122225113",
  appId: "1:92122225113:web:6c385107a5fde11f1f21c8",
  measurementId: "G-0KB28YKCMY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
