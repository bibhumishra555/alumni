/**
 * =============================================================================
 * dashboard.js – Alumni Portal Dashboard Logic & UI Management
 * -----------------------------------------------------------------------------
 * This script powers the main dashboard for the L.N.D College Alumni Portal.
 * It ensures only authenticated users can access the dashboard, loads user
 * profile and alumni data, manages navigation, and displays events and stats.
 *
 * Why this is needed:
 *   - Protects alumni-only features and data.
 *   - Provides a dynamic, interactive dashboard for alumni engagement.
 *   - Centralizes all dashboard logic for maintainability and clarity.
 *
 * How it works:
 *   - Checks authentication and redirects if not logged in.
 *   - Loads user profile and alumni data from the backend.
 *   - Handles navigation, profile editing, alumni directory, and events.
 *   - Uses helper functions for UI updates, filtering, and formatting.
 * =============================================================================
 */

// ==============================
// 1. Global State & Config
// ==============================

let allAlumni = [];   // Stores all alumni data for directory/filtering
let allEvents = [];   // Stores all events for event display
let currentUser = null; // Stores the current logged-in user's data

const API_BASE = "https://lndalumni.in"; // Backend API base URL // Backend API base URL

// ==============================
// 2. Authentication Check
// ==============================

// Redirect to login if not authenticated
if (!localStorage.getItem('token')) {
    window.location.href = 'login.html';
}

/**
 * Checks if the user is authenticated by verifying token presence.
 * @returns {Promise<{authenticated: boolean}>}
 */
async function checkAuthStatus() {
    const token = localStorage.getItem("token");
    return { authenticated: !!token };
}

// ==============================
// 3. Dashboard Initialization
// ==============================

/**
 * Initializes the dashboard: checks auth, loads data, sets up UI.
 */
async function initializeDashboard() {
    try {
        // 1. Check authentication
        const authStatus = await checkAuthStatus();
        if (!authStatus.authenticated) {
            window.location.href = '/login';
            return;
        }

        // 2. Load user profile and dashboard data
        await loadUserProfile();
        await loadDashboardData();
        await loadEvents();

        // 3. Initialize navigation and features
        initializeNavigation();
        initializeProfileEdit();
        initializeAlumniDirectory();

    } catch (error) {
        console.error('Dashboard initialization error:', error);
        showAlert('Failed to load dashboard. Please refresh the page.', 'danger');
    }
}

// ==============================
// 4. Department Data Structure
// ==============================

/**
 * Maps course types to available departments for dropdowns.
 */
const departmentData = {
    UG: [
        'ECONOMICS', 'ENGLISH', 'GEOGRAPHY', 'HINDI', 'HISTORY', 
        'PHILOSOPHY', 'POLITICAL SCIENCE', 'PSYCHOLOGY', 'URDU', 
        'BOTANY', 'CHEMISTRY', 'MATHEMATICS', 'PHYSICS', 'ZOOLOGY', 
        'BCA', 'BBA', 'BED'
    ],
    PG: [
        'ECONOMICS', 'GEOGRAPHY', 'HINDI', 'HISTORY', 
        'POLITICAL SCIENCE', 'PHYSICS', 'CHEMISTRY'
    ]
};

// ==============================
// 5. Dynamic Department Dropdown
// ==============================

/**
 * Populates the department dropdown based on selected course.
 */
function handleCourseChange() {
    const courseSelect = document.getElementById('course');
    const departmentDropdown = document.getElementById('department');
    const selectedCourse = courseSelect.value;

    // Clear existing options
    departmentDropdown.innerHTML = '<option value="">Select Department</option>';

    if (selectedCourse && departmentData[selectedCourse]) {
        departmentDropdown.disabled = false;
        departmentData[selectedCourse].forEach(dept => {
            const option = document.createElement('option');
            option.value = dept;
            option.textContent = dept;
            departmentDropdown.appendChild(option);
        });
        // Smooth fade-in effect
        departmentDropdown.style.opacity = '0.5';
        setTimeout(() => {
            departmentDropdown.style.opacity = '1';
        }, 150);
    } else {
        departmentDropdown.disabled = true;
    }
}

