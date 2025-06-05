const SHEET_API = "https://script.google.com/macros/s/AKfycbwI0TOmTezlIu3cMblQ8_OSo4k5nOfTGPb_hF8jfzdKUZBq31imVuZBTAiKTaly_mw0uQ/exec";

function createUser() {
  const id = document.getElementById("newUserId").value.trim();
  const name = document.getElementById("newUserName").value.trim();
  const car = document.getElementById("newUserCar").value;

  if (!id || !name) {
    alert("Please enter both User ID and Name.");
    return;
  }

  fetch(SHEET_API, {
    method: "POST",
    body: JSON.stringify({ id, name, car, count: 0 }),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    document.getElementById("newUserId").value = "";
    document.getElementById("newUserName").value = "";
    renderUsers();
  });
}

function renderUsers() {
  fetch(SHEET_API)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("usersList");
      const filter = document.getElementById("searchBox").value.toLowerCase();
      list.innerHTML = "";

      const creationOrder = data.map(u => u.id).reverse();

      for (const id of creationOrder) {
        const user = data.find(u => u.id === id);
        if (!user) continue;
        if (
          id.toLowerCase().includes(filter) ||
          user.name.toLowerCase().includes(filter)
        ) {
          const div = document.createElement("div");
          div.className = "user-card";
          const progress = (parseInt(user.count || 0) / 5) * 100;

          div.innerHTML = `
            <strong>${user.name}</strong> (ID: ${id})<br/>
            Car: ${user.car || "🚗"}<br/>
            Wash Count: ${user.count}
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="flex">
              <button onclick="incrementWash('${id}')">+1 Wash</button>
            </div>
          `;
          list.appendChild(div);
        }
      }
    });
}

function incrementWash(id) {
  fetch(SHEET_API)
    .then(res => res.json())
    .then(data => {
      const user = data.find(u => u.id === id);
      if (!user) return alert("User not found.");

      const newCount = (parseInt(user.count || 0) % 5) + 1;

      fetch(SHEET_API, {
        method: "POST",
        body: JSON.stringify({ id, name: user.name, car: user.car, count: newCount }),
        headers: { "Content-Type": "application/json" }
      })
      .then(res => res.json())
      .then(response => {
        alert(response.message);
        renderUsers();
      });
    });
}

renderUsers();
