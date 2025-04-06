import { Exercise } from './exercise.js';
import { Workouts } from './workout.js';
import { WorkoutLog } from './workoutlog.js';
import { db, auth } from './firebase.js';
import { collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js';
import { loadNotes, saveNote } from './notes.js'; // Adjust the path if needed


const workoutList = new Workouts();

function generateExerciseInputs() {
    const numExercises = parseInt(document.getElementById('numExercises').value, 10);
    const exerciseInputsContainer = document.getElementById('exerciseInputsContainer');
    const addWorkoutButton = document.getElementById('add_workout_button');
  
    // Clear any existing inputs
    exerciseInputsContainer.innerHTML = '';
  
    if (isNaN(numExercises) || numExercises < 1) {
      alert('Please enter a valid number of exercises.');
      return;
    }
  
    // Generate input fields for each exercise
    for (let i = 0; i < numExercises; i++) {
      const exerciseDiv = document.createElement('div');
      exerciseDiv.classList.add('exercise-input');
  
      exerciseDiv.innerHTML = `
        <br>
        <h4>Exercise ${i + 1}</h4>
        <label for="exerciseName${i}">Exercise Name:</label>
        <input type="text" id="exerciseName${i}" name="exerciseName${i}" placeholder="e.g., Bench Press" required>
        <br>
        <label for="sets${i}">Number of Sets:</label>
        <input type="number" id="sets${i}" name="sets${i}" min="1" placeholder="e.g., 3" required>
        <br>
        <label for="weight${i}">Weight (lbs):</label>
        <input type="number" id="weight${i}" name="weight${i}" min="0" placeholder="e.g., 100" required>
        <br>
      `;
  
      exerciseInputsContainer.appendChild(exerciseDiv);
    }
  
    // Show the "Add Workout" button
    addWorkoutButton.style.display = 'block';
}
async function addWorkoutToStart(){
    const user = auth.currentUser; // Get the currently logged-in user


    const workoutName = document.getElementById('workoutName').value;
    const numExercises = parseInt(document.getElementById('numExercises').value, 10)
    const exercises = [];
    if(!workoutName) {
        alert('Please enter a workout name.');
        return;
    }
    for(let i=0; i<numExercises; i++) {
        const exerciseName = document.getElementById(`exerciseName${i}`).value;
        const sets = parseInt(document.getElementById(`sets${i}`).value,10);
        const weight = parseInt(document.getElementById(`weight${i}`).value,10);
        
        if (!exerciseName || isNaN(sets) || isNaN(weight)) {
            alert(`Please fill in all fields for Exercise ${i+1}.`);
            return;
        }
        const newExercise = new Exercise(exerciseName, sets, weight);
        exercises.push(newExercise); // Add the new exercise to the workouts array
    }


    workoutList.addWorkout({name: workoutName, exercises}); // Add the new exercise to the workouts array
    localStorage.setItem('workoutList', JSON.stringify(workoutList.getWorkout()));

    const workout = {
        name: workoutName,
        exercises: exercises.map(exercise => ({
            name: exercise.name,
            sets: exercise.sets,
            weight: exercise.weight
        })),
        createdAt: new Date().toISOString(), // Store the creation date
        date: new Date().toISOString(), // Store the workout date
        rating: 0, // Default rating
        notes: ''  // Default notes
    };

    try {
        // Add the workout under the user's `uid` in Firestore
        const docRef = await addDoc(collection(db, `users/${user.uid}/workouts`), workout);
        console.log(`Workout "${workoutName}" added to Firestore with ID: ${docRef.id}`);
        alert(`Workout "${workoutName}" added successfully!`);
    } catch (error) {
        console.error('Error adding workout to Firestore:', error);
        alert('Failed to add workout. Please try again.');
    }
    
    updateStartWorkoutDropdown();

    // Clear the form
    document.getElementById('workoutForm').reset();
    document.getElementById('exerciseInputsContainer').innerHTML = '';
    document.getElementById('add_workout_button').style.display = 'none';
    alert(`Workout "${workoutName}" added successfully!`);

}
function toggleDropdown() {
    const dropdownMenu = document.getElementById('dropdownMenu');
    // const subsectionContainer = document.getElementById('subsectionContainer');

    if (dropdownMenu.style.display === 'none') {
      dropdownMenu.style.display = 'block';
    //   subsectionContainer.classList.add('expanded');
    } else {
      dropdownMenu.style.display = 'none';
    //   subsectionContainer.classList.remove('expanded');
    }
  }

  document.getElementById('workoutForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const workoutName = document.getElementById('workoutName').value;
    const numExercises = parseInt(document.getElementById('numExercises').value, 10);
    const exercises = [];
    if(!workoutName) {
        alert('Please enter a workout name.');
        return;
    }
    for(let i=0; i<numExercises; i++) {

        const exerciseName = document.getElementById('exerciseName').value;
        const sets = parseInt(document.getElementById('sets').value,10);
        const weight = parseInt(document.getElementById('weight').value,10);
        
        if (!exerciseName || isNaN(sets) || isNaN(weight)) {
            alert('Please fill in all fields for each exercise.');
            return;
        }
        const newExercise = new Exercise(exerciseName, sets, weight);
        exercises.push(newExercise); // Add the new exercise to the workouts array
    }
    workoutList.addWorkout({name: workoutName, exercises}); // Add the new exercise to the workouts array

    updateStartWorkoutDropdown();

    // Clear the form
    event.target.reset();
    document.getElementById('exerciseInputsContainer').innerHTML = '';
    document.querySelector('.add_workout_button').style.display = 'none';
  
    alert(`Workout "${workoutName}" added successfully!`);
  });
  
