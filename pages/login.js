// Alumni Portal JavaScript
// ========================

// Department data structure for course-based filtering
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

// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const courseSelect = document.getElementById('course');
const departmentSelect = document.getElementById('department');
const messageContainer = document.getElementById('messageContainer');
const messageText = document.getElementById('messageText');
const messageElement = document.getElementById('message');

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});

// Event Listeners Setup
// ====================
function initializeEventListeners() {
    // Course selection change event
    courseSelect.addEventListener('change', handleCourseChange);
    
    // Form submissions
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    document.getElementById('signupFormElement').addEventListener('submit', handleSignup);
    
    // Real-time validation
    setupRealTimeValidation();
    
    // Prevent form submission on Enter key in certain fields
    preventEnterSubmission();
}

// Dynamic Department Loading
// =========================
function handleCourseChange() {
    const selectedCourse = courseSelect.value;
    const departmentDropdown = document.getElementById('department');
    
    // Clear existing options
    departmentDropdown.innerHTML = '<option value="">Select Department</option>';
    
    if (selectedCourse && departmentData[selectedCourse]) {
        // Enable department dropdown
        departmentDropdown.disabled = false;
        
        // Populate departments based on selected course
        departmentData[selectedCourse].forEach(dept => {
            const option = document.createElement('option');
            option.value = dept;
            option.textContent = dept;
            departmentDropdown.appendChild(option);
        });
        
        // Add smooth transition effect
        departmentDropdown.style.opacity = '0.5';
        setTimeout(() => {
            departmentDropdown.style.opacity = '1';
        }, 150);
    } else {
        // Disable department dropdown if no course selected
        departmentDropdown.disabled = true;
    }
}

// Form Switching Functions
// =======================
function switchToSignup() {
    loginForm.classList.remove('active');
    signupForm.classList.add('active');
    
    // Clear any existing messages
    hideMessage();
    
    // Reset forms
    document.getElementById('loginFormElement').reset();
}

function switchToLogin() {
    signupForm.classList.remove('active');
    loginForm.classList.add('active');
    
    // Clear any existing messages
    hideMessage();
    
    // Reset forms
    document.getElementById('signupFormElement').reset();
    
    // Reset department dropdown
    document.getElementById('department').disabled = true;
    document.getElementById('department').innerHTML = '<option value="">Select Department</option>';
}

// Password Toggle Functionality
// =============================
function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = passwordInput.nextElementSibling;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Validation Functions
// ===================
function validateRegistrationNumber(regNo) {
    // Registration number should be alphanumeric and at least 6 characters
    const regNoPattern = /^[A-Za-z0-9]{6,}$/;
    return regNoPattern.test(regNo);
}

function validatePassingYear(year) {
    const currentYear = new Date().getFullYear();
    const numYear = parseInt(year);
    return numYear >= 1970 && numYear <= 2025;
}

function validatePassword(password) {
    // Password should be at least 8 characters with at least one number and one letter
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordPattern.test(password);
}

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Real-time Validation Setup
// ==========================
function setupRealTimeValidation() {
    // Registration number validation
    const regNoInputs = ['regNumber', 'loginRegNo'];
    regNoInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('blur', function() {
                validateField(this, validateRegistrationNumber(this.value), 'Invalid registration number format');
            });
        }
    });
    
    // Passing year validation
    const yearInput = document.getElementById('signupPassingYear');
    if (yearInput) {
        yearInput.addEventListener('blur', function() {
            validateField(this, validatePassingYear(this.value), 'Year must be between 1970 and 2025');
        });
    }
    
    // Password validation
    const passwordInput = document.getElementById('signupPassword');
    if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
            validateField(this, validatePassword(this.value), 'Password must be at least 8 characters with letters and numbers');
        });
    }
    
    // Confirm password validation
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('blur', function() {
            const password = document.getElementById('signupPassword').value;
            validateField(this, this.value === password, 'Passwords do not match');
        });
    }
}

// Field Validation Helper
// ======================
function validateField(inputElement, isValid, errorMessage) {
    const inputWrapper = inputElement.parentElement;
    
    // Remove existing validation classes
    inputWrapper.classList.remove('error', 'success');
    
    // Remove existing error message
    const existingError = inputWrapper.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    if (inputElement.value.trim() === '') {
        return; // Don't validate empty fields during real-time validation
    }
    
    if (isValid) {
        inputWrapper.classList.add('success');
        inputElement.style.borderColor = '#48bb78';
    } else {
        inputWrapper.classList.add('error');
        inputElement.style.borderColor = '#f56565';
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#f56565';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = errorMessage;
        inputWrapper.appendChild(errorDiv);
    }
}

