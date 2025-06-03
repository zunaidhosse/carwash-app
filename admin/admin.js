let users = JSON.parse(localStorage.getItem("users") || "{}");

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

function createUser() {
  const id = document.getElementById("newUserId").value.trim();
  const name = document.getElementById("newUserName").value.trim();
  if (id && name && !users[id]) {
    users[id] = { name, count: 0, message: "" };
    saveUsers();
    renderUsers();
    document.getElementById("newUserId").value = "";
    document.getElementById("newUserName").value = "";
  } else {
    alert("Invalid or duplicate user ID");
  }
}

function incrementWash(id) {
  users[id].count += 1;
  if (users[id].count > 5) users[id].count = 1;
  saveUsers();
  renderUsers();
}

function deleteUser(id) {
  if (confirm("Are you sure you want to delete this user?")) {
    delete users[id];
    saveUsers();
    renderUsers();
  }
}

function renderUsers() {
  const list = document.getElementById("usersList");
  const filter = document.getElementById("searchBox").value.toLowerCase();
  list.innerHTML = "";
  for (const id in users) {
    if (id.toLowerCase().includes(filter) || users[id].name.toLowerCase().includes(filter)) {
      const div = document.createElement("div");
      div.className = "user-card";
      div.innerHTML = `
        <strong>${users[id].name}</strong> (ID: ${id})<br/>
        Wash Count: ${users[id].count}<br/>
        <button onclick="incrementWash('${id}')">+1 Wash</button>
        <button onclick="deleteUser('${id}')">Delete</button>
      `;
      list.appendChild(div);
    }
  }
}

// Render on page load
renderUsers();
