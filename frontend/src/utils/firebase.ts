import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwHgMGIQ0GqXNjVrLUiGlnW7xPYHFl0t0",
  authDomain: "prospectpulse-3021b.firebaseapp.com",
  projectId: "prospectpulse-3021b",
  storageBucket: "prospectpulse-3021b.appspot.com",
  messagingSenderId: "507069909433",
  appId: "1:507069909433:web:dbcd98923c81b1aaefcaf2"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export { firebaseApp, firebaseAuth, db };
