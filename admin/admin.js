// admin.js
import { db, ref, set, onValue, remove, update, serverTimestamp } from './firebase.js';

let allUsers = {}; // Global variable to hold all users from Firebase

// Listen for real-time updates from Firebase
const usersRef = ref(db, 'users/');
onValue(usersRef, (snapshot) => {
  const data = snapshot.val();
  allUsers = data || {}; // If no data, use an empty object
  renderUsers(); // Re-render the list whenever data changes
});

function renderUsers() {
  const list = document.getElementById("usersList");
  const filter = document.getElementById("searchBox").value.toLowerCase();
  list.innerHTML = "";

  // Get user IDs, sort them by creation time (newest first)
  const sortedUserIds = Object.keys(allUsers).sort((a, b) => {
    return allUsers[b].createdAt - allUsers[a].createdAt;
  });

  for (const id of sortedUserIds) {
    const user = allUsers[id];
    if (id.toLowerCase().includes(filter) || user.name.toLowerCase().includes(filter)) {
      const div = document.createElement("div");
      div.className = "user-card";

      const progress = ((user.count || 0) / 5) * 100;

      div.innerHTML = `
        <strong>${user.name}</strong> (ID: ${id})<br/>
        Car: ${user.car || "🚗"}<br/>
        Wash Count: ${user.count || 0}
        <div class="progress-bar"><div class="progress-fill" style="width: ${progress}%"></div></div>
        <div class="flex">
          <button onclick="incrementWash('${id}')">+1 Wash</button>
          <button onclick="deleteUser('${id}')">Delete</button>
        </div>
      `;

      list.appendChild(div);
    }
  }
}

async function createUser() {
  const id = document.getElementById("newUserId").value.trim();
  const name = document.getElementById("newUserName").value.trim();
  const car = document.getElementById("newUserCar").value;

  if (!id || !name) {
    alert("Please enter both User ID and User Name.");
    return;
  }

  if (allUsers[id]) {
    alert("User ID already exists!");
    return;
  }

  try {
    // Set data in Firebase
    await set(ref(db, 'users/' + id), {
      name: name,
      car: car,
      count: 0,
      createdAt: serverTimestamp() // To sort by creation time
    });
    
    // Clear input fields
    document.getElementById("newUserId").value = "";
    document.getElementById("newUserName").value = "";
    
    // The onValue listener will automatically re-render the list
  } catch (error) {
    console.error("Error creating user: ", error);
    alert("Failed to create user.");
  }
}

async function incrementWash(id) {
  const newCount = ((allUsers[id].count || 0) % 5) + 1;
  try {
    // Update the count in Firebase
    await update(ref(db, 'users/' + id), {
      count: newCount
    });
    // The onValue listener will automatically re-render
  } catch (error) {
    console.error("Error updating wash count: ", error);
    alert("Failed to update wash count.");
  }
}

async function deleteUser(id) {
  if (confirm("Are you sure you want to delete this user?")) {
    try {
      // Remove the user from Firebase
      await remove(ref(db, 'users/'' + id));
      // The onValue listener will automatically re-render
    } catch (error) {
      console.error("Error deleting user: ", error);
      alert("Failed to delete user.");
    }
  }
}

// Make functions globally accessible for onclick handlers
window.createUser = createUser;
window.incrementWash = incrementWash;
window.deleteUser = deleteUser;
window.renderUsers = renderUsers; // for oninput search
