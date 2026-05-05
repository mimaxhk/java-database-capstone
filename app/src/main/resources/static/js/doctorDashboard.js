import { getAllAppointments } from "./services/appointmentRecordService.js";
import { createPatientRow } from "./components/patientRows.js";

const patientTableBody = document.getElementById("patientTableBody");
let selectedDate = new Date().toISOString().split("T")[0];
const token = localStorage.getItem("token");
let patientName = null;

function showTableMessage(message) {
  if (!patientTableBody) {
    return;
  }

  patientTableBody.innerHTML = "";
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.colSpan = 5;
  cell.className = "noPatientRecord";
  cell.textContent = message;
  row.appendChild(cell);
  patientTableBody.appendChild(row);
}

async function loadAppointments() {
  if (!patientTableBody) {
    return;
  }

  try {
    const searchName = patientName && patientName.trim() ? patientName.trim() : "null";
    const appointments = await getAllAppointments(selectedDate, searchName, token);

    patientTableBody.innerHTML = "";

    if (!Array.isArray(appointments) || appointments.length === 0) {
      showTableMessage("No Appointments found for today");
      return;
    }

    appointments.forEach((appointment) => {
      const patient = {
        id: appointment.patientId,
        name: appointment.patientName,
        phone: appointment.patientPhone,
        email: appointment.patientEmail,
      };

      const row = createPatientRow(patient, appointment.id, appointment.doctorId);
      patientTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading appointments:", error);
    showTableMessage("Error loading appointments. Try again later.");
  }
}

function bindEvents() {
  const searchBar = document.getElementById("searchBar");
  const todayButton = document.getElementById("todayButton");
  const datePicker = document.getElementById("datePicker");

  if (searchBar) {
    searchBar.addEventListener("input", (event) => {
      const value = event.target.value.trim();
      patientName = value.length > 0 ? value : "null";
      loadAppointments();
    });
  }

  if (todayButton) {
    todayButton.addEventListener("click", () => {
      selectedDate = new Date().toISOString().split("T")[0];
      if (datePicker) {
        datePicker.value = selectedDate;
      }
      loadAppointments();
    });
  }

  if (datePicker) {
    datePicker.value = selectedDate;
    datePicker.addEventListener("change", (event) => {
      selectedDate = event.target.value || new Date().toISOString().split("T")[0];
      loadAppointments();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof renderContent === "function") {
    renderContent();
  }

  bindEvents();
  loadAppointments();
});
