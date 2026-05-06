/**
 * Header Component
 * Dynamically renders the header based on user role and authentication status
 */

/**
 * Renders the header with role-specific navigation and buttons
 */
function renderHeader() {
  // Get the header container
  const headerDiv = document.getElementById("header");

  // Check if we're on the homepage - don't show role-based header there
  if (window.location.pathname.endsWith("/")) {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    headerDiv.innerHTML = `
      <header class="header">
        <div class="logo-section">
          <img src="./assets/images/logo/logo.png" alt="Hospital CRM Logo" class="logo-img">
          <span class="logo-title">Hospital CMS</span>
        </div>
      </header>`;
    return;
  }

  // Get user role and token from localStorage
  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");

  // Initialize header content with logo section
  let headerContent = `<header class="header">
    <div class="logo-section">
      <img src="./assets/images/logo/logo.png" alt="Hospital CRM Logo" class="logo-img">
      <span class="logo-title">Hospital CMS</span>
    </div>
    <nav>`;

  // Check for invalid session: if role exists but no token, session is expired
  if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    alert("Session expired or invalid login. Please log in again.");
    window.location.href = "/";
    return;
  }

  // Build header content based on user role
  if (role === "admin") {
    headerContent += `
      <button id="addDocBtn" class="adminBtn">Add Doctor</button>
      <a href="#" onclick="logout(); return false;">Logout</a>`;
  } else if (role === "doctor") {
    headerContent += `
      <button id="doctorHome" class="adminBtn">Home</button>
      <a href="#" onclick="logout(); return false;">Logout</a>`;
  } else if (role === "patient") {
    headerContent += `
      <button id="patientLogin" class="adminBtn">Login</button>
      <button id="patientSignup" class="adminBtn">Sign Up</button>`;
  } else if (role === "loggedPatient") {
    headerContent += `
      <button id="patientHome" class="adminBtn">Home</button>
      <button id="patientAppointments" class="adminBtn">Appointments</button>
      <a href="#" onclick="logoutPatient(); return false;">Logout</a>`;
  }

  // Close nav and header tags
  headerContent += `</nav></header>`;

  // Inject the header HTML
  headerDiv.innerHTML = headerContent;

  // Attach event listeners to dynamically created elements
  attachHeaderButtonListeners();
}

/**
 * Attaches event listeners to header buttons
 */
function attachHeaderButtonListeners() {
  // Add Doctor button for admin
  const addDocBtn = document.getElementById("addDocBtn");
  if (addDocBtn) {
    addDocBtn.addEventListener("click", function(e) {
      e.preventDefault();
      openModal("addDoctor");
    });
  }

  // Home button for doctor
  const doctorHome = document.getElementById("doctorHome");
  if (doctorHome) {
    doctorHome.addEventListener("click", function(e) {
      e.preventDefault();
      window.location.href = "./doctorDashboard.html";
    });
  }

  // Home button for logged patient
  const patientHome = document.getElementById("patientHome");
  if (patientHome) {
    patientHome.addEventListener("click", function(e) {
      e.preventDefault();
      window.location.href = "./loggedPatientDashboard.html";
    });
  }

  // Appointments button for logged patient
  const patientAppointments = document.getElementById("patientAppointments");
  if (patientAppointments) {
    patientAppointments.addEventListener("click", function(e) {
      e.preventDefault();
      window.location.href = "./patientAppointments.html";
    });
  }

  // Login button for patient
  const patientLogin = document.getElementById("patientLogin");
  if (patientLogin) {
    patientLogin.addEventListener("click", function(e) {
      e.preventDefault();
      openModal("patientLogin");
    });
  }

  // Sign Up button for patient
  const patientSignup = document.getElementById("patientSignup");
  if (patientSignup) {
    patientSignup.addEventListener("click", function(e) {
      e.preventDefault();
      openModal("patientSignup");
    });
  }
}

/**
 * Logs out the current user
 * Clears session data and redirects to homepage
 */
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  alert("You have been logged out.");
  window.location.href = "/";
}

/**
 * Logs out a patient user
 * Clears session token, resets role to patient, and redirects
 */
