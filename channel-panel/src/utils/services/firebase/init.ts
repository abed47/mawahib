// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1ZeEmh5nVGfu5gSP9GcIlIh5EiJLIBjc",
  authDomain: "mawahib-338601.firebaseapp.com",
  projectId: "mawahib-338601",
  storageBucket: "mawahib-338601.appspot.com",
  messagingSenderId: "607293539045",
  appId: "1:607293539045:web:6512be5800564a8c3f0a0c",
  measurementId: "G-941RW0XRJR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);

export {
    app,
    // analytics,
    auth
}