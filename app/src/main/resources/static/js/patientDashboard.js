import { createDoctorCard } from "./components/doctorCard.js";
import { openModal } from "./components/modals.js";
import { getDoctors, filterDoctors } from "./services/doctorServices.js";
import { patientLogin, patientSignup } from "./services/patientServices.js";

function getContentDiv() {
  return document.getElementById("content");
}

async function loadDoctorCards() {
  const contentDiv = getContentDiv();
  if (!contentDiv) {
    return;
  }

  try {
    const doctors = await getDoctors();
    renderDoctorCards(doctors);
  } catch (error) {
    console.error("Failed to load doctors:", error);
    contentDiv.innerHTML = "<p>No doctors found with the given filters.</p>";
  }
}

async function filterDoctorsOnChange() {
  const searchValue = document.getElementById("searchBar")?.value?.trim() || "";
  const filterTime = document.getElementById("filterTime")?.value || "";
  const filterSpecialty = document.getElementById("filterSpecialty")?.value || "";

  const name = searchValue.length > 0 ? searchValue : null;
  const time = filterTime.length > 0 ? filterTime : null;
  const specialty = filterSpecialty.length > 0 ? filterSpecialty : null;

  const contentDiv = getContentDiv();
  if (!contentDiv) {
    return;
  }

  try {
    const response = await filterDoctors(name, time, specialty);
    const doctors = Array.isArray(response?.doctors) ? response.doctors : [];
    renderDoctorCards(doctors);
  } catch (error) {
    console.error("Failed to filter doctors:", error);
    contentDiv.innerHTML = "<p>No doctors found with the given filters.</p>";
  }
}

export function renderDoctorCards(doctors) {
  const contentDiv = getContentDiv();
  if (!contentDiv) {
    return;
  }

  contentDiv.innerHTML = "";

  if (!Array.isArray(doctors) || doctors.length === 0) {
    contentDiv.innerHTML = "<p>No doctors found with the given filters.</p>";
    return;
  }

  doctors.forEach((doctor) => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}

function bindModalButtons() {
  const signupBtn = document.getElementById("patientSignup");
  if (signupBtn) {
    signupBtn.addEventListener("click", () => openModal("patientSignup"));
  }

  const loginBtn = document.getElementById("patientLogin");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => openModal("patientLogin"));
  }
}

function bindFilterInputs() {
  const searchBar = document.getElementById("searchBar");
  const filterTime = document.getElementById("filterTime");
  const filterSpecialty = document.getElementById("filterSpecialty");

  if (searchBar) {
    searchBar.addEventListener("input", filterDoctorsOnChange);
  }
  if (filterTime) {
    filterTime.addEventListener("change", filterDoctorsOnChange);
  }
  if (filterSpecialty) {
    filterSpecialty.addEventListener("change", filterDoctorsOnChange);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadDoctorCards();
  bindModalButtons();
  bindFilterInputs();
});

window.signupPatient = async function () {
  try {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    const data = { name, email, password, phone, address };
    const { success, message } = await patientSignup(data);
    if (success) {
      alert(message);
      const modal = document.getElementById("modal");
      if (modal) {
        modal.style.display = "none";
      }
      window.location.reload();
    } else {
      alert(message);
    }
  } catch (error) {
    console.error("Signup failed:", error);
    alert("❌ An error occurred while signing up.");
  }
};

window.loginPatient = async function () {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const data = {
      email,
      password
    }
    const response = await patientLogin(data);
    if (response.ok) {
      const result = await response.json();
      localStorage.setItem("token", result.token);
      if (typeof selectRole === "function") {
        selectRole("loggedPatient");
      } else {
        localStorage.setItem("userRole", "loggedPatient");
      }
      window.location.href = "/pages/loggedPatientDashboard.html";
    } else {
      alert("❌ Invalid credentials!");
    }
  } catch (error) {
    console.error("Error :: loginPatient ::", error);
    alert("❌ Failed to Login.");
  }
};
