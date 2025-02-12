// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAII9kP0k8ojm_9sbhNKqIXk7QKtpS1haI",
  authDomain: "get-everything-4b5bf.firebaseapp.com",
  projectId: "get-everything-4b5bf",
  storageBucket: "get-everything-4b5bf.firebasestorage.app",
  messagingSenderId: "935272283194",
  appId: "1:935272283194:web:0aa593ec7dfde774784903",
  measurementId: "G-3JH52HN6NZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
const analytics = getAnalytics(app);
export default app;
