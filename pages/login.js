// fetch("http://localhost:5000/api/auth/login", {...}) // Removed incomplete statement causing syntax error

/* SWITCHER FOR SIGN IN AND SIGN UP FORM */
// This script handles the switching between the sign-in and sign-up forms in a web application.
// It adds event listeners to the sign-in and sign-up buttons,
// which toggle the "sign-up-mode" class on the container element.
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener('click', () =>{
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener('click', () =>{
    container.classList.remove("sign-up-mode");
});


/* LOGIN FROM SIGN IN FORM */
// This script handles the login form submission for a web application.
// It captures the email and password input values, sends them to the server for authentication,
// and handles the server's response. If the login is successful, it stores the JWT token in local storage.
// It also provides feedback to the user based on the server's response.
// This script is intended to be used in a web application where users can log in using their credentials.
const loginForm = document.querySelector('.sign-in-form');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = loginForm.querySelector('input[placeholder="Username"]').value;
  const password = loginForm.querySelector('input[placeholder="Password"]').value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Login successful 🎉");
      localStorage.setItem("token", data.token); // save JWT token
      // Optionally redirect
     window.location.href = "profile.html";
    } else {
      alert(data.error || "Login failed");
    }
  } catch (err) {
    alert("Server error: " + err.message);
  }
});

/* Signup Form Submission */
// This script handles the signup form submission for a web application.
// It captures the user's full name, father's name, course, batch, registration number, email, and password,
// sends them to the server for registration, and handles the server's response.
// If the registration is successful, it provides feedback to the user.
// This script is intended to be used in a web application where users can create an account.
const signupForm = document.querySelector('.sign-up-form');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fullName = signupForm.querySelector('input[placeholder="Full name"]').value;
  const fatherName = signupForm.querySelector('input[placeholder="Father name"]').value;
  const course = signupForm.querySelector('#courseSelect').value;
  const batch = signupForm.querySelector('#monthYear').value;
  const registrationNumber = signupForm.querySelector('input[placeholder="Registarion number"]').value;
  const email = signupForm.querySelector('input[placeholder="Email"]').value;
  const password = signupForm.querySelector('input[placeholder="Password"]').value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fullName,
        fatherName,
        course,
        batch,
        registrationNumber,
        email,
        password
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Signup successful 🎉");
      document.querySelector(".container").classList.remove("sign-up-mode"); // Switch to login
    } else {
      alert(data.error || "Signup failed");
    }
  } catch (err) {
    alert("Server error: " + err.message);
  }
});
// Redirect to profile page after successful login
