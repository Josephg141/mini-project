// frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBUaHiSxJAkZPBnfBUgeBQ-Uuq9fCTgqd4",
  authDomain: "mini-webapp-demo.firebaseapp.com",
  projectId: "mini-webapp-demo",
  storageBucket: "mini-webapp-demo.firebasestorage.app",
  messagingSenderId: "473337397291",
  appId: "1:473337397291:web:439851ca1139135699ea6e",
  measurementId: "G-XVLD0N84RB"
};

const app = initializeApp(firebaseConfig);

// Export auth & Firestore to use anywhere
export const auth = getAuth(app);
export const db = getFirestore(app);
