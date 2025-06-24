import { app } from "./firebase.js";
import {
  getDatabase,
  ref,
  set,
  update,
  remove,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const db = getDatabase(app);

function createUser() {
  const id = document.getElementById("newUserId").value.trim();
  const name = document.getElementById("newUserName").value.trim();
  const car = document.getElementById("newUserCar").value;

  if (!id || !name) {
    alert("Please enter both User ID and User Name.");
    return;
  }

  const userRef = ref(db, "users/" + id);

  // Check if user exists
  onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      alert("User ID already exists!");
    } else {
      set(userRef, {
        name,
        count: 0,
        car,
        createdAt: Date.now()
      });

      document.getElementById("newUserId").value = "";
      document.getElementById("newUserName").value = "";
    }
  }, {
    onlyOnce: true
  });
}

function incrementWash(id) {
  const userRef = ref(db, "users/" + id);
  onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const newCount = (data.count % 5) + 1;
      update(userRef, { count: newCount });
    }
  }, {
    onlyOnce: true
  });
}

function deleteUser(id) {
  if (confirm("Are you sure you want to delete this user?")) {
    const userRef = ref(db, "users/" + id);
    remove(userRef);
  }
}

function renderUsers() {
  const list = document.getElementById("usersList");
  const filter = document.getElementById("searchBox").value.toLowerCase();
  list.innerHTML = "";

  const usersRef = ref(db, "users/");
  onValue(usersRef, (snapshot) => {
    const users = snapshot.val();
    if (users) {
      // Order by createdAt descending
      const sorted = Object.entries(users).sort(
        (a, b) => b[1].createdAt - a[1].createdAt
      );

      for (const [id, user] of sorted) {
        if (
          id.toLowerCase().includes(filter) ||
          user.name.toLowerCase().includes(filter)
        ) {
          const div = document.createElement("div");
          div.className = "user-card";

          const progress = (user.count / 5) * 100;

          div.innerHTML = `
            <strong>${user.name}</strong> (ID: ${id})<br/>
            Car: ${user.car || "🚗"}<br/>
            Wash Count: ${user.count}
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
  });
}

// Real-time rendering
document.getElementById("searchBox").addEventListener("input", renderUsers);

renderUsers();

// Expose functions to window
window.createUser = createUser;
window.incrementWash = incrementWash;
window.deleteUser = deleteUser;
