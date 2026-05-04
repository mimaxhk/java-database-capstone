# MySQL Database Schema Design

This document outlines the database schema for the clinic management system. It includes tables for patients, doctors, appointments, admin, clinic_locations, and payments. Each table lists columns, data types, primary keys, foreign keys, and relevant constraints.

---

## Table: patients
- `patient_id` INT AUTO_INCREMENT PRIMARY KEY
- `first_name` VARCHAR(50) NOT NULL
- `last_name` VARCHAR(50) NOT NULL
- `email` VARCHAR(100) NOT NULL UNIQUE
- `phone` VARCHAR(20) NOT NULL
- `date_of_birth` DATE
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP

**Constraints:**
- `email` should be validated for format in application code.
- `phone` format should be validated in application code.

---

## Table: doctors
- `doctor_id` INT AUTO_INCREMENT PRIMARY KEY
- `first_name` VARCHAR(50) NOT NULL
- `last_name` VARCHAR(50) NOT NULL
- `email` VARCHAR(100) NOT NULL UNIQUE
- `phone` VARCHAR(20) NOT NULL
- `specialty` VARCHAR(100)
- `clinic_location_id` INT,
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP

**Foreign Keys:**
- `clinic_location_id` REFERENCES clinic_locations(`location_id`)

**Constraints:**
- `email` should be validated for format in application code.
- `phone` format should be validated in application code.

---

## Table: appointments
- `appointment_id` INT AUTO_INCREMENT PRIMARY KEY
- `patient_id` INT NOT NULL
- `doctor_id` INT NOT NULL
- `appointment_time` DATETIME NOT NULL
- `duration_minutes` INT NOT NULL DEFAULT 60
- `status` ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled'
- `notes` TEXT

**Foreign Keys:**
- `patient_id` REFERENCES patients(`patient_id`) ON DELETE CASCADE
- `doctor_id` REFERENCES doctors(`doctor_id`)

**Constraints:**
- No overlapping appointments for the same doctor (enforced in application logic or via a unique index on (`doctor_id`, `appointment_time`)).
- If a patient is deleted, their appointments are also deleted (ON DELETE CASCADE).

---

## Table: admin
- `admin_id` INT AUTO_INCREMENT PRIMARY KEY
- `username` VARCHAR(50) NOT NULL UNIQUE
- `email` VARCHAR(100) NOT NULL UNIQUE
- `password_hash` VARCHAR(255) NOT NULL
- `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP

**Constraints:**
- `email` should be validated for format in application code.

---

## Table: clinic_locations
- `location_id` INT AUTO_INCREMENT PRIMARY KEY
- `name` VARCHAR(100) NOT NULL
- `address` VARCHAR(255) NOT NULL
- `phone` VARCHAR(20)

---

## Table: payments
- `payment_id` INT AUTO_INCREMENT PRIMARY KEY
- `appointment_id` INT NOT NULL
- `amount` DECIMAL(10,2) NOT NULL
- `payment_date` DATETIME DEFAULT CURRENT_TIMESTAMP
- `payment_method` ENUM('cash', 'credit_card', 'insurance')
- `status` ENUM('pending', 'completed', 'failed') DEFAULT 'pending'

**Foreign Keys:**
- `appointment_id` REFERENCES appointments(`appointment_id`) ON DELETE CASCADE

---

## Additional Notes
- All NOT NULL fields must be provided on insert.
- AUTO_INCREMENT fields are automatically generated.
- Email and phone formats should be validated in the application layer.
- Deleting a patient will also delete their appointments and related payments (via ON DELETE CASCADE).
- Doctors should not have overlapping appointments; this should be enforced in the application or with a unique constraint if possible.

---

# MongoDB Collection Design

For data that does not fit into rigid tables or benefits from flexible/nested structures, we use MongoDB collections. These collections are suitable for storing documents with variable fields, arrays, and embedded objects. Example JSON snippets are provided for each collection.

---

### Collection: prescriptions
```json
{
	"_id": "ObjectId('64abc123456')",
	"patientId": 51,
	"appointmentId": 51,
	"doctorId": 12,
	"medication": "Paracetamol",
	"dosage": "500mg",
	"doctorNotes": "Take 1 tablet every 6 hours.",
	"refillCount": 2,
	"pharmacy": {
		"name": "Walgreens SF",
		"location": "Market Street"
	},
	"tags": ["painkiller", "fever"],
	"metadata": {
		"createdBy": "Dr. Jane Doe",
		"createdAt": "2026-05-04T10:00:00Z"
	}
}
```
**Notes:**
- Store only patient/doctor IDs for normalization and to avoid duplication. Embed only if document is rarely updated and always needed together.
- Arrays (e.g., `tags`) and embedded objects (e.g., `pharmacy`, `metadata`) are supported.
- Schema can evolve by adding new fields as needed.

---

### Collection: feedback
```json
{
	"_id": "ObjectId('64def789012')",
	"userId": 77,
	"userType": "patient",
	"appointmentId": 51,
	"rating": 4,
	"comments": "Doctor was very attentive.",
	"tags": ["positive", "bedside manner"],
	"createdAt": "2026-05-04T11:00:00Z",
	"metadata": {
		"source": "mobile app",
		"version": "1.2.3"
	}
}
```
**Notes:**
- Flexible for new feedback types, tags, or metadata.
- Can store both patient and doctor feedback by using `userType`.

---

### Collection: logs
```json
{
	"_id": "ObjectId('64fgh456789')",
	"eventType": "login",
	"userId": 77,
	"userRole": "admin",
	"timestamp": "2026-05-04T09:30:00Z",
	"details": {
		"ip": "192.168.1.10",
		"device": "Chrome on Windows"
	},
	"tags": ["security", "auth"]
}
```
**Notes:**
- Designed for extensibility: new event types, details, or tags can be added without schema migration.

---

### Collection: messages
```json
{
	"_id": "ObjectId('64msg123456')",
	"chatId": "abc123xyz",
	"senderId": 77,
	"receiverId": 12,
	"senderRole": "patient",
	"messageText": "Hello, I have a question about my prescription.",
	"sentAt": "2026-05-04T12:00:00Z",
	"attachments": [
		{
			"type": "image",
			"url": "https://example.com/image1.png"
		}
	],
	"metadata": {
		"read": false,
		"urgent": false
	}
}
```
**Notes:**
- Use `chatId` to group messages in a conversation.
- Store only user IDs, not full user objects, for normalization and easier updates.
- Arrays and embedded documents (e.g., `attachments`, `metadata`) are supported.
- Schema can evolve by adding new fields or nested structures as needed.

---

## MongoDB Schema Evolution
- MongoDB's flexible schema allows adding new fields, arrays, or embedded documents without downtime.
- Use versioning or metadata fields if you need to track schema changes or support multiple versions.
