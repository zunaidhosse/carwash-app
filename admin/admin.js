const password = "Zun64725800";
let users = JSON.parse(localStorage.getItem("users") || "{}");

function checkPassword() {
  const input = document.getElementById("adminPass").value;
  if (input === password) {
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("admin-section").classList.remove("hidden");
    renderUsers();
  } else {
    alert("Incorrect password");
  }
}

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
  }
}

function incrementWash(id) {
  users[id].count += 1;
  if (users[id].count > 5) users[id].count = 1;
  saveUsers();
  renderUsers();
}

function deleteUser(id) {
  delete users[id];
  saveUsers();
  renderUsers();
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
