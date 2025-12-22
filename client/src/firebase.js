// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "healthbridge-457c5.firebaseapp.com",
  projectId: "healthbridge-457c5",
  storageBucket: "healthbridge-457c5.firebasestorage.app",
  messagingSenderId: "599964130654",
  appId: "1:599964130654:web:763fc5c91b7e929e98c3cf"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);