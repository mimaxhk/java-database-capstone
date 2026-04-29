---

## 1. User Interface Layer

The system supports multiple interaction methods.

### Server-Rendered Web Dashboards
- **AdminDashboard**
- **DoctorDashboard**
- Built using **Thymeleaf**
- HTML pages rendered on the server and delivered to the browser

### REST API Consumers
- Mobile applications
- Frontend modules such as:
  - Appointments
  - PatientDashboard
  - PatientRecord
- Communicate over HTTP and receive **JSON** responses

This design enables both traditional web interfaces and scalable API integrations.

---

## 2. Controller Layer

Incoming requests are routed to controllers based on:

- URL path
- HTTP method (GET, POST, PUT, DELETE)

### Controller Types

#### MVC (Thymeleaf) Controllers
- Handle browser-based requests
- Return `.html` templates
- Populate views with model data

#### REST Controllers
- Handle API requests
- Validate input
- Invoke service-layer logic
- Return JSON responses

Controllers act as the **entry point** to backend application logic.

---

## 3. Service Layer

The **Service Layer** acts as the core of the application.

### Responsibilities
- Applies business rules and validations
- Coordinates workflows across entities  
  - Example: checking doctor availability before creating an appointment
- Separates business logic from controllers and data access

This approach improves:
- Maintainability
- Testability
- Scalability

---

## 4. Repository Layer

The Service Layer interacts with repositories for data persistence and retrieval.

### Repository Types

#### MySQL Repositories
- Built with **Spring Data JPA**
- Manage structured relational data:
  - Patients
  - Doctors
  - Appointments
  - Admins

#### MongoDB Repository
- Built with **Spring Data MongoDB**
- Manages document-based data:
  - Prescriptions

Repositories abstract database access and expose simple interfaces to the service layer.

---

## 5. Database Access Strategy

### MySQL
- Stores core system entities
- Uses normalized schemas and relational constraints
- Ideal for users, roles, and appointments

### MongoDB
- Stores flexible, nested data structures
- Suitable for prescriptions that may vary in format
- Allows rapid schema evolution

The application benefits from a **dual-database design**, using each database where it fits best.

---

## 6. Model Binding

Data retrieved from databases is mapped into Java objects used throughout the application.

### MySQL Models
- Annotated with `@Entity`
- Represent rows in relational tables
- Managed by JPA

### MongoDB Models
- Annotated with `@Document`
- Represent BSON/JSON documents
- Stored in MongoDB collections

This provides a consistent, object-oriented data model across layers.

---

## 7. Model Usage in Responses

### MVC Flow
- Models are passed from controllers to Thymeleaf templates
- Rendered as dynamic HTML pages

### REST Flow
- Models or DTOs are serialized into JSON
- Returned as HTTP responses to clients

The same underlying domain models support both UI rendering and API communication.

---

## Summary

This application architecture:

- Combines MVC and REST patterns
- Uses a centralized service layer for business logic
- Integrates MySQL and MongoDB effectively
- Supports both browser-based dashboards and API clients
- Promotes clean separation of concerns and scalability

---
