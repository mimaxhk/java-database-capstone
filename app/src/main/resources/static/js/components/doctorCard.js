/**
 * Doctor Card Component
 * Creates reusable doctor card elements for displaying doctor information
 */

/**
 * Creates a doctor card element with role-specific actions
 * @param {Object} doctor - Doctor object containing name, specialty, email, availableTimes, etc.
 * @returns {HTMLElement} - A div element containing the formatted doctor card
 */
export function createDoctorCard(doctor) {
    // Create main card container
    const card = document.createElement("div");
    card.classList.add("doctor-card");
  
    // Get the user's role from localStorage
    const role = localStorage.getItem("userRole");
  
    // Create doctor info section
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("doctor-info");
  
    // Create name element
    const name = document.createElement("h3");
    name.textContent = doctor.name || "Unknown Doctor";
    infoDiv.appendChild(name);
  
    // Create specialty element
    const specialty = document.createElement("p");
    specialty.textContent = `Specialty: ${doctor.specialty || "General Practice"}`;
    infoDiv.appendChild(specialty);
  
    // Create email element
    const email = document.createElement("p");
    email.textContent = `Email: ${doctor.email || "N/A"}`;
    infoDiv.appendChild(email);
  
    // Create availability element
    const availability = document.createElement("p");
    if (doctor.availableTimes && Array.isArray(doctor.availableTimes)) {
      availability.textContent = `Available: ${doctor.availableTimes.join(", ")}`;
    } else {
      availability.textContent = `Available: ${doctor.availableTimes || "N/A"}`;
    }
    infoDiv.appendChild(availability);
  
    // Append info section to card
    card.appendChild(infoDiv);
  
    // Create actions container
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("card-actions");
  
    // Add role-specific buttons
    if (role === "admin") {
      // Admin: Add delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("admin-delete-btn");
  
      deleteBtn.addEventListener("click", async () => {
        if (confirm(`Are you sure you want to delete ${doctor.name}?`)) {
          try {
            const token = localStorage.getItem("token");
            const response = await fetch(`/doctor/${doctor.id}/${token}`, {
              method: "DELETE",
            });
  
            if (response.ok) {
              // Remove card from DOM
              card.remove();
              alert(`${doctor.name} has been deleted successfully.`);
            } else {
              alert("Failed to delete the doctor. Please try again.");
            }
          } catch (error) {
            console.error("Error deleting doctor:", error);
            alert("Error deleting doctor. Please try again.");
          }
        }
      });
  
      actionsDiv.appendChild(deleteBtn);
    } else if (role === "patient") {
      // Patient not logged in: Show book button with login alert
      const bookBtn = document.createElement("button");
      bookBtn.textContent = "Book Now";
      bookBtn.classList.add("book-now-btn");
  
      bookBtn.addEventListener("click", () => {
        alert("Please log in to book an appointment with this doctor.");
        localStorage.setItem("userRole", "patient");
        window.location.href = "./patientDashboard.html";
      });
  
      actionsDiv.appendChild(bookBtn);
    } else if (role === "loggedPatient") {
      // Logged-in patient: Show functional book button
      const bookBtn = document.createElement("button");
      bookBtn.textContent = "Book Now";
      bookBtn.classList.add("book-now-btn");
  
      bookBtn.addEventListener("click", async (e) => {
        try {
          const token = localStorage.getItem("token");
  
          // Fetch patient data
          const patientResponse = await fetch(`/patient/${token}`);
          const patientData = await patientResponse.json();
  
          // Show booking overlay/modal with doctor and patient info
          showBookingOverlay(e, doctor, patientData);
        } catch (error) {
          console.error("Error fetching patient data:", error);
          alert("Error preparing booking. Please try again.");
        }
      });
  
      actionsDiv.appendChild(bookBtn);
    }
  
    // Append actions to card
    card.appendChild(actionsDiv);
  
    // Return the complete card
    return card;
  }
  
  /**
   * Shows a booking overlay/modal for patient to book appointment
   * @param {Event} event - The click event
   * @param {Object} doctor - Doctor object
   * @param {Object} patientData - Patient object with details
   */
  function showBookingOverlay(event, doctor, patientData) {
    // Get or create modal
    let modal = document.getElementById("modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "modal";
      modal.classList.add("modal");
      document.body.appendChild(modal);
    }
  
    // Show modal
    modal.classList.add("show");
  
    // Create booking form content
    const modalBody = document.getElementById("modal-body");
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="booking-form">
          <h2>Book Appointment with ${doctor.name}</h2>
          <form id="bookingForm">
            <div class="form-group">
              <label for="appointmentDate">Preferred Date:</label>
              <input type="date" id="appointmentDate" required />
            </div>
            <div class="form-group">
              <label for="appointmentTime">Preferred Time:</label>
              <select id="appointmentTime" required>
                <option value="">Select Time</option>
                ${
                  doctor.availableTimes && Array.isArray(doctor.availableTimes)
                    ? doctor.availableTimes
                        .map((time) => `<option value="${time}">${time}</option>`)
                        .join("")
                    : ""
                }
              </select>
            </div>
            <div class="form-group">
              <label for="appointmentNotes">Notes (Optional):</label>
              <textarea id="appointmentNotes" rows="3"></textarea>
            </div>
            <button type="submit" class="confirm-booking">Confirm Booking</button>
          </form>
        </div>
      `;
  
      // Handle form submission
      const form = document.getElementById("bookingForm");
      if (form) {
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          await submitBooking(doctor, patientData);
        });
      }
    }
  }
  
  /**
   * Submits the booking to the backend
   * @param {Object} doctor - Doctor object
   * @param {Object} patientData - Patient data
   */
  async function submitBooking(doctor, patientData) {
    try {
      const date = document.getElementById("appointmentDate").value;
      const time = document.getElementById("appointmentTime").value;
      const notes = document.getElementById("appointmentNotes").value;
      const token = localStorage.getItem("token");
  
      const bookingData = {
        doctorId: doctor.id,
        patientId: patientData.id,
        appointmentDate: date,
        appointmentTime: time,
        notes: notes,
      };
  
      const response = await fetch(`/appointments/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
  
      if (response.ok) {
        alert("Appointment booked successfully!");
        // Close modal
        const modal = document.getElementById("modal");
        if (modal) {
          modal.classList.remove("show");
        }
        // Optionally redirect to appointments page
        window.location.href = "./patientAppointments.html";
      } else {
        alert("Failed to book appointment. Please try again.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Error booking appointment. Please try again.");
    }
  }
  