function logoutPatient() {
  localStorage.removeItem("token");
  localStorage.setItem("userRole", "patient");
  alert("You have been logged out.");
  window.location.href = "./patientDashboard.html";
}

/**
 * Opens a modal and populates its content based on type
 * @param {string} modalType - Type of modal to open (e.g., 'addDoctor', 'patientLogin')
 */
function openModal(modalType) {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  if (!modal || !modalBody) return;

  let modalContent = '';

  if (modalType === 'patientLogin') {
    modalContent = `
      <h2>Patient Login</h2>
      <input type="text" id="email" placeholder="Email" class="input-field">
      <input type="password" id="password" placeholder="Password" class="input-field">
      <button class="dashboard-btn" id="loginBtn">Login</button>`;
  } else if (modalType === 'patientSignup') {
    modalContent = `
      <h2>Patient Signup</h2>
      <input type="text" id="name" placeholder="Name" class="input-field">
      <input type="email" id="email" placeholder="Email" class="input-field">
      <input type="password" id="password" placeholder="Password" class="input-field">
      <input type="text" id="phone" placeholder="Phone" class="input-field">
      <input type="text" id="address" placeholder="Address" class="input-field">
      <button class="dashboard-btn" id="signupBtn">Signup</button>`;
  } else if (modalType === 'addDoctor') {
    modalContent = `
      <h2>Add Doctor</h2>
      <input type="text" id="doctorName" placeholder="Doctor Name" class="input-field">
      <select id="specialization" class="input-field select-dropdown">
        <option value="">Specialization</option>
        <option value="cardiologist">Cardiologist</option>
        <option value="dermatologist">Dermatologist</option>
        <option value="neurologist">Neurologist</option>
        <option value="pediatrician">Pediatrician</option>
        <option value="orthopedic">Orthopedic</option>
        <option value="gynecologist">Gynecologist</option>
        <option value="psychiatrist">Psychiatrist</option>
        <option value="dentist">Dentist</option>
        <option value="ophthalmologist">Ophthalmologist</option>
        <option value="ent">ENT Specialist</option>
        <option value="urologist">Urologist</option>
        <option value="oncologist">Oncologist</option>
        <option value="gastroenterologist">Gastroenterologist</option>
        <option value="general">General Physician</option>
      </select>
      <input type="email" id="doctorEmail" placeholder="Email" class="input-field">
      <input type="password" id="doctorPassword" placeholder="Password" class="input-field">
      <input type="text" id="doctorPhone" placeholder="Mobile No." class="input-field">
      <div class="availability-container">
        <label class="availabilityLabel">Select Availability:</label>
        <div class="checkbox-group">
          <label><input type="checkbox" name="availability" value="09:00-10:00"> 9:00 AM - 10:00 AM</label>
          <label><input type="checkbox" name="availability" value="10:00-11:00"> 10:00 AM - 11:00 AM</label>
          <label><input type="checkbox" name="availability" value="11:00-12:00"> 11:00 AM - 12:00 PM</label>
          <label><input type="checkbox" name="availability" value="12:00-13:00"> 12:00 PM - 1:00 PM</label>
        </div>
      </div>
      <button class="dashboard-btn" id="saveDoctorBtn">Save</button>`;
  }

  modalBody.innerHTML = modalContent;
  modal.style.display = 'block';

  if (modalType === 'patientLogin') {
    document.getElementById('loginBtn')?.addEventListener('click', loginPatient);
  } else if (modalType === 'patientSignup') {
    document.getElementById('signupBtn')?.addEventListener('click', signupPatient);
  } else if (modalType === 'addDoctor') {
    document.getElementById('saveDoctorBtn')?.addEventListener('click', adminAddDoctor);
  }
}

/**
 * Closes a modal by removing the show class
 */
function closeModal() {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('show');
  }
}

/**
 * Initialize header on page load
 */
document.addEventListener("DOMContentLoaded", function() {
  const closeBtn = document.getElementById("closeModal");
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  // Close modal when clicking outside the modal content
  const modal = document.getElementById("modal");
  if (modal) {
    modal.addEventListener("click", function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Render the header
  renderHeader();
});

