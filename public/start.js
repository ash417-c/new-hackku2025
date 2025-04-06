import { WorkoutLog } from './workoutlog.js';

import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js';
import { collection, doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js';

import { db, auth } from './firebase.js';


onAuthStateChanged(auth, async (user) => {
  if (user) {
      console.log('User is signed in:', user);

      // Get the workout ID from the URL query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const workoutId = urlParams.get('workoutId');
      console.log('Workout ID from URL:', workoutId);

      if (workoutId) {
          // Fetch and display the workout details
          await fetchAndDisplayWorkout(user.uid, workoutId);
      } else {
          alert('No workout ID found in the URL.');
      }
  } else {
      console.log('No user is signed in.');
      alert('You must be signed in to view this page.');
      // Redirect to the signin page
      window.location.href = 'signin.html';
  }
});

async function fetchAndDisplayWorkout(userId, workoutId) {
  console.log('Fetching workout with userId:', userId, 'and workoutId:', workoutId);

  try {
    // Fetch the workout document from Firestore
    const workoutDoc = await getDoc(doc(db, `users/${userId}/workouts/${workoutId}`));

        if (workoutDoc.exists()) {
            console.log('Workout found:', workoutDoc.data());
            const workout = workoutDoc.data();

            // Update the workout name
            const workoutNameElement = document.getElementById('workoutName');
            if (!workoutNameElement) {
                console.error('Element with ID "workoutName" not found in the DOM.');
                return;
            }
            workoutNameElement.textContent = workout.name;

            // Populate the exercise list
            const exerciseList = document.getElementById('exerciseList');
            if (!exerciseList) {
                console.error('Element with ID "exerciseList" not found in the DOM.');
                return;
            }
            exerciseList.innerHTML = ''; // Clear any existing content

            workout.exercises.forEach((exercise) => {
                const exerciseItem = document.createElement('div');
                exerciseItem.classList.add('exercise-item');
                exerciseItem.innerHTML = `
                    <h3>${exercise.name}</h3>
                    <p>Sets: ${exercise.sets}</p>
                    <p>Weight: ${exercise.weight} lbs</p>
                `;
                exerciseList.appendChild(exerciseItem);
            });


            // Populate the rating and notes fields
            document.getElementById('rating').value = workout.rating || 0; // Default to 0 if not set
            document.getElementById('notes').value = workout.notes || ''; // Default to empty string if not set
        } else {
            console.error('Workout not found in Firestore.');
            alert('Workout not found.');
        }
    } catch (error) {
        console.error('Error fetching workout:', error);
        alert('Failed to load workout. Please try again later.');
    }
}

async function saveWorkoutDetails(userId, workoutId) {
  const rating = parseInt(document.getElementById('rating').value, 10);
  const notes = document.getElementById('notes').value;


  try {
      // Update the workout document in Firestore
      const workoutRef = doc(db, `users/${userId}/workouts/${workoutId}`);
      await updateDoc(workoutRef, {
          rating: rating,
          notes: notes
      });

      alert('Workout details saved successfully!');
  } catch (error) {
      console.error('Error saving workout details:', error);
      alert('Failed to save workout details. Please try again.');
  }
}

function saveWorkout() {
  const user = auth.currentUser; // Get the currently signed-in user
  console.log('User object in saveWorkout:', user);

  const urlParams = new URLSearchParams(window.location.search);
  const workoutId = urlParams.get('workoutId');

  if (!user) {
      alert('You must be logged in to save workout details.');
      return;
  }

  if (!workoutId) {
      alert('No workout ID found in the URL.');
      return;
  }

  saveWorkoutDetails(user.uid, workoutId);
}

window.saveWorkout = saveWorkout;