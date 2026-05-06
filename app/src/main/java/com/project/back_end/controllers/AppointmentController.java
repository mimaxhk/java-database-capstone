package com.project.back_end.controllers;

import com.project.back_end.models.Appointment;
import com.project.back_end.services.AppointmentService;
import com.project.back_end.services.AppService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

	private final AppointmentService appointmentService;
	private final AppService service;

	public AppointmentController(AppointmentService appointmentService, AppService service) {
		this.appointmentService = appointmentService;
		this.service = service;
	}

	@GetMapping("/{date}/{patientName}/{token}")
	public ResponseEntity<Map<String, Object>> getAppointments(
			@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
			@PathVariable String patientName,
			@PathVariable String token
	) {
		ResponseEntity<Map<String, String>> tokenValidation = service.validateToken(token, "doctor");
		if (tokenValidation != null) {
			return ResponseEntity.status(tokenValidation.getStatusCode())
					.body(new HashMap<>(tokenValidation.getBody()));
		}

		String filterName = (patientName == null || "null".equalsIgnoreCase(patientName) || "all".equalsIgnoreCase(patientName))
				? ""
				: patientName;
		return ResponseEntity.ok(appointmentService.getAppointment(filterName, date, token));
	}

	@PostMapping("/{token}")
	public ResponseEntity<Map<String, String>> bookAppointment(
			@PathVariable String token,
			@Valid @RequestBody Appointment appointment
	) {
		ResponseEntity<Map<String, String>> tokenValidation = service.validateToken(token, "patient");
		if (tokenValidation != null) {
			return tokenValidation;
		}

		int valid = service.validateAppointment(appointment);
		Map<String, String> response = new HashMap<>();

		if (valid == -1) {
			response.put("message", "Doctor not found");
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
		}
		if (valid == 0) {
			response.put("message", "Appointment slot unavailable");
			return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
		}

		int result = appointmentService.bookAppointment(appointment);
		if (result == 1) {
			response.put("message", "Appointment booked successfully");
			return ResponseEntity.status(HttpStatus.CREATED).body(response);
		}

		response.put("message", "Internal server error");
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
	}

	@PutMapping("/{token}")
	public ResponseEntity<Map<String, String>> updateAppointment(
			@PathVariable String token,
			@Valid @RequestBody Appointment appointment
	) {
		ResponseEntity<Map<String, String>> tokenValidation = service.validateToken(token, "patient");
		if (tokenValidation != null) {
			return tokenValidation;
		}
		return appointmentService.updateAppointment(appointment);
	}

	@DeleteMapping("/{id}/{token}")
	public ResponseEntity<Map<String, String>> cancelAppointment(
			@PathVariable long id,
			@PathVariable String token
	) {
		ResponseEntity<Map<String, String>> tokenValidation = service.validateToken(token, "patient");
		if (tokenValidation != null) {
			return tokenValidation;
		}
		return appointmentService.cancelAppointment(id, token);
	}
}
