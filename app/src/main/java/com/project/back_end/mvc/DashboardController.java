package com.project.back_end.mvc;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.project.back_end.services.AppService;

@Controller
public class DashboardController {
	private final AppService service;

	@Autowired
	public DashboardController(AppService service) {
		this.service = service;
	}

	@GetMapping("/adminDashboard/{token}")
	public String adminDashboard(@PathVariable String token) {
		ResponseEntity<Map<String, String>> validationResult = service.validateToken(token, "admin");
		if (validationResult == null) {
			return "admin/adminDashboard";
		}
		return "redirect:/";
	}

	@GetMapping("/doctorDashboard/{token}")
	public String doctorDashboard(@PathVariable String token) {
		ResponseEntity<Map<String, String>> validationResult = service.validateToken(token, "doctor");
		if (validationResult == null) {
			return "doctor/doctorDashboard";
		}
		return "redirect:/";
	}

}
