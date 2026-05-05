/**
 * Main Services Module
 * Handles login authentication for Admin and Doctor roles
 */

// Import dependencies
import { openModal } from '../components/modals.js';
import { API_BASE_URL } from '../config/config.js';

// Define API endpoints
const ADMIN_API = API_BASE_URL + '/admin';
const DOCTOR_API = API_BASE_URL + '/doctor/login';

/**
 * Setup event listeners when page loads
 */
window.onload = function () {
  // Setup Admin login button
  const adminBtn = document.getElementById('adminLogin');
  if (adminBtn) {
    adminBtn.addEventListener('click', () => {
      openModal('adminLogin');
    });
  }

  // Setup Doctor login button
  const doctorBtn = document.getElementById('doctorLogin');
  if (doctorBtn) {
    doctorBtn.addEventListener('click', () => {
      openModal('doctorLogin');
    });
  }
};

/**
 * Admin Login Handler
 * Handles admin authentication and stores credentials in localStorage
 */
window.adminLoginHandler = async function () {
  try {
    // Get input values
    const username = document.getElementById('adminUsername')?.value;
    const password = document.getElementById('adminPassword')?.value;

    // Validate inputs
    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    // Create admin object
    const admin = {
      username: username,
      password: password,
    };

    // Send POST request to admin login API
    const response = await fetch(ADMIN_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(admin),
    });

    // Handle response
    if (response.ok) {
      const data = await response.json();

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', 'admin');

        // Close modal and navigate to admin dashboard
        const modal = document.getElementById('modal');
        if (modal) {
          modal.classList.remove('show');
        }

        // Redirect to admin dashboard
        window.location.href = '/templates/admin/adminDashboard.html';
      } else {
        alert('Login successful but no token received. Please try again.');
      }
    } else {
      // Handle login failure
      const errorData = await response.json();
      alert(errorData.message || 'Invalid credentials. Please try again.');
    }
  } catch (error) {
    console.error('Admin login error:', error);
    alert('An error occurred during login. Please try again later.');
  }
};

/**
 * Doctor Login Handler
 * Handles doctor authentication and stores credentials in localStorage
 */
window.doctorLoginHandler = async function () {
  try {
    // Get input values
    const email = document.getElementById('doctorEmail')?.value;
    const password = document.getElementById('doctorPassword')?.value;

    // Validate inputs
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    // Create doctor object
    const doctor = {
      email: email,
      password: password,
    };

    // Send POST request to doctor login API
    const response = await fetch(DOCTOR_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctor),
    });

    // Handle response
    if (response.ok) {
      const data = await response.json();

      // Store token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', 'doctor');

        // Close modal and navigate to doctor dashboard
        const modal = document.getElementById('modal');
        if (modal) {
          modal.classList.remove('show');
        }

        // Redirect to doctor dashboard
        window.location.href = '/templates/doctor/doctorDashboard.html';
      } else {
        alert('Login successful but no token received. Please try again.');
      }
    } else {
      // Handle login failure
      const errorData = await response.json();
      alert(errorData.message || 'Invalid credentials. Please try again.');
    }
  } catch (error) {
    console.error('Doctor login error:', error);
    alert('An error occurred during login. Please try again later.');
  }
};