function updateStartWorkoutDropdown() {
    const startWorkoutList = document.getElementById('startWorkoutList');
  
    // Clear the existing list
    startWorkoutList.innerHTML = '';
  
    // Add each workout to the "Start Workout" dropdown
    workoutList.getWorkout().forEach((workout, workoutIndex) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.textContent = workout.name; // Display the workout name
      link.href = `start.html?index=${workoutIndex}`; // Link to a new page with the workout index
      li.appendChild(link);
      startWorkoutList.appendChild(li);
    });
  }
function deleteWorkout(index) {
    workouts.splice(index, 1); // Remove the exercise from the workouts array
    updateWorkoutList(); // Update the displayed list
}
function togglePreExistingDropdown() {
    const preExistingDropdown = document.getElementById('preExistingDropdown');
    // const preExistingContainer = document.getElementById('preExistingContainer');
  
    if (preExistingDropdown.style.display === 'none') {
      preExistingDropdown.style.display = 'block';
    //   preExistingContainer.classList.add('expanded');
    } else {
      preExistingDropdown.style.display = 'none';
    //   preExistingContainer.classList.remove('expanded');
    }
  }

function toggleStartDropdown() {
    const startDropdown = document.getElementById('startDropdown');
    // const startContainer = document.getElementById('startContainer');
  
    if (startDropdown.style.display === 'none') {
      startDropdown.style.display = 'block';
    //   startContainer.classList.add('expanded');
    } else {
      startDropdown.style.display = 'none';
    //   startContainer.classList.remove('expanded');
    }
} 
function toggleWorkoutLogsDropdown() {
    const workoutLogsDropdown = document.getElementById('workoutLogsDropdown');
    if (workoutLogsDropdown.style.display === 'none' || workoutLogsDropdown.style.display === '') {
      workoutLogsDropdown.style.display = 'block';
      displayWorkoutLogs(); // Populate the logs when the dropdown is opened
    } else {
      workoutLogsDropdown.style.display = 'none';
    }
  }
  
  function displayWorkoutLogs() {
    const workoutLogs = JSON.parse(localStorage.getItem('workoutLogs')) || [];
    const workoutLogList = document.getElementById('workoutLogList');
  
    // Clear the existing list
    workoutLogList.innerHTML = '';
  
    // Populate the workout logs
    workoutLogs.forEach((log, index) => {
      const logItem = document.createElement('li');
      logItem.classList.add('workout-log-item');
  
      // Create a string for the exercises
      const exercisesDetails = log.workout
        .map(
          (exercise) =>
            `<li>${exercise.name}: ${exercise.sets} sets, ${exercise.weight} lbs</li>`
        )
        .join('');
  
      logItem.innerHTML = `
        <div class="log-container">
          <h3>${log.name}</h3>
          <p><strong>Date:</strong> ${new Date(log.date).toLocaleString()}</p>
          <p><strong>Rating:</strong> ${log.rating || 'N/A'}</p>
          <p><strong>Notes:</strong> ${log.notes || 'No notes added'}</p>
          <p><strong>Exercises:</strong></p>
          <ul>${exercisesDetails}</ul>
          <button class="delete-log-button" data-index="${index}">Delete</button>
        </div>
      `;
  
      workoutLogList.appendChild(logItem);
    });
  
    // Add event listeners to delete buttons
    const deleteButtons = document.querySelectorAll('.delete-log-button');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const logIndex = parseInt(event.target.getAttribute('data-index'), 10);
        deleteWorkoutLog(logIndex);
      });
    });
  }
  
  function deleteWorkoutLog(index) {
    const workoutLogs = JSON.parse(localStorage.getItem('workoutLogs')) || [];
    workoutLogs.splice(index, 1); // Remove the log at the specified index
    localStorage.setItem('workoutLogs', JSON.stringify(workoutLogs)); // Save the updated logs back to localStorage
    displayWorkoutLogs(); // Refresh the displayed logs
  }

