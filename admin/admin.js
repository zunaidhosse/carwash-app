let users = JSON.parse(localStorage.getItem("users") || "{}");

function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}

function createUser() {
  const id = document.getElementById("newUserId").value.trim();
  const name = document.getElementById("newUserName").value.trim();
  const message = document.getElementById("newUserMessage").value.trim();

  if (!id || !name) {
    alert("Please enter both User ID and User Name.");
    return;
  }

  if (users[id]) {
    alert("User ID already exists!");
    return;
  }

  users[id] = {
    name,
    message,
    count: 0,
    history: []
  };

  saveUsers();
  renderUsers();

  document.getElementById("newUserId").value = "";
  document.getElementById("newUserName").value = "";
  document.getElementById("newUserMessage").value = "";
}

function incrementWash(id) {
  const user = users[id];
  user.count += 1;
  if (user.count > 5) user.count = 1;

  const date = new Date().toLocaleString();
  user.history.push(date);

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

function showHistory(id) {
  const user = users[id];
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";

  if (user.history.length === 0) {
    historyList.innerHTML = "<li>No history available</li>";
  } else {
    user.history.forEach(entry => {
      const li = document.createElement("li");
      li.textContent = entry;
      historyList.appendChild(li);
    });
  }

  document.getElementById("historyModal").style.display = "flex";
}

function closeHistoryModal() {
  document.getElementById("historyModal").style.display = "none";
}

function renderUsers() {
  const list = document.getElementById("usersList");
  const filter = document.getElementById("searchBox").value.toLowerCase();
  list.innerHTML = "";

  const leaderboard = [];

  for (const id in users) {
    if (
      id.toLowerCase().includes(filter) ||
      users[id].name.toLowerCase().includes(filter)
    ) {
      const user = users[id];
      const div = document.createElement("div");
      div.className = "user-card";
      const percentage = (user.count / 5) * 100;

      div.innerHTML = `
        <strong>${user.name}</strong> (ID: ${id})<br/>
        Message: ${user.message || "—"}<br/>
        Wash Count: ${user.count}
        <div class="progress">
          <div class="progress-bar" style="width: ${percentage}%;"></div>
        </div>
        <div class="flex">
          <button onclick="incrementWash('${id}')">+1 Wash</button>
          <button onclick="showHistory('${id}')">🧾 History</button>
          <button onclick="deleteUser('${id}')">Delete</button>
        </div>
      `;
      list.appendChild(div);
      leaderboard.push({ id, name: user.name, count: user.count });
    }
  }

  leaderboard.sort((a, b) => b.count - a.count);
  const topUsers = document.getElementById("topUsers");
  topUsers.innerHTML = "";
  leaderboard.slice(0, 5).forEach(user => {
    const li = document.createElement("li");
    li.textContent = `${user.name} (${user.count})`;
    topUsers.appendChild(li);
  });
}

// Initial render
renderUsers();