// ==============================
// 6. Prevent Enter Key Submission
// ==============================

/**
 * Prevents form submission when pressing Enter in dropdown fields.
 */
function preventEnterSubmission() {
    const preventEnterFields = ['course', 'department'];
    preventEnterFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                }
            });
        }
    });
}

// ==============================
// 7. User Profile Loading & UI
// ==============================

/**
 * Loads the current user's profile from the backend and updates the UI.
 */
async function loadUserProfile() {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE}/api/auth/user/me`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.text();
        if (!response.ok) throw new Error('Failed to load profile');
        currentUser = JSON.parse(data);
        updateUserInterface();

    } catch (error) {
        console.error('Profile load error:', error);
        showAlert('Failed to load user profile', 'danger');
    }
}

/**
 * Updates all UI elements with the current user's data.
 */
function updateUserInterface() {
    if (!currentUser) return;

    // Full name and initials for display
    const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
    const initials = Utils.getInitials(currentUser.firstName, currentUser.lastName);

    // Navigation and welcome
    const userDisplayName = document.getElementById('userDisplayName');
    if (userDisplayName) userDisplayName.textContent = fullName;
    const welcomeUsername = document.getElementById('welcomeUsername');
    if (welcomeUsername) welcomeUsername.textContent = currentUser.firstName;

    // Statistics cards
    updateStatisticsCards();

    // Profile section
    updateProfileDisplay();
}

/**
 * Updates statistics cards (graduation year, department, member since).
 */
function updateStatisticsCards() {
    if (!currentUser) return;

    const userpassingYear = document.getElementById('userpassingYear');
    if (userpassingYear) userpassingYear.textContent = currentUser.passingYear || 'Not specified';

    const userDepartment = document.getElementById('userDepartment');
    if (userDepartment) userDepartment.textContent = currentUser.department || 'Not specified';

    const memberSince = document.getElementById('memberSince');
    if (memberSince && currentUser.memberSince) {
        const memberDate = new Date(currentUser.memberSince);
        memberSince.textContent = memberDate.getFullYear().toString();
    }
}

/**
 * Updates the profile display section with user details.
 */
function updateProfileDisplay() {
    if (!currentUser) return;

    const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
    const profileFullName = document.getElementById('profileFullName');
    if (profileFullName) profileFullName.textContent = fullName;

    const profileEmailID = document.getElementById('profileEmailID');
    if (profileEmailID) profileEmailID.textContent = currentUser.email;

    const profileMemberSince = document.getElementById('profileMemberSince');
    if (profileMemberSince && currentUser.memberSince) {
        profileMemberSince.textContent = `Member since ${Utils.formatDate(currentUser.memberSince)}`;
    }

    // Map of profile fields to update
    const profileFields = {
        'profileName': currentUser.fullName || 'Not specified',
        'profileFatherName': currentUser.fatherName || 'Not specified',
        'profileRegNumber': currentUser.regNumber || 'Not specified',
        'profilePassingYear': currentUser.passingYear,
        'profileDepartment': currentUser.department,
        'profileCourse': currentUser.course,
        'profilePhone': currentUser.phone,
        'profileCompany': currentUser.currentCompany,
        'profilePosition': currentUser.currentPosition,
        'profileJobLocation': currentUser.jobLocation,
        'profileEmail': currentUser.email,
        'profileLinkedIn': currentUser.linkedinUrl,
        'profileBio': currentUser.bio 
    };

    Object.entries(profileFields).forEach(([elementId, value]) => {
        const element = document.getElementById(elementId);
        if (element) element.textContent = value || 'Not specified';
    });

    // LinkedIn URL as clickable link
    const profileLinkedin = document.getElementById('profileLinkedin');
    if (profileLinkedin) {
        if (currentUser.linkedinUrl) {
            profileLinkedin.innerHTML = `<a href="${currentUser.linkedinUrl}" target="_blank" rel="noopener">${currentUser.linkedinUrl}</a>`;
        } else {
            profileLinkedin.textContent = 'Not specified';
        }
    }
}

// ==============================
// 8. Dashboard Data Loading
// ==============================

/**
 * Loads dashboard-wide data (e.g., alumni count).
 */
async function loadDashboardData() {
    try {
        await loadAlumniCount();
    } catch (error) {
        console.error('Dashboard data load error:', error);
    }
}

/**
 * Loads the total alumni count and updates the UI.
 */
async function loadAlumniCount() {
    try {
        const response = await fetch(`${API_BASE}/api/alumni`, {
            credentials: 'include'
        });
        if (response.ok) {
            const alumni = await response.json();
            allAlumni = alumni;
            const totalAlumni = document.getElementById('totalAlumni');
            if (totalAlumni) totalAlumni.textContent = alumni.length.toString();
        }
    } catch (error) {
        console.error('Alumni count load error:', error);
    }
}

// ==============================
// 9. Navigation & Section Management
// ==============================

/**
 * Sets up dashboard navigation and section switching.
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('[data-section]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionName = e.currentTarget.getAttribute('data-section');
            showSection(sectionName);
            updateActiveNavigation(e.currentTarget);
        });
    });
    // Show overview section by default
    showSection('overview');
}

/**
 * Shows a specific dashboard section and loads its data.
 */
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.add('d-none'));

    // Show target section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.remove('d-none');
        Utils.animateElement(targetSection, 'fade-in');
    }

    // Load section-specific data
    loadSectionData(sectionName);
}

/**
 * Updates the active navigation link styling.
 */
function updateActiveNavigation(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');

    // Also update sidebar navigation if exists
    const sectionName = activeLink.getAttribute('data-section');
    const sidebarLink = document.querySelector(`.sidebar [data-section="${sectionName}"]`);
    if (sidebarLink) sidebarLink.classList.add('active');
}

/**
 * Loads data specific to the selected section.
 */
function loadSectionData(sectionName) {
    switch (sectionName) {
        case 'directory':
            loadAlumniDirectory();
            break;
        case 'profile':
            // Profile data already loaded
            break;
        case 'overview':
            // Overview data already loaded
            break;
    }
}

// ==============================
// 10. Profile Editing
// ==============================

/**
 * Sets up profile editing functionality and form dependencies.
 */
function initializeProfileEdit() {
    const editProfileBtn = document.getElementById('editProfileBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const updateProfileForm = document.getElementById('updateProfileForm');

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', showProfileEditForm);
    }
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', hideProfileEditForm);
    }
    if (updateProfileForm) {
        updateProfileForm.addEventListener('submit', handleProfileUpdate);
    }
    setupCourseDepartmentDependency();
}

/**
 * Sets up course/department dropdown dependency in the edit form.
 */
function setupCourseDepartmentDependency() {
    const courseSelect = document.getElementById('editCourse');
    const departmentDropdown = document.getElementById('editDepartment');
    if (!courseSelect || !departmentDropdown) return;

    courseSelect.addEventListener('change', function() {
        const selectedCourse = courseSelect.value;
        departmentDropdown.innerHTML = '<option value="">Select Department</option>';
        if (selectedCourse && departmentData[selectedCourse]) {
            departmentData[selectedCourse].forEach(dept => {
                const option = document.createElement('option');
                option.value = dept;
                option.textContent = dept;
                departmentDropdown.appendChild(option);
            });
            departmentDropdown.disabled = false;
        } else {
            departmentDropdown.disabled = true;
        }
    });
}

/**
 * Shows the profile edit form and populates it with current user data.
 */
function showProfileEditForm() {
    if (!currentUser) return;
    const profileDisplay = document.getElementById('profileDisplay');
    if (profileDisplay) profileDisplay.classList.add('d-none');
    const profileEditForm = document.getElementById('profileEditForm');
    if (profileEditForm) {
        profileEditForm.classList.remove('d-none');
        populateEditForm();
    }
}

/**
 * Hides the profile edit form and shows the profile display.
 */
function hideProfileEditForm() {
    const profileDisplay = document.getElementById('profileDisplay');
    if (profileDisplay) profileDisplay.classList.remove('d-none');
    const profileEditForm = document.getElementById('profileEditForm');
    if (profileEditForm) profileEditForm.classList.add('d-none');
}

/**
 * Populates the edit form fields with current user data.
 */
function populateEditForm() {
    if (!currentUser) return;
    const formFields = {
        'editFirstName': currentUser.firstName,
        'editLastName': currentUser.lastName,
        'editpassingYear': currentUser.graduationYear,
        'editDepartment': currentUser.department,
        'editDegree': currentUser.degree,
        'editPhone': currentUser.phone,
        'editCompany': currentUser.currentCompany,
        'editPosition': currentUser.currentPosition,
        'editJobLocation': currentUser.jobLocation,
        'editLinkedin': currentUser.linkedinUrl,
        'editEmail': currentUser.email,
        'editBio': currentUser.bio
    };
    Object.entries(formFields).forEach(([fieldId, value]) => {
        const field = document.getElementById(fieldId);
        if (field && value) field.value = value;
    });
}

/**
 * Handles profile update form submission.
 */
async function handleProfileUpdate(e) {
    e.preventDefault();
    const form = e.target;
    const updateData = {
        currentCompany: document.getElementById('editCompany') ? document.getElementById('editCompany').value : '',
        currentPosition: document.getElementById('editPosition') ? document.getElementById('editPosition').value : '',
        jobLocation: document.getElementById('editJobLocation') ? document.getElementById('editJobLocation').value : '',
        linkedinUrl: document.getElementById('editLinkedin') ? document.getElementById('editLinkedin').value : '',
        email: document.getElementById('editEmail') ? document.getElementById('editEmail').value : '',
        bio: document.getElementById('editBio') ? document.getElementById('editBio').value : ''
    };
    const submitBtn = form.querySelector('button[type="submit"]');
    Utils.showButtonLoading(submitBtn, 'Saving...');
    try {
        const response = await fetch(`${API_BASE}/api/auth/user/me`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(updateData)
        });
        if (response.ok) {
            showAlert('Profile updated successfully!', 'success');
            await loadUserProfile();
            hideProfileEditForm();
        } else {
            const errorData = await response.json();
            showAlert(errorData.error || 'Failed to update profile', 'danger');
        }
    } catch (error) {
        console.error('Profile update error:', error);
        showAlert('Network error. Please try again.', 'danger');
    } finally {
        Utils.hideButtonLoading(submitBtn);
    }
}

// ==============================
// 11. Alumni Directory
// ==============================

/**
 * Sets up alumni directory search and filter functionality.
 */
function initializeAlumniDirectory() {
    const searchInput = document.getElementById('searchAlumni');
    const departmentFilter = document.getElementById('filterDepartment');
    if (searchInput) searchInput.addEventListener('input', Utils.debounce(filterAlumni, 300));
    if (departmentFilter) departmentFilter.addEventListener('change', filterAlumni);
}

/**
 * Loads and displays the alumni directory.
 */
async function loadAlumniDirectory() {
    const alumniList = document.getElementById('alumniList');
    if (!alumniList) return;
    try {
        if (allAlumni.length === 0) {
            const response = await fetch('/api/alumni', { credentials: 'same-origin' });
            if (response.ok) allAlumni = await response.json();
            else throw new Error('Failed to load alumni');
        }
        displayAlumni(allAlumni);
    } catch (error) {
        console.error('Alumni directory load error:', error);
        alumniList.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Failed to load alumni directory. Please try again.
            </div>
        `;
    }
}