function startWorkout(workout) {
  alert(`Starting workout: ${workout.name}`);
  console.log('Workout details:', workout);
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is signed in:', user);
        loadNotes(); // Load notes for the signed-in user
        fetchAndDisplayWorkouts(user); // Fetch workouts for the signed-in user
    } else {
        console.log('No user is signed in.');
        alert('You must be signed in to view your workouts.');
        // Optionally redirect to the signin page
        window.location.href = 'signin.html';
    }
});


async function fetchAndDisplayWorkouts(user) {


  const startWorkoutList = document.getElementById('startWorkoutList');
  startWorkoutList.innerHTML = ''; // Clear the list before populating

  try {
      // Fetch workouts from the current user's subcollection
      const querySnapshot = await getDocs(collection(db, `users/${user.uid}/workouts`));

      // Check if there are any workouts
      if (querySnapshot.empty) {
          startWorkoutList.innerHTML = '<li>No workouts found.</li>';
          return;
      }

      // Iterate through the workouts and add them to the list
      querySnapshot.forEach((doc) => {
          const workout = doc.data();
          const listItem = document.createElement('li');
          listItem.classList.add('workout-item');

          // Make the workout name a clickable link
          const workoutLink = document.createElement('a');
          workoutLink.textContent = workout.name; // Display the workout name
          workoutLink.href = `start.html?workoutId=${doc.id}`; // Pass the workout ID as a query parameter
          workoutLink.classList.add('workout-link');

          listItem.appendChild(workoutLink);
          startWorkoutList.appendChild(listItem);
      });
  } catch (error) {
      console.error('Error fetching workouts:', error);
      startWorkoutList.innerHTML = '<li>Error loading workouts. Please try again later.</li>';
  }
}


window.saveNote = saveNote;
window.loadNotes = loadNotes; // Make loadNotes function available globally
console.log('Defining toggleDropdown...');
window.toggleDropdown = toggleDropdown;
console.log('toggleDropdown attached to window:', window.toggleDropdown);
window.toggleWorkoutLogsDropdown = toggleWorkoutLogsDropdown;
window.togglePreExistingDropdown = togglePreExistingDropdown;
window.toggleStartDropdown = toggleStartDropdown;
window.Exercise = Exercise; // Make Exercise class available globally
window.Workouts = Workouts; // Make Workouts class available globally
window.generateExerciseInputs = generateExerciseInputs;
window.addWorkoutToStart = addWorkoutToStart;
window.displayWorkoutLogs = displayWorkoutLogs;