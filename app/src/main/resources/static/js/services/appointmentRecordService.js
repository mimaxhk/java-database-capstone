// appointmentRecordService.js
import { API_BASE_URL } from "../config/config.js";
const APPOINTMENT_API = `${API_BASE_URL}/appointments`;


//This is for the doctor to get all the patient Appointments
export async function getAllAppointments(date, patientName, token) {
  const response = await fetch(`${APPOINTMENT_API}/${date}/${patientName}/${token}`);
  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }

  const data = await response.json();
  
  // Transform appointments to flatten nested doctor/patient objects
  if (data.appointments && Array.isArray(data.appointments)) {
    return data.appointments.map(appointment => ({
      id: appointment.id,
      patientId: appointment.patient?.id,
      patientName: appointment.patient?.name,
      patientPhone: appointment.patient?.phone,
      patientEmail: appointment.patient?.email,
      doctorId: appointment.doctor?.id,
      doctorName: appointment.doctor?.name,
      appointmentTime: appointment.appointmentTime,
      status: appointment.status
    }));
  }
  
  return [];
}

export async function bookAppointment(appointment, token) {
  try {
    const response = await fetch(`${APPOINTMENT_API}/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(appointment)
    });

    const data = await response.json();
    return {
      success: response.ok,
      message: data.message || "Something went wrong"
    };
  } catch (error) {
    console.error("Error while booking appointment:", error);
    return {
      success: false,
      message: "Network error. Please try again later."
    };
  }
}

export async function updateAppointment(appointment, token) {
  try {
    const response = await fetch(`${APPOINTMENT_API}/${token}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(appointment)
    });

    const data = await response.json();
    return {
      success: response.ok,
      message: data.message || "Something went wrong"
    };
  } catch (error) {
    console.error("Error while booking appointment:", error);
    return {
      success: false,
      message: "Network error. Please try again later."
    };
  }
}
