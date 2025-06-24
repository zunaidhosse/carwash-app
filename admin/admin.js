import { db, ref, set, onValue, remove, update, serverTimestamp } from '../firebase.js';

let allUsers = {}; // Firebase থেকে আসা সমস্ত ইউজার এখানে থাকবে

// Firebase থেকে রিয়েল-টাইম ডেটা শোনার জন্য
const usersRef = ref(db, 'users/');
onValue(usersRef, (snapshot) => {
  const data = snapshot.val();
  allUsers = data || {}; // ডেটা না থাকলে খালি অবজেক্ট
  renderUsers(); // ডেটা পরিবর্তন হলেই তালিকাটি পুনরায় রেন্ডার হবে
});

// ইউজার তালিকা দেখানোর ফাংশন
function renderUsers() {
  const list = document.getElementById("usersList");
  const filter = document.getElementById("searchBox").value.toLowerCase();
  list.innerHTML = "";

  if (!allUsers) return; // যদি কোনো ইউজার না থাকে

  // ইউজারদের তৈরির সময় অনুযায়ী সাজানো (নতুনগুলো আগে)
  const sortedUserIds = Object.keys(allUsers).sort((a, b) => {
    const timeA = allUsers[a].createdAt || 0;
    const timeB = allUsers[b].createdAt || 0;
    return timeB - timeA;
  });

  for (const id of sortedUserIds) {
    const user = allUsers[id];
    if (id.toLowerCase().includes(filter) || user.name.toLowerCase().includes(filter)) {
      const div = document.createElement("div");
      div.className = "user-card";
      const progress = ((user.count || 0) / 5) * 100;

      div.innerHTML = `
        <strong>${user.name}</strong> (ID: ${id})<br/>
        Car: ${user.car || "🚗"}<br/>
        Wash Count: ${user.count || 0}
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

// নতুন ইউজার তৈরির ফাংশন
async function createUser() {
  const id = document.getElementById("newUserId").value.trim();
  const name = document.getElementById("newUserName").value.trim();
  const car = document.getElementById("newUserCar").value;

  if (!id || !name) {
    alert("Please enter both User ID and User Name.");
    return;
  }

  // চেক করুন ইউজার আইডি আগে থেকেই আছে কিনা
  if (allUsers[id]) {
    alert("User ID already exists!");
    return;
  }

  try {
    // Firebase এ ডেটা সেট করুন
    await set(ref(db, 'users/' + id), {
      name: name,
      car: car,
      count: 0,
      createdAt: serverTimestamp() // এটি ডেটা তৈরির সময় সংরক্ষণ করে
    });
    
    // ইনপুট ফিল্ড খালি করুন
    document.getElementById("newUserId").value = "";
    document.getElementById("newUserName").value = "";
  } catch (error) {
    console.error("Error creating user: ", error);
    alert("Failed to create user. Check console for details.");
  }
}

// ওয়াশ সংখ্যা বাড়ানোর ফাংশন
async function incrementWash(id) {
  const newCount = ((allUsers[id].count || 0) % 5) + 1;
  try {
    await update(ref(db, 'users/' + id), {
      count: newCount
    });
  } catch (error) {
    console.error("Error updating wash count: ", error);
    alert("Failed to update wash count.");
  }
}

// ইউজার ডিলিট করার ফাংশন
async function deleteUser(id) {
  if (confirm("Are you sure you want to delete this user?")) {
    try {
      await remove(ref(db, 'users/' + id));
    } catch (error) {
      console.error("Error deleting user: ", error);
      alert("Failed to delete user.");
    }
  }
}

// HTML থেকে কল করার জন্য ফাংশনগুলোকে window অবজেক্টে যোগ করা
window.createUser = createUser;
window.incrementWash = incrementWash;
window.deleteUser = deleteUser;
window.renderUsers = renderUsers;
