function toggleDetails(button) {
  const details = button.nextElementSibling;
  const visible = details.style.display === "block";
  details.style.display = visible ? "none" : "block";
  button.textContent = visible ? "View Details" : "Hide Details";
}

