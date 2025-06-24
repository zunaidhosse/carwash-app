// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";

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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
