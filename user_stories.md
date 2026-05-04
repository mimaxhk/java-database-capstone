
# User Stories

## Summary

### Admin Stories
- Add Doctor
- Delete Doctor Profile
- Admin Login
- Admin Logout
- Run MySQL Stored Procedure for Usage Stats

### Patient Stories
- Book Appointment
- Patient Login
- Patient Logout
- Patient Sign Up
- View Doctors Without Logging In
- View Upcoming Appointments

### Doctor Stories
- Doctor Login
- Doctor Logout
- Mark Unavailability
- Update Doctor Profile
- View Appointment Calendar
- View Patient Details for Upcoming Appointments

## Admin Stories

# User Story: Add Doctor

**Title:**
_As an admin, I want to add doctors to the portal, so that they can access and use the platform._

**Acceptance Criteria:**
1. Admin can access a form to add a new doctor.
2. Admin must provide required doctor details (e.g., name, email, specialty).
3. Doctor receives an invitation or credentials to access the portal.

**Priority:** High

**Story Points:** 3

**Notes:**
- Validate doctor details before submission.

# User Story: Delete Doctor Profile

**Title:**
_As an admin, I want to delete a doctor's profile from the portal, so that I can manage active users._

**Acceptance Criteria:**
1. Admin can view a list of doctors.
2. Admin can select and delete a doctor's profile.
3. System asks for confirmation before deletion.
4. Deleted doctor cannot access the portal.

**Priority:**
Medium

**Story Points:**
3

**Notes:**
- Consider soft delete for audit purposes.

# User Story: Admin Login

**Title:**
_As an admin, I want to log into the portal with my username and password, so that I can manage the platform securely._

**Acceptance Criteria:**
1. Admin can access a login page.
2. Admin must enter a valid username and password to log in.
3. Unsuccessful login attempts show an error message.
4. Successful login grants access to admin features.

**Priority:**
High

**Story Points:**
3

**Notes:**
- Consider account lockout after multiple failed attempts.

# User Story: Admin Logout

**Title:**
_As an admin, I want to log out of the portal, so that I can protect system access._

**Acceptance Criteria:**
1. Admin can log out from any page in the portal.
2. After logout, admin is redirected to the login page.
3. Session is invalidated after logout.

**Priority:**
High

**Story Points:**
2

**Notes:**
- Ensure all session data is cleared on logout.

# User Story: Run MySQL Stored Procedure for Usage Stats

**Title:**
_As an admin, I want to run a stored procedure in MySQL CLI to get the number of appointments per month, so that I can track usage statistics._

**Acceptance Criteria:**
1. Admin can access instructions or a script to run the stored procedure.
2. The stored procedure returns the number of appointments per month.
3. Results are displayed or exported for analysis.

**Priority:**
Medium

**Story Points:**
5

**Notes:**
- Ensure only authorized admins can run the procedure.
- Document the procedure usage.

## Patient Stories

# User Story: Book Appointment

**Title:**
_As a patient, I want to log in and book an hour-long appointment to consult with a doctor, so that I can receive medical advice._

**Acceptance Criteria:**
1. Patient must be logged in to book an appointment.
2. Patient can select a doctor and choose an available time slot.
3. Appointment duration is fixed at one hour.
4. Confirmation is shown after successful booking.

**Priority:**
High

**Story Points:**
5

**Notes:**
- Prevent double-booking of time slots.
- Send appointment confirmation to patient.

# User Story: Patient Login

**Title:**
_As a patient, I want to log into the portal, so that I can manage my bookings._

**Acceptance Criteria:**
1. Patient can access a login page.
2. Patient must enter a valid email and password to log in.
3. Successful login grants access to appointment management features.

**Priority:**
High

**Story Points:**
2

**Notes:**
- Show error message for invalid credentials.
- Consider account lockout after multiple failed attempts.

# User Story: Patient Logout

**Title:**
_As a patient, I want to log out of the portal, so that I can secure my account._

**Acceptance Criteria:**
1. Patient can log out from any page in the portal.
2. After logout, patient is redirected to the login or home page.
3. Session is invalidated after logout.

