import { API_BASE_URL } from "../config/config.js";

const DOCTOR_API = API_BASE_URL + "/doctor";

export async function getDoctors() {
  try {
    const response = await fetch(DOCTOR_API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch doctors:", response.status);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data?.doctors) ? data.doctors : [];
  } catch (error) {
    console.error("Error in getDoctors:", error);
    return [];
  }
}

export async function deleteDoctor(id, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/${id}/${token}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json().catch(() => ({}));

    return {
      success: response.ok,
      message: data?.message || (response.ok ? "Doctor deleted successfully." : "Failed to delete doctor."),
    };
  } catch (error) {
    console.error("Error in deleteDoctor:", error);
    return {
      success: false,
      message: "Something went wrong while deleting doctor.",
    };
  }
}

export async function saveDoctor(doctor, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(doctor),
    });

    const data = await response.json().catch(() => ({}));

    return {
      success: response.ok,
      message: data?.message || (response.ok ? "Doctor saved successfully." : "Failed to save doctor."),
    };
  } catch (error) {
    console.error("Error in saveDoctor:", error);
    return {
      success: false,
      message: "Something went wrong while saving doctor.",
    };
  }
}

export async function filterDoctors(name, time, specialty) {
  const safeName = name && name.trim() ? encodeURIComponent(name.trim()) : "null";
  const safeTime = time && String(time).trim() ? encodeURIComponent(String(time).trim()) : "null";
  const safeSpecialty = specialty && specialty.trim() ? encodeURIComponent(specialty.trim()) : "null";

  try {
    const response = await fetch(`${DOCTOR_API}/${safeName}/${safeTime}/${safeSpecialty}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Failed to filter doctors:", response.status);
      return { doctors: [] };
    }

    const data = await response.json();
    return {
      doctors: Array.isArray(data?.doctors) ? data.doctors : [],
    };
  } catch (error) {
    console.error("Error in filterDoctors:", error);
    return { doctors: [] };
  }
}