/**
 * Displays alumni in the directory section.
 */
function displayAlumni(alumni) {
    const alumniList = document.getElementById('alumniList');
    if (!alumniList) return;
    if (alumni.length === 0) {
        alumniList.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-users fa-3x text-muted mb-3"></i>
                <h5>No alumni found</h5>
                <p class="text-muted">Try adjusting your search criteria.</p>
            </div>
        `;
        return;
    }
    const alumniHtml = alumni.map(alumnus => {
        const fullName = alumnus.name || 'Not specified';
        const [firstName, ...rest] = fullName.split(' ');
        const lastName = rest.join(' ');
        const displayName = `${firstName || ''} ${lastName || ''}`.trim() || 'Not specified';
        const initials = Utils.getInitials(alumnus.firstName, alumnus.lastName);
        const avatarColor = Utils.generateAvatarColor(displayName);
        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card alumni-card h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="profile-image-placeholder me-3" style="background-color: ${avatarColor}">
                                ${initials}
                            </div>
                            <div>
                                <h6 class="card-title mb-1"><strong>${displayName}</strong></h6>
                                <p class="text-muted small mb-0">
                                    ${alumnus.graduationYear ? `Class of ${alumnus.graduationYear}` : 'Alumni'}
                                </p>
                            </div>
                        </div>
                        <div class="mb-2">
                            <span><big class="text-muted">Department:</big></span>
                            <span>${alumnus.department || 'Not specified'}</span>
                        </div>
                        <div class="mb-2">
                            <span><big class="text-muted">Passing Year:</big></span>
                            <span>${alumnus.passingYear || 'Not specified'}</span>
                        </div>
                        <div class="mb-2">
                            <span><big class="text-muted">Email ID:</big></span>
                            <span>${alumnus.email || 'Not specified'}</span>
                        </div>
                        ${alumnus.currentCompany ? `
                            <div class="mb-2">
                                <span><big class="text-muted">Company:</big></span>
                                <span>${alumnus.currentCompany}</span>
                            </div>
                        ` : ''}
                        ${alumnus.currentPosition ? `
                            <div class="mb-2">
                                <span><big class="text-muted">Position:</big></span>
                                <span>${alumnus.currentPosition}</span>
                            </div>
                        ` : ''}
                        ${alumnus.jobLocation ? `
                            <div class="mb-2">
                                <span><big class="text-muted">Job Location:</big></span>
                                <span>${alumnus.jobLocation}</span>
                            </div>
                        ` : ''}
                        ${alumnus.linkedinUrl ? `
                            <div class="mb-2">
                                <span><big class="text-muted">LinkedIn:</big></span>
                                <a href="${alumnus.linkedinUrl}" target="_blank" rel="noopener">${alumnus.linkedinUrl}</a>
                            </div>
                        ` : ''}
                        ${alumnus.bio ? `
                            <div class="mb-2">
                                <span><big class="text-muted">Bio:</big></span>
                                <p class="mb-0">${alumnus.bio}</p>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    alumniList.innerHTML = `<div class="row">${alumniHtml}</div>`;
}

/**
 * Filters alumni based on search and department filter.
 */
function filterAlumni() {
    const searchInput = document.getElementById('searchAlumni');
    const departmentFilter = document.getElementById('filterDepartment');
    if (!searchInput || !departmentFilter) return;
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedDepartment = departmentFilter.value;
    let filteredAlumni = allAlumni;
    // Filter by search term (name, company, etc.)
    if (searchTerm) {
        filteredAlumni = filteredAlumni.filter(alumnus => {
            const fullName = (alumnus.name || `${alumnus.firstName || ''} ${alumnus.lastName || ''}`).toLowerCase();
            const company = (alumnus.currentCompany || '').toLowerCase();
            const position = (alumnus.currentPosition || '').toLowerCase();
            const jobLocation = (alumnus.jobLocation || '').toLowerCase();
            const passingYear = (alumnus.passingYear || '').toString().toLowerCase();
            const department = (alumnus.department || '').toLowerCase();
            return (
                fullName.includes(searchTerm) ||
                company.includes(searchTerm) ||
                position.includes(searchTerm) ||
                jobLocation.includes(searchTerm) ||
                passingYear.includes(searchTerm) ||
                department.includes(searchTerm)
            );
        });
    }
    // Filter by department dropdown
    if (selectedDepartment) {
        filteredAlumni = filteredAlumni.filter(alumnus => alumnus.department === selectedDepartment);
    }
    displayAlumni(filteredAlumni);
}

// ==============================
// 12. Event Management
// ==============================

/**
 * Saves a new event to the backend and reloads events.
 */
async function saveEvent(title, date, description) {
    const time = document.getElementById('eventTime').value;
    const venue = document.getElementById('eventVenue').value;
    const response = await fetch(`${API_BASE}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, time, venue, description })
    });
    if (response.ok) {
        loadEvents();
    }
}

/**
 * Loads all events from the backend and renders them.
 */
async function loadEvents() {
    const response = await fetch(`${API_BASE}/api/events`);
    if (response.ok) {
        allEvents = await response.json();
        renderEventList();
        showNextUpcomingEvent();
    }
}

/**
 * Renders the list of events in the dashboard.
 */
function renderEventList() {
    const eventList = document.getElementById('eventList');
    if (!eventList) return;
    if (allEvents.length === 0) {
        eventList.innerHTML = `
            <div class="card mb-3">
                <div class="card-body text-center text-muted">
                    <i class="fas fa-calendar-times fa-2x mb-2"></i>
                    <p class="mb-0">No events to show yet.</p>
                </div>
            </div>
        `;
        return;
    }
    // Sort events by date (latest first)
    const sortedEvents = [...allEvents].sort((a, b) => new Date(b.date) - new Date(a.date));
    const cardsPerRow = 4;
    let html = '<div class="row">';
    sortedEvents.forEach((event, idx) => {
        const isLastInRow = (idx + 1) % cardsPerRow === 0;
        html += `
            <div class="col-md-4 col-lg-3 mb-4">
                <div class="card h-100${!isLastInRow ? ' event-card-separator' : ''}">
                    <div class="card-body">
                        <h5 class="card-title">${event.title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${formatDate(event.date)}</h6>
                        <h6 class="card-text">${event.time || ''}</h6>
                        <h6 class="card-text">${event.venue || ''}</h6>
                        <p class="card-text">${event.description || ''}</p>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    eventList.innerHTML = html;
}

/**
 * Shows the next upcoming event in a dedicated card.
 */
function showNextUpcomingEvent() {
    const now = new Date();
    const futureEvents = allEvents
        .filter(ev => new Date(ev.date) >= now)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    const nextEvent = futureEvents[0];
    const card = document.getElementById('nextEventCard');
    if (!card) return;
    if (nextEvent) {
        document.getElementById('nextEventTitle').textContent = nextEvent.title;
        document.getElementById('nextEventDate').textContent = `Date: ${formatDate(nextEvent.date)}`;
        document.getElementById('nextEventTime').textContent = nextEvent.time ? `Time: ${nextEvent.time}` : '';
        document.getElementById('nextEventVenue').textContent = nextEvent.venue ? `Venue: ${nextEvent.venue}` : '';
        document.getElementById('nextEventDescription').textContent = nextEvent.description || '';
        card.classList.remove('d-none');
    } else {
        card.classList.add('d-none');
    }
}

// ==============================
// 13. Utility Functions
// ==============================

/**
 * Returns initials from first and last name.
 */
function getInitials(firstName, lastName) {
    let initials = "";
    if (firstName) initials += firstName[0];
    if (lastName) initials += lastName[0];
    return initials.toUpperCase();
}

/**
 * Generates a pastel color for avatar backgrounds based on name.
 */
function generateAvatarColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 60%, 70%)`;
}

/**
 * Formats a date string to a readable format.
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

/**
 * Shows a simple alert message (replace with custom UI as needed).
 * @param {string} message - The message to display.
 * @param {string} type - The type of alert ('info', 'success', 'danger', etc.).
 */
function showAlert(message, type = 'info') {
    // Use Bootstrap alert or a custom alert container if available
    const alertContainer = document.getElementById('alertContainer');
    if (alertContainer) {
        // Create a new alert div
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        alertContainer.appendChild(alertDiv);
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            alertDiv.classList.remove('show');
            alertDiv.classList.add('hide');
            setTimeout(() => alertDiv.remove(), 500);
        }, 5000);
    } else {
        // Fallback to browser alert
        alert(message);
    }
}

// ==============================
// 14. Dashboard Export & DOM Ready
// ==============================

window.Dashboard = {
    initializeDashboard,
    loadUserProfile,
    showSection,
    loadAlumniDirectory
};

// Initialize dashboard features on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Add Event Modal logic
    const addEventBtn = document.getElementById('addEventBtn');
    if (addEventBtn) {
        addEventBtn.addEventListener('click', function() {
            const eventModal = new bootstrap.Modal(document.getElementById('eventModal'));
            eventModal.show();
        });
    }
    // Event form submission
    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const title = document.getElementById('eventTitle').value;
            const date = document.getElementById('eventDate').value;
            const description = document.getElementById('eventDescription').value;
            await saveEvent(title, date, description);
            bootstrap.Modal.getInstance(document.getElementById('eventModal')).hide();
        });
    }
});

// Event save in dashboard.js
async function saveEvent(title, date, description) {
    const time = document.getElementById('eventTime').value;
    const venue = document.getElementById('eventVenue').value;
    const response = await fetch(`${API_BASE}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, time, venue, description }) // <-- Add time, venue
    });
    if (response.ok) {
        // Success: reload events
        loadEvents();
    }
}

