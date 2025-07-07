/**
 * Admin Dashboard Script
 * 
 * This script powers the admin dashboard for managing users and events.
 * It ensures only authenticated admins can access the page, fetches and displays
 * user and event data, and provides controls to add or delete events and users.
 * 
 * Why: 
 *   - Prevents unauthorized access to admin features.
 *   - Allows admins to efficiently manage users and events from a single interface.
 * 
 * How:
 *   - Checks for an authentication token before loading the dashboard.
 *   - Fetches user and event lists from the backend and renders them in tables.
 *   - Handles adding new events via a modal form.
 *   - Provides delete buttons for users and events, updating the UI after changes.
 */

// ==========================
// Configuration
// ==========================

const API_BASE = "https://lndalumni.in"; // Backend API base URL

// ==========================
// Authentication Check
// ==========================

/**
 * Redirects to the admin login page if no authentication token is found.
 * This ensures only logged-in admins can access the dashboard.
 */
if (!localStorage.getItem('token')) {
    window.location.href = 'admin_login.html';
}

// ==========================
// User Management Functions
// ==========================

/**
 * Fetches the list of users from the backend and displays them in the users table.
 * Each user row includes a delete button for removal.
 */
async function loadUsers() {
    try {
        const res = await fetch(`${API_BASE}/api/users`);
        const users = await res.json();
        const tbody = document.querySelector('#usersTable tbody');
        // Render each user as a table row
        tbody.innerHTML = users.map(u => `
            <tr>
                <td>${u.fullName || u.firstName || u.name || ''}</td>
                <td>${u.email}</td>
                <td>${u.role || 'user'}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser('${u._id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Failed to load users:', error);
    }
}

/**
 * Deletes a user by ID after confirmation, then refreshes the user list.
 * @param {string} id - The unique ID of the user to delete.
 */
async function deleteUser(id) {
    if (confirm("Delete this user?")) {
        try {
            await fetch(`${API_BASE}/api/users/${id}`, { method: 'DELETE' });
            loadUsers(); // Refresh the user list
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    }
}

// ==========================
// Event Management Functions
// ==========================

/**
 * Fetches the list of events from the backend and displays them in the events table.
 * Each event row includes a delete button for removal.
 */
async function loadEvents() {
    try {
        const res = await fetch(`${API_BASE}/api/events`);
        const events = await res.json();
        const tbody = document.querySelector('#eventsTable tbody');
        // Render each event as a table row
        tbody.innerHTML = events.map(e => `
            <tr>
                <td>${e.title}</td>
                <td>${e.date ? new Date(e.date).toLocaleDateString() : ''}</td>
                <td>${e.time || ''}</td>
                <td>${e.venue || ''}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteEvent('${e._id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Failed to load events:', error);
    }
}

/**
 * Deletes an event by ID after confirmation, then refreshes the event list.
 * @param {string} id - The unique ID of the event to delete.
 */
async function deleteEvent(id) {
    if (confirm("Delete this event?")) {
        try {
            await fetch(`${API_BASE}/api/events/${id}`, { method: 'DELETE' });
            loadEvents(); // Refresh the event list
        } catch (error) {
            console.error('Failed to delete event:', error);
        }
    }
}

/**
 * Handles the submission of the "Add Event" form in the modal.
 * Sends the new event data to the backend, closes the modal, and refreshes the event list.
 */
document.getElementById('adminEventForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent default form submission

    // Gather form input values
    const title = document.getElementById('adminEventTitle').value;
    const date = document.getElementById('adminEventDate').value;
    const time = document.getElementById('adminEventTime').value;
    const venue = document.getElementById('adminEventVenue').value;
    const description = document.getElementById('adminEventDescription').value;

    try {
        // Send new event data to backend
        await fetch(`${API_BASE}/api/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, date, time, venue, description })
        });

        // Reset the form and close the modal
        document.getElementById('adminEventForm').reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('addEventModal'));
        modal.hide();

        // Refresh the event list
        loadEvents();
    } catch (error) {
        console.error('Failed to add event:', error);
    }
});

// ==========================
// Initial Data Load
// ==========================

/**
 * Loads users and events when the page is first loaded.
 * Ensures the dashboard displays up-to-date information.
 */
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    loadEvents();
});

// admin_login.js me
/*if (res.ok) {
    localStorage.setItem('token', data.token); // token save karo
    window.location.href = 'admin.html';
}**/
