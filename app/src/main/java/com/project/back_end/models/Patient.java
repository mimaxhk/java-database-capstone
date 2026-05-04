package com.project.back_end.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@Entity
public class Patient {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull(message = "name cannot be null")
	@Size(min = 3, max = 100, message = "name must be between 3 and 100 characters")
	private String name;

	@NotNull(message = "email cannot be null")
	@Email(message = "email must be a valid email address")
	private String email;

	@NotNull(message = "password cannot be null")
	@Size(min = 6, message = "password must be at least 6 characters")
	private String password;

	@NotNull(message = "phone cannot be null")
	@Pattern(regexp = "\\d{10}", message = "phone must be 10 digits")
	private String phone;

	@NotNull(message = "address cannot be null")
	@Size(max = 255, message = "address must be at most 255 characters")
	private String address;

	public Patient() {
	}

	public Patient(Long id, String name, String email, String password, String phone, String address) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.password = password;
		this.phone = phone;
		this.address = address;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
}