async function loadEvents() {
    const response = await fetch(`${API_BASE}/api/events`);
    if (response.ok) {
        allEvents = await response.json();
        renderEventList();
        showNextUpcomingEvent(); // <-- Add this line
    }
}

function renderEventList() {
    const eventList = document.getElementById('eventList');
    if (!eventList) return;

    if (allEvents.length === 0) {
        eventList.innerHTML = `
            <div class="card mb-3">
                <div class="card-body text-center text-muted">
                    <i class="fas fa-calendar-times fa-2x mb-2"></i>
                    <p class="mb-0">No events to show yet.</p>
                </div>
            </div>
        `;
        return;
    }

    // Sort events by date (latest first)
    const sortedEvents = [...allEvents].sort((a, b) => new Date(b.date) - new Date(a.date));

    // 4 columns per row (col-lg-3)
    const cardsPerRow = 4;
    let html = '<div class="row">';
    sortedEvents.forEach((event, idx) => {
        const isLastInRow = (idx + 1) % cardsPerRow === 0;
        html += `
            <div class="col-md-4 col-lg-3 mb-4">
                <div class="card h-100${!isLastInRow ? ' event-card-separator' : ''}">
                    <div class="card-body">
                        <h5 class="card-title">${event.title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${formatDate(event.date)}</h6>
                        <h6 class="card-text">${event.time || ''}</h6>
                        <h6 class="card-text">${event.venue || ''}</h6>
                        <p class="card-text">${event.description || ''}</p>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    eventList.innerHTML = html;
}

function showNextUpcomingEvent() {
    const now = new Date();
    const futureEvents = allEvents
        .filter(ev => new Date(ev.date) >= now)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    const nextEvent = futureEvents[0];

    const card = document.getElementById('nextEventCard');
    if (!card) return;

    if (nextEvent) {
        document.getElementById('nextEventTitle').textContent = nextEvent.title;
        document.getElementById('nextEventDate').textContent = `Date: ${formatDate(nextEvent.date)}`;
        document.getElementById('nextEventTime').textContent = nextEvent.time ? `Time: ${nextEvent.time}` : '';
        document.getElementById('nextEventVenue').textContent = nextEvent.venue ? `Venue: ${nextEvent.venue}` : '';
        document.getElementById('nextEventDescription').textContent = nextEvent.description || '';
        card.classList.remove('d-none');
    } else {
        card.classList.add('d-none');
    }
}

if (res.ok) {
    localStorage.setItem('token', data.token); // Save token to localStorage
    showAlert('Login successful! Redirecting to dashboard...', 'success');
    setTimeout(() => {
        redirectToDashboard();
    }, 1000); // Redirect after 1 second
    window.location.href = 'dashboard.html';
}
