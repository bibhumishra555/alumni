document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  async function fetchDashboardData() {
    try {
      const res = await fetch('http://localhost:5000/api/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to load dashboard data');
      const data = await res.json();
      populateDashboard(data);
    } catch (err) {
      console.error(err);
      alert('Could not load dashboard data');
    }
  }

  function populateDashboard(data) {
    document.getElementById('msgBadge').textContent = data.messages.unread;
    document.getElementById('notifCount').textContent = data.notifications.length;

    const notifList = document.getElementById('notifList');
    notifList.innerHTML = '';
    data.notifications.forEach(n => {
      const li = document.createElement('li');
      li.innerHTML = `${n.message} <span class="time">${n.time}</span>`;
      notifList.appendChild(li);
    });

    const cardsHTML = `
      <div class="card">
        <i class="fas fa-calendar-alt"></i>
        <h3>Upcoming Events</h3>
        <ul>${data.events.map(e => `<li>${e.name} <span class="time">(${e.date})</span></li>`).join('')}</ul>
      </div>
      <div class="card">
        <i class="fas fa-envelope-open-text"></i>
        <h3>New Messages</h3>
        <ul><li>${data.messages.unread} unread messages</li><li>${data.messages.requests} connection requests</li></ul>
      </div>
      <div class="card">
        <i class="fas fa-briefcase"></i>
        <h3>Job Opportunities</h3>
        <ul><li>${data.jobs.total} new jobs posted</li><li>${data.jobs.matches} matching your profile</li></ul>
      </div>`;
    document.getElementById('cardsContainer').innerHTML = cardsHTML;

    const activityFeed = document.getElementById('activityFeed');
    activityFeed.innerHTML = '';
    data.activities.forEach(a => {
      const li = document.createElement('li');
      li.innerHTML = `${a.text} <span class="time">${a.time}</span>`;
      activityFeed.appendChild(li);
    });
  }

  fetchDashboardData();
});
