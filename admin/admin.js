let users = JSON.parse(localStorage.getItem("users") || "{}");
let washHistory = JSON.parse(localStorage.getItem("washHistory") || "{}");

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

function saveHistory() {
  localStorage.setItem("washHistory", JSON.stringify(washHistory));
}

function createUser() {
  const id = document.getElementById("newUserId").value.trim();
  const name = document.getElementById("newUserName").value.trim();
  const vehicle = document.getElementById("vehicleType").value;

  if (!id || !name) return alert("Please enter both User ID and User Name.");
  if (users[id]) return alert("User ID already exists!");

  users[id] = { name, count: 0, vehicle };
  washHistory[id] = [];
  saveUsers();
  saveHistory();
  renderUsers();

  document.getElementById("newUserId").value = "";
  document.getElementById("newUserName").value = "";
}

function incrementWash(id) {
  users[id].count += 1;
  const now = new Date().toLocaleString();
  washHistory[id].push(now);
  saveUsers();
  saveHistory();
  renderUsers();
}

function deleteUser(id) {
  if (confirm("Delete this user?")) {
    delete users[id];
    delete washHistory[id];
    saveUsers();
    saveHistory();
    renderUsers();
  }
}

function viewHistory(id) {
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  (washHistory[id] || []).forEach(date => {
    const li = document.createElement("li");
    li.textContent = date;
    list.appendChild(li);
  });
  document.getElementById("historyModal").style.display = "flex";
}

function closeHistory() {
  document.getElementById("historyModal").style.display = "none";
}

function renderUsers() {
  const list = document.getElementById("usersList");
  const filter = document.getElementById("searchBox").value.toLowerCase();
  list.innerHTML = "";

  const sorted = Object.entries(users).sort((a, b) => b[1].count - a[1].count);
  if (sorted.length > 0) {
    const top = sorted[0][1];
    document.getElementById("topCar").innerHTML = `🏆 Top Car: ${top.vehicle} (${top.count} washes)`;
  }

  let leaderboardHTML = `<h3>🏅 Leaderboard</h3><ol>`;
  sorted.slice(0, 5).forEach(([id, user]) => {
    leaderboardHTML += `<li>${user.name} - ${user.count} washes (${user.vehicle})</li>`;
  });
  leaderboardHTML += `</ol>`;
  document.getElementById("leaderboard").innerHTML = leaderboardHTML;

  for (const id in users) {
    const user = users[id];
    if (id.toLowerCase().includes(filter) || user.name.toLowerCase().includes(filter)) {
      const div = document.createElement("div");
      div.className = "user-card";
      div.innerHTML = `
        <strong>${user.name}</strong> (ID: ${id})<br/>
        Vehicle: ${user.vehicle}<br/>
        Wash Count: ${user.count}<br/>
        <div class="flex">
          <button onclick="incrementWash('${id}')">+1 Wash</button>
          <button onclick="viewHistory('${id}')">View History</button>
          <button onclick="deleteUser('${id}')">Delete</button>
        </div>
      `;
      list.appendChild(div);
    }
  }
}

renderUsers();