**Priority:**
High

**Story Points:**
2

**Notes:**
- Ensure all session data is cleared on logout.

# User Story: Patient Sign Up

**Title:**
_As a patient, I want to sign up using my email and password, so that I can book appointments._

**Acceptance Criteria:**
1. Patient can access a registration page.
2. Patient must provide a valid email and password.
3. Successful registration allows patient to log in and book appointments.

**Priority:**
High

**Story Points:**
3

**Notes:**
- Validate email format and password strength.
- Send confirmation email after registration.

# User Story: View Doctors Without Logging In

**Title:**
_As a patient, I want to view a list of doctors without logging in, so that I can explore options before registering._

**Acceptance Criteria:**
1. Patient can access a public page listing all available doctors.
2. Doctor details (e.g., name, specialty, location) are visible.
3. No login or registration is required to view the list.

**Priority:**
High

**Story Points:**
3

**Notes:**
- Ensure sensitive doctor information is not exposed.

# User Story: View Upcoming Appointments

**Title:**
_As a patient, I want to view my upcoming appointments, so that I can prepare accordingly._

**Acceptance Criteria:**
1. Patient can access a page listing all upcoming appointments after logging in.
2. Each appointment displays the doctor, date, time, and location.
3. Only future appointments are shown.

**Priority:**
Medium

**Story Points:**
3

**Notes:**
- Allow sorting or filtering by date.
- Show a message if there are no upcoming appointments.

## Doctor Stories

# User Story: Doctor Login

**Title:**
_As a doctor, I want to log into the portal, so that I can manage my appointments._

**Acceptance Criteria:**
1. Doctor can access a login page.
2. Doctor must enter a valid email and password to log in.
3. Successful login grants access to appointment management features.

**Priority:**
High

**Story Points:**
2

**Notes:**
- Show error message for invalid credentials.
- Consider account lockout after multiple failed attempts.

# User Story: Doctor Logout

**Title:**
_As a doctor, I want to log out of the portal, so that I can protect my data._

**Acceptance Criteria:**
1. Doctor can log out from any page in the portal.
2. After logout, doctor is redirected to the login or home page.
3. Session is invalidated after logout.

**Priority:**
High

**Story Points:**
2

**Notes:**
- Ensure all session data is cleared on logout.

# User Story: Mark Unavailability

**Title:**
_As a doctor, I want to mark my unavailability, so that patients can only book available slots._

**Acceptance Criteria:**
1. Doctor can select dates and times when unavailable.
2. Unavailable slots are not shown to patients for booking.
3. Doctor can update or remove unavailability as needed.

**Priority:**
High

**Story Points:**
3

**Notes:**
- Prevent double-booking during unavailable times.

# User Story: Update Doctor Profile

**Title:**
_As a doctor, I want to update my profile with specialization and contact information, so that patients have up-to-date information._

**Acceptance Criteria:**
1. Doctor can access and edit their profile information.
2. Doctor can update specialization and contact details.
3. Changes are saved and reflected for patients.

**Priority:**
Medium

**Story Points:**
3

**Notes:**
- Validate contact information format.
- Notify patients of major profile changes if needed.

# User Story: View Appointment Calendar

**Title:**
_As a doctor, I want to view my appointment calendar, so that I can stay organized._

**Acceptance Criteria:**
1. Doctor can access a calendar view of all upcoming appointments.
2. Each appointment displays patient name, date, and time.
3. Only future appointments are shown by default.

**Priority:**
High

**Story Points:**
3

**Notes:**
- Allow filtering by day, week, or month.
- Show a message if there are no upcoming appointments.

# User Story: View Patient Details for Upcoming Appointments

**Title:**
_As a doctor, I want to view the patient details for upcoming appointments, so that I can be prepared._

**Acceptance Criteria:**
1. Doctor can access a list of upcoming appointments.
2. Each appointment displays patient name, contact information, and relevant notes.
3. Only future appointments are shown.

**Priority:**
Medium

**Story Points:**
3

**Notes:**
- Ensure patient data privacy and access control.
- Allow viewing additional patient history if authorized.
