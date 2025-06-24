// firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { 
  getDatabase, 
  ref, 
  set, 
  get, 
  onValue, 
  remove, 
  update, 
  serverTimestamp,
  child
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKXXxw_K4nZyczAm9DrU5pCkP7YmOETFc",
  authDomain: "tast-2f7bf.firebaseapp.com",
  databaseURL: "https://tast-2f7bf-default-rtdb.firebaseio.com",
  projectId: "tast-2f7bf",
  storageBucket: "tast-2f7bf.firebasestorage.app",
  messagingSenderId: "848111042845",
  appId: "1:848111042845:web:7a65cdd7360974faefe1f4",
  measurementId: "G-BBQ6L0CK5L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Export the necessary Firebase functions and objects
export { db, ref, set, get, onValue, remove, update, serverTimestamp, child };
