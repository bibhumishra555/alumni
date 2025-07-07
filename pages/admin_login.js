/**
 * Admin Login Script
 *
 * What:
 *   Handles the login process for administrators, ensuring only authorized users can access admin features.
 *
 * Why:
 *   Protects sensitive admin pages by requiring valid credentials before granting access.
 *   Prevents unauthorized users from managing users and events.
 *
 * How:
 *   - Listens for the login form submission.
 *   - Sends the entered username and password to the backend for verification.
 *   - If successful, stores the authentication token and redirects to the admin dashboard.
 *   - If failed, displays an appropriate error message to the user.
 */

// Get references to form and error message elements for later use
const loginForm = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');
const API_BASE = "https://lndalumni.in"; // Backend API base URL


// Listen for the login form submission event
loginForm.addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent the default form submission (page reload)

    // Get and trim the username and password input values
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Clear any previous error message
    errorMsg.textContent = '';

    try {
        // Send login credentials to the backend API for verification
        const res = await fetch(`${API_BASE}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        // Parse the response from the backend
        const data = await res.json();

        // If login is successful and a token is returned
        if (res.ok && data.token) {
            // Store the token in localStorage for authentication on other pages
            localStorage.setItem('token', data.token);
            // Redirect to the admin dashboard
            window.location.href = 'admin.html';
        } else {
            // Show error message from backend or a generic message
            errorMsg.textContent = data.message || 'Invalid username or password';
        }
    } catch (err) {
        // Show a network error message if the request fails
        errorMsg.textContent = 'Network error. Please try again.';
    }
});
