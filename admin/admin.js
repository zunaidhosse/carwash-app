let users = JSON.parse(localStorage.getItem("users") || "{}"); let washHistory = JSON.parse(localStorage.getItem("washHistory") || "[]");

function saveUsers() { localStorage.setItem("users", JSON.stringify(users)); }

function saveHistory() { localStorage.setItem("washHistory", JSON.stringify(washHistory)); }

function createUser() { const id = document.getElementById("newUserId").value.trim(); const name = document.getElementById("newUserName").value.trim(); const vehicle = document.getElementById("vehicleType").value; const message = document.getElementById("userMessage").value.trim();

if (!id || !name) { alert("Please enter both User ID and User Name."); return; }

if (users[id]) { alert("User ID already exists!"); return; }

users[id] = { name, count: 0, vehicle, message }; saveUsers(); renderUsers();

document.getElementById("newUserId").value = ""; document.getElementById("newUserName").value = ""; document.getElementById("userMessage").value = ""; }

function incrementWash(id) { users[id].count += 1; washHistory.push({ id, date: new Date().toLocaleString() });

saveUsers(); saveHistory(); renderUsers(); renderLeaderboard(); renderTopCar(); }

function deleteUser(id) { if (confirm("Are you sure you want to delete this user?")) { delete users[id]; saveUsers(); renderUsers(); renderLeaderboard(); renderTopCar(); } }

function showHistory(id) { const modal = document.getElementById("historyModal"); const list = document.getElementById("historyList"); list.innerHTML = "";

const history = washHistory.filter(h => h.id === id);

if (history.length === 0) { list.innerHTML = "<li>No wash history.</li>"; } else { history.forEach(h => { const li = document.createElement("li"); li.textContent = h.date; list.appendChild(li); }); }

modal.style.display = "block"; }

document.getElementById("closeModal").onclick = () => { document.getElementById("historyModal").style.display = "none"; };

function renderUsers() { const list = document.getElementById("usersList"); const filter = document.getElementById("searchBox").value.toLowerCase(); list.innerHTML = "";

for (const id in users) { if (id.toLowerCase().includes(filter) || users[id].name.toLowerCase().includes(filter)) { const user = users[id]; const div = document.createElement("div"); div.className = "user-card"; div.innerHTML = <strong>${user.name}</strong> (ID: ${id})<br/> Vehicle: ${user.vehicle}<br/> Wash Count: ${user.count} <br/> Message: ${user.message || "-"}<br/> <div class="flex"> <button onclick="incrementWash('${id}')">+1 Wash</button> <button onclick="showHistory('${id}')">History</button> <button onclick="deleteUser('${id}')">Delete</button> </div>; list.appendChild(div); } } }

function renderTopCar() { const carCount = {}; for (const id in users) { const car = users[id].vehicle; carCount[car] = (carCount[car] || 0) + users[id].count; } let top = Object.entries(carCount).sort((a, b) => b[1] - a[1])[0]; document.getElementById("topCar").innerText = top ? Top Car: ${top[0]} (${top[1]} washes) : ""; }

function renderLeaderboard() { const sorted = Object.entries(users).sort((a, b) => b[1].count - a[1].count); const leaderboard = document.getElementById("leaderboardList"); leaderboard.innerHTML = ""; sorted.slice(0, 5).forEach(([id, user], index) => { const li = document.createElement("li"); li.innerHTML = #${index + 1} ${user.name} (${user.vehicle}) - ${user.count}; leaderboard.appendChild(li); }); }

renderUsers(); renderTopCar(); renderLeaderboard();

