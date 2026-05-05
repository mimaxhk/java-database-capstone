package com.project.back_end.controllers;

import com.project.back_end.models.Prescription;
import com.project.back_end.services.AppointmentService;
import com.project.back_end.services.PrescriptionService;
import com.project.back_end.services.Service;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("${api.path}" + "prescription")
public class PrescriptionController {

	private final PrescriptionService prescriptionService;
	private final Service service;
	private final AppointmentService appointmentService;

	public PrescriptionController(PrescriptionService prescriptionService,
								  Service service,
								  AppointmentService appointmentService) {
		this.prescriptionService = prescriptionService;
		this.service = service;
		this.appointmentService = appointmentService;
	}

	@PostMapping("/{token}")
	public ResponseEntity<?> savePrescription(
			@PathVariable String token,
			@Valid @RequestBody Prescription prescription
	) {
		ResponseEntity<Map<String, String>> tokenValidation = service.validateToken(token, "doctor");
		if (tokenValidation != null) {
			return tokenValidation;
		}

		appointmentService.changeStatus(1, prescription.getAppointmentId());
		return prescriptionService.savePrescription(prescription);
	}

	@GetMapping("/{appointmentId}/{token}")
	public ResponseEntity<?> getPrescription(
			@PathVariable Long appointmentId,
			@PathVariable String token
	) {
		ResponseEntity<Map<String, String>> tokenValidation = service.validateToken(token, "doctor");
		if (tokenValidation != null) {
			return tokenValidation;
		}

		ResponseEntity<Map<String, Object>> response = prescriptionService.getPrescription(appointmentId);
		Map<String, Object> body = response.getBody();
		if (body != null && body.containsKey("prescriptions") && body.get("prescriptions") instanceof java.util.List<?> list && list.isEmpty()) {
			Map<String, Object> noData = new HashMap<>();
			noData.put("message", "No prescription found for this appointment");
			return ResponseEntity.ok(noData);
		}
		return response;
	}
}
