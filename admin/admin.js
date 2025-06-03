// Data init
let users = JSON.parse(localStorage.getItem("users") || "{}");
let history = JSON.parse(localStorage.getItem("history") || "{}");

// Save functions
function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}
function saveHistory() {
  localStorage.setItem("history", JSON.stringify(history));
}

// Create user
function createUser() {
  const id = document.getElementById("newUserId").value.trim();
  const name = document.getElementById("newUserName").value.trim();

  if (!id || !name) {
    alert(currentLang === 'ar' ? "يرجى إدخال معرف واسم المستخدم." : "Please enter both User ID and User Name.");
    return;
  }
  if (users[id]) {
    alert(currentLang === 'ar' ? "معرف المستخدم موجود بالفعل!" : "User ID already exists!");
    return;
  }

  users[id] = { name, count: 0, message: "" };
  history[id] = [];
  saveUsers();
  saveHistory();
  renderUsers();

  document.getElementById("newUserId").value = "";
  document.getElementById("newUserName").value = "";
}

// Increment wash count
function incrementWash(id) {
  users[id].count += 1;
  if (users[id].count > 5) users[id].count = 1;

  const now = new Date().toLocaleString();
  if (!history[id]) history[id] = [];
  history[id].push(now);

  saveUsers();
  saveHistory();
  renderUsers();
}

// Delete user
function deleteUser(id) {
  if (confirm(currentLang === 'ar' ? "هل أنت متأكد من حذف هذا المستخدم؟" : "Are you sure you want to delete this user?")) {
    delete users[id];
    delete history[id];
    saveUsers();
    saveHistory();
    renderUsers();
  }
}

// Show history modal
function showHistory(id) {
  const list = document.getElementById("historyList");
  list.innerHTML = "";
  const logs = history[id] || [];
  if (logs.length === 0) {
    const li = document.createElement("li");
    li.innerText = currentLang === 'ar' ? "لا يوجد سجل" : "No history available";
    list.appendChild(li);
  } else {
    logs.slice().reverse().forEach(date => {
      const li = document.createElement("li");
      li.innerText = date;
      list.appendChild(li);
    });
  }
  document.getElementById("historyModal").classList.add("active");
}

// Close modal
function closeHistoryModal() {
  document.getElementById("historyModal").classList.remove("active");
}

// Save message
function saveMessage(id, message) {
  users[id].message = message;
  saveUsers();
}

// Render leaderboard top 5
function renderLeaderboard() {
  const board = document.getElementById("leaderboardList");
  board.innerHTML = "";
  const sorted = Object.entries(users)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);
  sorted.forEach(([id, user]) => {
    const li = document.createElement("li");
    li.innerText = `${user.name} (ID: ${id}) - ${user.count} ${currentLang === 'ar' ? 'غسيل' : 'washes'}`;
    board.appendChild(li);
  });
}

// Render all users filtered by search
function renderUsers() {
  const list = document.getElementById("usersList");
  const filter = document.getElementById("searchBox").value.toLowerCase();
  list.innerHTML = "";

  for (const id in users) {
    if (id.toLowerCase().includes(filter) || users[id].name.toLowerCase().includes(filter)) {
      const user = users[id];
      const div = document.createElement("div");
      div.className = "user-card";

      // Progress bar width (max 5 washes)
      const progressPercent = (user.count / 5) * 100;

      div.innerHTML = `
        <strong>${user.name}</strong> (ID: ${id})<br/>
        ${currentLang === 'ar' ? 'عدد الغسيل:' : 'Wash Count:'} ${user.count}
        <div class="progress-container">
          <div class="progress-bar" style="width: ${progressPercent}%;"></div>
        </div>
        ${currentLang === 'ar' ? 'الرسالة:' : 'Message:'}<br/>
        <textarea oninput="saveMessage('${id}', this.value)" placeholder="${currentLang === 'ar' ? 'اكتب رسالة...' : 'Write a message...'}">${user.message || ''}</textarea>
        <div class="flex">
          <button onclick="incrementWash('${id}')">${currentLang === 'ar' ? '+1 غسيل' : '+1 Wash'}</button>
          <button onclick="showHistory('${id}')">${currentLang === 'ar' ? 'عرض السجل' : 'View History'}</button>
          <button onclick="deleteUser('${id}')">${currentLang === 'ar' ? 'حذف' : 'Delete'}</button>
        </div>
      `;
      list.appendChild(div);
    }
  }
  renderLeaderboard();
  updateTextContent();
}

// Language toggle
let currentLang = 'en'; // default English

function updateTextContent() {
  // Direction & lang attribute
  if (currentLang === 'ar') {
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
  } else {
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  }

  document.querySelectorAll('[data-en]').forEach(el => {
    el.innerText = (currentLang === 'ar') ? el.getAttribute('data-ar') : el.getAttribute('data-en');
  });
  // Update placeholders manually
  document.getElementById('newUserId').placeholder = (currentLang === 'ar') ? "معرف المستخدم" : "User ID";
  document.getElementById('
