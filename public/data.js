import { db } from './firebase.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js';

const workoutList = document.querySelector('.workouts');

// Use the modular Firestore API
const fetchWorkouts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'workouts'));
        querySnapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
        });
    } catch (error) {
        console.error('Error fetching workouts:', error);
    }
};

fetchWorkouts();

// To update index.html
function updateUserInfo(name, name2, name3) {
    document.getElementById("index-1").textContent = `: ${name}`;
    document.getElementById("index-2").textContent = `: ${name2}`;
    document.getElementById("index-3").textContent = `: ${name3}`;
}