let users = JSON.parse(localStorage.getItem("users") || "{}");

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

function createUser() {
  const id = document.getElementById("newUserId").value.trim();
  const name = document.getElementById("newUserName").value.trim();
  if (!id || !name) return alert("Enter ID and Name");

  if (users[id]) {
    alert("User ID already exists!");
    return;
  }

  users[id] = { name: name, count: 0, message: "" };
  saveUsers();
  renderUsers();

  document.getElementById("newUserId").value = "";
  document.getElementById("newUserName").value = "";
}

function deleteUser(id) {
  if (confirm("Delete user?")) {
    delete users[id];
    saveUsers();
    renderUsers();
  }
}

function incrementWash(id) {
  users[id].count += 1;
  if (users[id].count > 5) users[id].count = 1;
  saveUsers();
  renderUsers();
}

function sendToOne(id) {
  const msg = prompt("Enter message for this user:");
  if (msg !== null) {
    users[id].message = msg;
    saveUsers();
  }
}

function sendToAll() {
  const msg = document.getElementById("broadcastMsg").value;
  if (!msg) return;

  for (let id in users) {
    users[id].message = msg;
  }

  document.getElementById("broadcastMsg").value = "";
  saveUsers();
  alert("Message sent to all users.");
}

function renderUsers() {
  const list = document.getElementById("usersList");
  const filter = document.getElementById("searchBox").value.toLowerCase();
  list.innerHTML = "";

  for (const id in users) {
    const user = users[id];
    if (id.toLowerCase().includes(filter) || user.name.toLowerCase().includes(filter)) {
      const div = document.createElement("div");
      div.className = "user-card";
      div.innerHTML = `
        <strong>${user.name}</strong> (ID: ${id})<br>
        Wash Count: ${user.count}<br>
        <button onclick="incrementWash('${id}')">+1 Wash</button>
        <button onclick="sendToOne('${id}')">Send Message</button>
        <button onclick="deleteUser('${id}')">Delete</button>
      `;
      list.appendChild(div);
    }
  }
}

window.onload = renderUsers;nerHTML = `
    <strong>${user.name}</strong> (${id})<br>
    Washes: ${user.washes} <button onclick="addWash('${id}')">+1</button>
    <button onclick="sendToOne('${id}')">Msg</button>
    <button onclick="deleteUser('${id}')">🗑</button>
  `;
  document.getElementById("user-list").appendChild(div);
}

function loadUsers() {
  document.getElementById("user-list").innerHTML = "";
  const users = getUsers();
  for (const id in users) {
    renderUser(id, users[id]);
  }
}
