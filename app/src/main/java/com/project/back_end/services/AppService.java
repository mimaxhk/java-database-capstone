package com.project.back_end.services;

import com.project.back_end.DTO.Login;
import com.project.back_end.models.Admin;
import com.project.back_end.models.Appointment;
import com.project.back_end.models.Patient;
import com.project.back_end.repo.AdminRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AppService {

    private final TokenService tokenService;
    private final AdminRepository adminRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DoctorService doctorService;
    private final PatientService patientService;

    public AppService(TokenService tokenService,
                      AdminRepository adminRepository,
                      DoctorRepository doctorRepository,
                      PatientRepository patientRepository,
                      DoctorService doctorService,
                      PatientService patientService) {
        this.tokenService = tokenService;
        this.adminRepository = adminRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.doctorService = doctorService;
        this.patientService = patientService;
    }

    public ResponseEntity<Map<String, String>> validateToken(String token, String user) {
        Map<String, String> response = new HashMap<>();
        if (!tokenService.validateToken(token, user)) {
            response.put("message", "Invalid or expired token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        return null;
    }

    public ResponseEntity<Map<String, String>> validateAdmin(Admin receivedAdmin) {
        Map<String, String> response = new HashMap<>();
        try {
            Admin admin = adminRepository.findByUsername(receivedAdmin.getUsername());
            if (admin == null || !admin.getPassword().equals(receivedAdmin.getPassword())) {
                response.put("message", "Invalid credentials");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            String token = tokenService.generateToken(admin.getUsername());
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    public Map<String, Object> filterDoctor(String name, String specialty, String time) {
        name = normalizeFilterValue(name);
        specialty = normalizeFilterValue(specialty);
        time = normalizeFilterValue(time);

        boolean hasName = name != null && !name.isBlank();
        boolean hasSpecialty = specialty != null && !specialty.isBlank();
        boolean hasTime = time != null && !time.isBlank();

        if (hasName && hasSpecialty && hasTime) return doctorService.filterDoctorsByNameSpecilityandTime(name, specialty, time);
        if (hasName && hasSpecialty) return doctorService.filterDoctorByNameAndSpecility(name, specialty);
        if (hasName && hasTime) return doctorService.filterDoctorByNameAndTime(name, time);
        if (hasSpecialty && hasTime) return doctorService.filterDoctorByTimeAndSpecility(specialty, time);
        if (hasName) return doctorService.findDoctorByName(name);
        if (hasSpecialty) return doctorService.filterDoctorBySpecility(specialty);
        if (hasTime) return doctorService.filterDoctorsByTime(time);

        Map<String, Object> result = new HashMap<>();
        result.put("doctors", doctorService.getDoctors());
        return result;
    }

    public int validateAppointment(Appointment appointment) {
        Long doctorId = appointment.getDoctor().getId();
        Optional<com.project.back_end.models.Doctor> optional = doctorRepository.findById(doctorId);
        if (optional.isEmpty()) return -1;

        LocalDate date = appointment.getAppointmentTime().toLocalDate();
        List<String> available = doctorService.getDoctorAvailability(doctorId, date);

        // Format appointment time as HH:mm (24-hour format)
        String requestedTime = appointment.getAppointmentTime()
                .format(java.time.format.DateTimeFormatter.ofPattern("HH:mm"));

        // Extract start times from slots and compare
        boolean match = available.stream().anyMatch(slot -> {
            // Slots are in format "HH:mm-HH:mm", extract the start time
            String slotStart = slot.split("-")[0].trim();
            return slotStart.equalsIgnoreCase(requestedTime);
        });
        return match ? 1 : 0;
    }

    public boolean validatePatient(Patient patient) {
        Patient existing = patientRepository.findByEmailOrPhone(patient.getEmail(), patient.getPhone());
        return existing == null;
    }

    public ResponseEntity<Map<String, String>> validatePatientLogin(Login login) {
        Map<String, String> response = new HashMap<>();
        try {
            String identifier = login.getIdentifier();
            if (identifier == null || identifier.isBlank() || login.getPassword() == null || login.getPassword().isBlank()) {
                response.put("message", "Identifier/email and password are required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            Patient patient = patientRepository.findByEmail(identifier);
            if (patient == null || !patient.getPassword().equals(login.getPassword())) {
                response.put("message", "Invalid credentials");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            String token = tokenService.generateToken(patient.getEmail());
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Internal server error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    public ResponseEntity<Map<String, Object>> filterPatient(String condition, String name, String token) {
        String email = tokenService.extractIdentifier(token);
        Patient patient = patientRepository.findByEmail(email);
        if (patient == null) {
            Map<String, Object> err = new HashMap<>();
            err.put("message", "Patient not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
        }
        Long patientId = patient.getId();

        condition = normalizeFilterValue(condition);
        name = normalizeFilterValue(name);

        boolean hasCondition = condition != null && !condition.isBlank();
        boolean hasName = name != null && !name.isBlank();

        if (hasCondition && hasName) return patientService.filterByDoctorAndCondition(condition, name, patientId);
        if (hasCondition) return patientService.filterByCondition(condition, patientId);
        if (hasName) return patientService.filterByDoctor(name, patientId);
        return patientService.getPatientAppointment(patientId, token);
    }

    private String normalizeFilterValue(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        if (trimmed.isEmpty()) return null;
        if ("null".equalsIgnoreCase(trimmed) || "undefined".equalsIgnoreCase(trimmed)) return null;
        return trimmed;
    }
}
