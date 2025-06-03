let users = JSON.parse(localStorage.getItem("users") || "{}");

function saveUsers() { localStorage.setItem("users", JSON.stringify(users)); }

function createUser() { const id = document.getElementById("newUserId").value.trim(); const name = document.getElementById("newUserName").value.trim(); const car = document.getElementById("newUserCar").value;

if (!id || !name) { alert("Please enter both User ID and User Name."); return; }

if (users[id]) { alert("User ID already exists!"); return; }

users[id] = { name, count: 0, car, history: [] };

saveUsers(); renderUsers();

document.getElementById("newUserId").value = ""; document.getElementById("newUserName").value = ""; document.getElementById("newUserCar").value = "🚗"; }

function incrementWash(id) { const user = users[id]; user.count += 1; user.history.push(new Date().toLocaleString()); saveUsers(); renderUsers(); }

function deleteUser(id) { if (confirm("Are you sure you want to delete this user?")) { delete users[id]; saveUsers(); renderUsers(); } }

function showHistory(id) { const user = users[id]; alert("Wash History for " + user.name + ":\n" + user.history.join("\n")); }

function renderUsers() { const list = document.getElementById("usersList"); const filter = document.getElementById("searchBox").value.toLowerCase(); list.innerHTML = "";

// Leaderboard calculation const topCars = {}; for (const id in users) { const car = users[id].car || "🚗"; topCars[car] = (topCars[car] || 0) + users[id].count; }

const sortedUsers = Object.entries(users).sort((a, b) => b[1].count - a[1].count);

for (const [id, user] of sortedUsers) { if (id.toLowerCase().includes(filter) || user.name.toLowerCase().includes(filter)) { const div = document.createElement("div"); div.className = "user-card"; const bonus = Math.floor(user.count / 5);

div.innerHTML = `
    <strong>${user.name}</strong> (${id})<br/>
    Car: ${user.car}<br/>
    Wash Count: ${user.count} ${bonus > 0 ? `🎁 ${bonus} Free` : ""}<br/>
    <div class="flex">
      <button onclick="incrementWash('${id}')">+1 Wash</button>
      <button onclick="deleteUser('${id}')">Delete</button>
      <button onclick="showHistory('${id}')">🧾 History</button>
    </div>
  `;
  list.appendChild(div);
}

}

// Show top car stats at top const topCarDiv = document.getElementById("topCarStat"); if (topCarDiv) { const top = Object.entries(topCars).sort((a, b) => b[1] - a[1]); if (top.length > 0) { topCarDiv.innerHTML = <strong>🏆 Top Car:</strong> ${top[0][0]} (${top[0][1]} washes); } } }

// Initial render renderUsers();

