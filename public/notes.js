import { auth, db } from './firebase.js';
import { collection, onSnapshot, deleteDoc, addDoc, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js';

async function saveNote() {
    const user = auth.currentUser; // Get the currently signed-in user
    if (!user) {
        alert('You must be signed in to save notes.');
        return;
    }

    const noteText = document.getElementById('notes').value.trim(); // Use the correct ID
    if (!noteText) {
        alert('Please enter a note before saving.');
        return;
    }

    try {
        // Add the note to Firestore under users/{uid}/notes/
        const notesCollectionRef = collection(db, `users/${user.uid}/notes`);
        await addDoc(notesCollectionRef, {
            text: noteText,
            timestamp: new Date().toISOString()
        });

        alert('Note saved successfully!');
        document.getElementById('notes').value = ''; // Clear the textarea
    } catch (error) {
        console.error('Error saving note:', error);
        alert('Failed to save note. Please try again.');
    }
}

function loadNotes() {
    const user = auth.currentUser; // Get the currently signed-in user
    if (!user) {
        console.error('User is not signed in.');
        return;
    }

    const notesCollectionRef = collection(db, `users/${user.uid}/notes`);
    const savedNotesList = document.getElementById('savedNotesList');

    // Listen for changes in the notes collection
    onSnapshot(notesCollectionRef, (snapshot) => {
        savedNotesList.innerHTML = ''; // Clear the list

        if (snapshot.empty) {
            savedNotesList.innerHTML = '<li>No notes found.</li>';
            return;
        }

        snapshot.forEach((docSnapshot) => {
            const note = docSnapshot.data();
            console.log('Document ID:', docSnapshot.id); // Debugging: Log the document ID
            const listItem = document.createElement('li');
            listItem.textContent = `${note.text} (Saved on: ${new Date(note.timestamp).toLocaleString()})`;
            listItem.classList.add('note-item');

            // Add a click event listener to delete the note
            listItem.addEventListener('click', async () => {
                const confirmDelete = confirm('Are you sure you want to delete this note?');
                if (confirmDelete) {
                    try {
                        console.log(`Deleting note at path: users/${user.uid}/notes/${docSnapshot.id}`); // Debugging: Log the path
                        await deleteDoc(doc(db, `users/${user.uid}/notes/${docSnapshot.id}`));
                        alert('Note deleted successfully!');
                    } catch (error) {
                        console.error('Error deleting note:', error);
                        alert('Failed to delete note. Please try again.');
                    }
                }
            });

            savedNotesList.appendChild(listItem);
        });
    });
}

// Automatically load notes when the page loads
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User is signed in:', user);
        loadNotes();
    } else {
        console.error('No user is signed in.');
        alert('You must be signed in to view your notes.');
        window.location.href = 'signin.html';
    }
});

export { loadNotes, saveNote };