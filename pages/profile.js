<script>
  let currentUserData = {};

  document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/user/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch profile');
      currentUserData = await response.json();

      updateProfileDisplay(currentUserData);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load profile data');
      window.location.href = 'login.html';
    }
  });

  function updateProfileDisplay(data) {
    document.getElementById('full-name').textContent = data.fullName;
    document.getElementById('email').textContent = data.email;
    document.getElementById('course').textContent = data.course;
    document.getElementById('batch').textContent = `Batch ${data.batch}`;
    document.getElementById('reg-number').textContent = data.registrationNumber;
    document.getElementById('job').textContent = data.job || 'Not specified';
    document.getElementById('location').textContent = data.location || 'Not specified';
    document.getElementById('father-name').textContent = data.fatherName || 'Not specified';
  }

  function toggleEditModal() {
    const modal = document.getElementById('edit-modal');
    const form = document.getElementById('edit-form');

    if (modal.classList.contains('hidden')) {
      for (let key in currentUserData) {
        const input = form.elements.namedItem(key);
        if (input) input.value = currentUserData[key] || '';
      }
      modal.classList.remove('hidden');
    } else {
      modal.classList.add('hidden');
    }
  }

  document.getElementById('edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {};
    formData.forEach((value, key) => updatedData[key] = value);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) throw new Error('Update failed');
      currentUserData = await response.json();
      updateProfileDisplay(currentUserData);
      toggleEditModal();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    }
  });
</script>
