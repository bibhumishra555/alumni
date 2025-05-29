// Theme toggle
const toggleBtn = document.getElementById('themeToggle');
const body = document.body;

if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
}

toggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark");
  localStorage.setItem("theme", body.classList.contains("dark") ? "dark" : "light");
});

// Notification dropdown
const notifIcon = document.getElementById("notifIcon");
const notifDropdown = document.getElementById("notifDropdown");

notifIcon.addEventListener("click", (e) => {
  notifDropdown.style.display = notifDropdown.style.display === "block" ? "none" : "block";
  e.stopPropagation();
});

document.addEventListener("click", () => {
  notifDropdown.style.display = "none";
});

// Mark all as read
document.getElementById("markRead").addEventListener("click", () => {
  document.getElementById("notifCount").style.display = "none";
  notifDropdown.style.display = "none";
});

// Sidebar toggle for mobile
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});

// Dynamic activity feed
function addActivity(message) {
  const feed = document.getElementById("activityFeed");
  const li = document.createElement("li");
  li.innerHTML = `${message} <span class="time">just now</span>`;
  feed.prepend(li);
}

// Example activity
setTimeout(() => addActivity("Viewed Profile"), 2000);

// You can expand this for AJAX call or DB integration
const updates = {
  events: ["Career Fair (March 20)", "Alumni Dinner (April 5)"],
  messages: ["2 unread messages", "1 connection request"],
  jobs: ["15 new jobs posted", "3 matching your profile"]
};

console.log("Dashboard populated with:", updates);
