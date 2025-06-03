let users = JSON.parse(localStorage.getItem("users") || "{}");

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

function createUser() {
  const id = document.getElementById("newUserId").value.trim();
  const name = document.getElementById("newUserName").value.trim();

  if (!id || !name) {
    alert("Please enter both User ID and User Name.");
    return;
  }

  if (users[id]) {
    alert("User ID already exists!");
    return;
  }

  users[id] = { name, count: 0 };
  saveUsers();
  renderUsers();

  document.getElementById("newUserId").value = "";
  document.getElementById("newUserName").value = "";
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
      const user = users[id];
      const div = document.createElement("div");
      div.className = "user-card";
      div.innerHTML = `
        <strong>${user.name}</strong> (ID: ${id})<br/>
        Wash Count: ${user.count}<br/>
        <div class="flex">
          <button onclick="incrementWash('${id}')">+1 Wash</button>
          <button onclick="deleteUser('${id}')">Delete</button>
        </div>
      `;
      list.appendChild(div);
    }
  }
}

// Initial render
renderUsers();
