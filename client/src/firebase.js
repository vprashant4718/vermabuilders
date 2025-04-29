// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// import dotenv from 'dotenv';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "mernestate-44810.firebaseapp.com",
  projectId: "mernestate-44810",
  storageBucket: "mernestate-44810.appspot.com",
  messagingSenderId: "42139912956",
  appId: "1:42139912956:web:de545fc82cee7510b2e579"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);