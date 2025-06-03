let users = JSON.parse(localStorage.getItem("users") || "{}");
let creationOrder = JSON.parse(localStorage.getItem("creationOrder") || "[]");

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("creationOrder", JSON.stringify(creationOrder));
}

function createUser() {
  const id = document.getElementById("newUserId").value.trim();
  const name = document.getElementById("newUserName").value.trim();
  const car = document.getElementById("newUserCar").value;

  if (!id || !name) {
    alert("Please enter both User ID and User Name.");
    return;
  }

  if (users[id]) {
    alert("User ID already exists!");
    return;
  }

  users[id] = { name, count: 0, car: car };
  creationOrder.unshift(id); // Add to top (latest first)
  saveUsers();
  renderUsers();

  document.getElementById("newUserId").value = "";
  document.getElementById("newUserName").value = "";
}

function incrementWash(id) {
  users[id].count = (users[id].count % 5) + 1; // Reset after 5
  saveUsers();
  renderUsers();
}

function deleteUser(id) {
  if (confirm("Are you sure you want to delete this user?")) {
    delete users[id];
    creationOrder = creationOrder.filter(uid => uid !== id);
    saveUsers();
    renderUsers();
  }
}

function renderUsers() {
  const list = document.getElementById("usersList");
  const filter = document.getElementById("searchBox").value.toLowerCase();
  list.innerHTML = "";

  for (const id of creationOrder) {
    if (!users[id]) continue;
    if (id.toLowerCase().includes(filter) || users[id].name.toLowerCase().includes(filter)) {
      const user = users[id];
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

renderUsers();