// Signup Data Validation
// ======================
function validateSignupData(data) {
    // Check required fields
    if (!data.name || !data.fatherName || !data.course || !data.department || 
        !data.regNo || !data.passingYear || !data.password || !data.confirmPassword) {
        return { isValid: false, message: 'Please fill in all required fields' };
    }
    
    // Validate registration number
    if (!validateRegistrationNumber(data.regNo)) {
        return { isValid: false, message: 'Invalid registration number format' };
    }
    
    // Check if registration number already exists
    const existingUsers = getStoredUsers();
    if (existingUsers.find(user => user.regNo === data.regNo)) {
        return { isValid: false, message: 'Registration number already exists' };
    }
    
    // Validate passing year
    if (!validatePassingYear(data.passingYear)) {
        return { isValid: false, message: 'Year must be between 1970 and 2025' };
    }
    
    // Validate password
    if (!validatePassword(data.password)) {
        return { isValid: false, message: 'Password must be at least 8 characters with letters and numbers' };
    }
    
    // Check password confirmation
    if (data.password !== data.confirmPassword) {
        return { isValid: false, message: 'Passwords do not match' };
    }
    
    return { isValid: true };
}

// Local Storage Functions
// ======================
function getStoredUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// Token Management Functions
// ==========================
function getAuthToken() {
    return localStorage.getItem('authToken');
}

function removeAuthToken() {
    localStorage.removeItem('authToken');
}

function isUserLoggedIn() {
    return !!getAuthToken();
}

// Message Display Functions
// ========================
function showMessage(text, type = 'success') {
    messageText.textContent = text;
    messageElement.className = `message ${type}`;
    
    // Update icon based on type
    const icon = messageElement.querySelector('i');
    if (type === 'success') {
        icon.className = 'fas fa-check-circle';
    } else if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
    }
    
    messageContainer.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideMessage();
    }, 5000);
}

function hideMessage() {
    messageContainer.classList.remove('show');
}

// Loading State Functions
// ======================
function showLoadingState(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
        const span = button.querySelector('span');
        span.textContent = 'Processing...';
    } else {
        button.classList.remove('loading');
        button.disabled = false;
        const span = button.querySelector('span');
        // Restore original text based on button context
        if (button.closest('#loginForm')) {
            span.textContent = 'Sign In';
        } else {
            span.textContent = 'Create Account';
        }
    }
}

// Prevent Enter Submission Helper
// ==============================
function preventEnterSubmission() {
    // This can be implemented if needed to prevent form submission on Enter in specific fields
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

// API Configuration
// =================
const API_BASE_URL = 'http://localhost:5000';

// API Helper Functions
// ===================
async function makeApiCall(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }
        
        return result;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Form Submission Handlers
// =======================
async function handleLogin(e) {
    e.preventDefault();
    
    const loginData = {
        regNo: document.getElementById('loginRegNo').value.trim(),
        password: document.getElementById('loginPassword').value
    };
    
    // Validate required fields
    if (!loginData.regNo || !loginData.password) {
        showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate registration number format
    if (!validateRegistrationNumber(loginData.regNo)) {
        showMessage('Invalid registration number format', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    showLoadingState(submitBtn, true);
    
    try {
        // Send login request to backend
        const response = await makeApiCall('/api/auth/login', 'POST', loginData);
        
        showLoadingState(submitBtn, false);
        
        if (response.success) {
            // Store token if provided
            if (response.token) {
                localStorage.setItem('authToken', response.token);
            }
            
            showMessage(`Welcome back, ${response.user?.name || 'User'}!`, 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = response.redirectUrl || '/dashboard.html';
            }, 1500);
        } else {
            showMessage(response.message || 'Login failed', 'error');
        }
    } catch (error) {
        showLoadingState(submitBtn, false);
        
        if (error.message.includes('fetch')) {
            showMessage('Unable to connect to server. Please check if the backend is running.', 'error');
        } else {
            showMessage(error.message || 'Login failed. Please try again.', 'error');
        }
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const signupData = {
        name: document.getElementById('name').value.trim(),
        fatherName: document.getElementById('fatherName').value.trim(),
        course: document.getElementById('course').value,
        department: document.getElementById('department').value,
        regNo: document.getElementById('regNumber').value.trim(),
        passingYear: document.getElementById('signupPassingYear').value,
        password: document.getElementById('signupPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };
    
    // Comprehensive validation
    const validationResult = validateSignupData(signupData);
    if (!validationResult.isValid) {
        showMessage(validationResult.message, 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    showLoadingState(submitBtn, true);
    
    try {
        // Remove confirmPassword before sending to backend
        const { confirmPassword, ...dataToSend } = signupData;
        
        // Send signup request to backend
        const response = await makeApiCall('/api/auth/register', 'POST', dataToSend);
        
        showLoadingState(submitBtn, false);
        
        if (response.success) {
            showMessage('Account created successfully! You can now sign in.', 'success');
            
            // Switch to login after delay
            setTimeout(() => {
                switchToLogin();
            }, 2000);
        } else {
            showMessage(response.message || 'Signup failed', 'error');
        }
    } catch (error) {
        showLoadingState(submitBtn, false);
        
        if (error.message.includes('fetch')) {
            showMessage('Unable to connect to server. Please check if the backend is running.', 'error');
        } else {
            showMessage(error.message || 'Signup failed. Please try again.', 'error');
        }
    }
}