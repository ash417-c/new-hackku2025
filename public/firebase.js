import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyAGWxEB4BQX5CpIDXE4VoBUsWdwKBzGlrc",
    authDomain: "worko-1e16b.firebaseapp.com",
    projectId: "worko-1e16b",
    storageBucket: "worko-1e16b.firebasestorage.app",
    messagingSenderId: "187937232614",
    appId: "1:187937232614:web:a93f10644c4ca735654d27",
    measurementId: "G-5LMX0WFKQJ"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Firestore database
const db = getFirestore(firebaseApp);

// Firebase Authentication
const auth = getAuth(firebaseApp);

export { db, auth };