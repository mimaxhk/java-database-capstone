package com.project.back_end.models;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GenerationType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

@Entity
public class Appointment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @NotNull(message = "Doctor is required")
  private Doctor doctor;

  @ManyToOne
  @NotNull(message = "Patient is required")
  private Patient patient;

  @NotNull(message = "Appointment time is required")
  @Future(message = "Appointment time must be in the future")
  private LocalDateTime appointmentTime;

  @NotNull(message = "Status is required")
  @Enumerated(EnumType.ORDINAL)
  @Column(columnDefinition = "INT DEFAULT 0")
  private AppointmentStatus status = AppointmentStatus.scheduled;

  public Appointment() {}

  public Appointment(Long id, Doctor doctor, Patient patient, LocalDateTime appointmentTime, AppointmentStatus status) {
    this.id = id;
    this.doctor = doctor;
    this.patient = patient;
    this.appointmentTime = appointmentTime;
    this.status = status;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Doctor getDoctor() {
    return doctor;
  }

  public void setDoctor(Doctor doctor) {
    this.doctor = doctor;
  }

  public Patient getPatient() {
    return patient;
  }

  public void setPatient(Patient patient) {
    this.patient = patient;
  }

  public LocalDateTime getAppointmentTime() {
    return appointmentTime;
  }

  public void setAppointmentTime(LocalDateTime appointmentTime) {
    this.appointmentTime = appointmentTime;
  }

  public AppointmentStatus getStatus() {
    return status;
  }

  public void setStatus(AppointmentStatus status) {
    this.status = status;
  }

  // Enum for appointment status
  public enum AppointmentStatus {
    scheduled,
    completed,
    cancelled
  }

  @Transient
  public LocalDateTime getEndTime() {
    return appointmentTime != null ? appointmentTime.plusHours(1) : null;
  }

  @Transient
  public LocalDate getAppointmentDate() {
    return appointmentTime != null ? appointmentTime.toLocalDate() : null;
  }

  @Transient
  public LocalTime getAppointmentTimeOnly() {
    return appointmentTime != null ? appointmentTime.toLocalTime() : null;
  }
}