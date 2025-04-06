import { auth } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js';

// Listen for changes in auth
const userPanel = document.getElementById("user-panel");

function toggleUserPanel() {
  userPanel.classList.toggle("hidden");
}

// To update user details
function updateUserInfo(name, email) {
  document.getElementById("user-name").textContent = `Name: ${name}`;
  document.getElementById("user-email").textContent = `Email: ${email}`;
}

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User logged in');
    toggleUserPanel();
    updateUserInfo(user.displayName || 'Anonymous', user.email);
  } else {
    console.log('User logged out');
    toggleUserPanel();
    updateUserInfo('Guest', 'Not logged in');
  }
});

// Signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // Sign up the user
  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      document.getElementById("signin-confirm").textContent = "New account created";
      signupForm.reset();
    })
    .catch((error) => {
      console.error('Error signing up:', error.message);
    });
});

// Logout
const logout = document.querySelector('#btnLogout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  signOut(auth)
    .then(() => {
      document.getElementById("logout-confirm").textContent = "Signed out";
    })
    .catch((error) => {
      console.error('Error signing out:', error.message);
    });
});

// Login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // Log in the user
  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      document.getElementById("login-confirm").textContent = "Signed in";
      loginForm.reset();
    })
    .catch((error) => {
      console.error('Error signing in:', error.message);
    });
});