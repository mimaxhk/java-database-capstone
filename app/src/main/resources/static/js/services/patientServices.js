import { API_BASE_URL } from "../config/config.js";
const PATIENT_API = API_BASE_URL + "/patient";


// Create a new patient account
export async function patientSignup(data) {
  try {
    // Send signup payload to backend
    const response = await fetch(PATIENT_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Parse response
    const result = await response.json();

    // Handle non-success responses
    if (!response.ok) {
      throw new Error(result?.message || "Failed to sign up patient.");
    }

    return {
      success: true,
      message: result?.message || "Patient signup successful.",
    };
  } catch (error) {
    console.error("Error :: patientSignup ::", error);
    return {
      success: false,
      message: error?.message || "Unable to complete patient signup.",
    };
  }
}

// Authenticate patient and return raw response to caller
export async function patientLogin(data) {
  return fetch(`${PATIENT_API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

// Get logged-in patient data from token
export async function getPatientData(token) {
  try {
    // Request patient profile
    const response = await fetch(`${PATIENT_API}/${token}`);
    const data = await response.json();

    if (response.ok) {
      return data?.patient || null;
    }

    return null;
  } catch (error) {
    console.error("Error fetching patient details:", error);
    return null;
  }
}

// Shared endpoint used by doctor/patient dashboards to fetch appointments
export async function getPatientAppointments(id, token, user) {
  try {
    const safeId = encodeURIComponent(String(id));
    const safeUser = encodeURIComponent(String(user));
    const safeToken = encodeURIComponent(String(token));

    // Fetch appointments by user context
    const response = await fetch(`${PATIENT_API}/${safeId}/${safeUser}/${safeToken}`);
    const data = await response.json();

    if (response.ok) {
      return Array.isArray(data?.appointments) ? data.appointments : [];
    }

    return null;
  } catch (error) {
    console.error("Error fetching patient details:", error);
    return null;
  }
}

export async function filterAppointments(condition, name, token) {
  try {
    const safeCondition = condition && String(condition).trim() ? encodeURIComponent(String(condition).trim()) : "null";
    const safeName = name && String(name).trim() ? encodeURIComponent(String(name).trim()) : "null";
    const safeToken = token && String(token).trim() ? encodeURIComponent(String(token).trim()) : "null";

    // Fetch filtered appointments
    const response = await fetch(`${PATIENT_API}/filter/${safeCondition}/${safeName}/${safeToken}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return Array.isArray(data?.appointments) ? data.appointments : [];
    } else {
      console.error("Failed to fetch appointments:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error filtering appointments:", error);
    alert("Something went wrong while filtering appointments.");
    return [];
  }
}
