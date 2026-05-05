import { openModal } from "./components/modals.js";
import { getDoctors, filterDoctors, saveDoctor } from "./services/doctorServices.js";
import { createDoctorCard } from "./components/doctorCard.js";

function getContentDiv() {
  return document.getElementById("content");
}

function getTimeFilterEl() {
  return document.getElementById("filterTime") || document.getElementById("sortByTime");
}

function getSpecialtyFilterEl() {
  return document.getElementById("filterSpecialty") || document.getElementById("filterBySpecialty");
}

function bindAddDoctorButton() {
  const addDocBtn = document.getElementById("addDocBtn");
  if (!addDocBtn || addDocBtn.dataset.bound === "true") {
    return;
  }

  addDocBtn.addEventListener("click", () => {
    openModal("addDoctor");
  });
  addDocBtn.dataset.bound = "true";
}

export async function loadDoctorCards() {
  const contentDiv = getContentDiv();
  if (!contentDiv) {
    return;
  }

  try {
    const doctors = await getDoctors();
    renderDoctorCards(doctors);
  } catch (error) {
    console.error("Failed to load doctors:", error);
    contentDiv.innerHTML = "<p>No doctors found</p>";
  }
}

export function renderDoctorCards(doctors) {
  const contentDiv = getContentDiv();
  if (!contentDiv) {
    return;
  }

  contentDiv.innerHTML = "";

  if (!Array.isArray(doctors) || doctors.length === 0) {
    contentDiv.innerHTML = "<p>No doctors found</p>";
    return;
  }

  doctors.forEach((doctor) => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}

export async function filterDoctorsOnChange() {
  const searchValue = document.getElementById("searchBar")?.value?.trim() || "";
  const timeValue = getTimeFilterEl()?.value || "";
  const specialtyValue = getSpecialtyFilterEl()?.value || "";

  const name = searchValue.length > 0 ? searchValue : null;
  const time = timeValue.length > 0 ? timeValue : null;
  const specialty = specialtyValue.length > 0 ? specialtyValue : null;

  try {
    const response = await filterDoctors(name, time, specialty);
    const doctors = Array.isArray(response?.doctors) ? response.doctors : [];
    renderDoctorCards(doctors);
  } catch (error) {
    console.error("Failed to filter doctors:", error);
    alert("Failed to filter doctors.");
  }
}

window.adminAddDoctor = async function adminAddDoctor() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Session expired. Please login again.");
    return;
  }

  const doctorName = document.getElementById("doctorName")?.value?.trim() || "";
  const specialization = document.getElementById("specialization")?.value?.trim() || "";
  const doctorEmail = document.getElementById("doctorEmail")?.value?.trim() || "";
  const doctorPassword = document.getElementById("doctorPassword")?.value || "";
  const doctorPhone = document.getElementById("doctorPhone")?.value?.trim() || "";
  const availabilityTimes = Array.from(document.querySelectorAll("input[name='availability']:checked")).map(
    (el) => el.value
  );

  if (!doctorName || !specialization || !doctorEmail || !doctorPassword || !doctorPhone || availabilityTimes.length === 0) {
    alert("Please fill all doctor details including availability.");
    return;
  }

  const doctor = {
    name: doctorName,
    specialty: specialization,
    email: doctorEmail,
    password: doctorPassword,
    phone: doctorPhone,
    availableTimes: availabilityTimes,
  };

  const result = await saveDoctor(doctor, token);
  if (result.success) {
    alert(result.message || "Doctor added successfully.");
    const modal = document.getElementById("modal");
    if (modal) {
      modal.style.display = "none";
    }
    await loadDoctorCards();
    return;
  }

  alert(result.message || "Failed to add doctor.");
};

document.addEventListener("DOMContentLoaded", () => {
  loadDoctorCards();

  const searchBar = document.getElementById("searchBar");
  if (searchBar) {
    searchBar.addEventListener("input", filterDoctorsOnChange);
  }

  const timeFilter = getTimeFilterEl();
  if (timeFilter) {
    timeFilter.addEventListener("change", filterDoctorsOnChange);
  }

  const specialtyFilter = getSpecialtyFilterEl();
  if (specialtyFilter) {
    specialtyFilter.addEventListener("change", filterDoctorsOnChange);
  }

  bindAddDoctorButton();
  setTimeout(bindAddDoctorButton, 150);
});
