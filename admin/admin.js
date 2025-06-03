let users = JSON.parse(localStorage.getItem("users") || "{}");

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

function createUser() {
  const idField = document.getElementById("newUserId");
  const nameField = document.getElementById("newUserName");
  const id = idField.value.trim();
  const name = nameField.value.trim();

  if (!id || !name) {
    alert("Please enter both Car Number and User Name.");
    return;
  }

  if (users[id]) {
    alert("Car number already exists!");
    return;
  }

  users[id] = { name, count: 0 };
  saveUsers();
  renderUsers();

  idField.value = "";
  nameField.value = "";

  // Hide input section
  document.getElementById("carInputSection").classList.add("hidden");
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
    const user = users[id];
    const match = id.toLowerCase().includes(filter) || user.name.toLowerCase().includes(filter);
    if (match || filter === "") {
      const div = document.createElement("div");
      div.className = "user-card";
      div.innerHTML = `
        <strong>${user.name}</strong> (Car: ${id})<br/>
        Wash Count: ${user.count}<br/>
        <div class="flex">
          <button onclick="incrementWash('${id}')">+1 Wash</button>
          <button onclick="deleteUser('${id}')">Delete</button>
        </div>
      `;

      // If searched ID matches exact Car number, make card bigger
      if (filter === id.toLowerCase()) {
        div.classList.add("large");
      }

      list.appendChild(div);
    }
  }
}

window.onload = () => {
  document.getElementById("carInputSection").classList.remove("hidden");
  renderUsers();
};
