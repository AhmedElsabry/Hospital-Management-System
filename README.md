================================================================
              Nabdh System v2.2
         Hospital & Clinic Management System
================================================================

📌 Overview
-----------
Nabdh is a fully client-side web application for managing
clinics and hospitals. It covers doctors, patients, and
appointments management with a real-time analytics dashboard.

================================================================
🗂️ Modules
================================================================

1. Doctors Management
----------------------
- View all doctors in an interactive table
- Add a new doctor via a modal dialog
- Edit existing doctor information
- Delete a doctor with confirmation prompt
- Search & filter by name, specialty, code, or status
- Auto-generated doctor codes (DR-001, DR-002, ...)
- Doctor statuses: Active / On Leave

Doctor fields:
  • Doctor Code    (auto-generated, read-only)
  • Full Name      (required)
  • Specialty      (required) — Internal Medicine / Pediatrics /
                               General Surgery / Emergency
  • Phone Number   (required) — must start with 05, exactly 10 digits
  • Status         — Active / On Leave

----------------------------------------------------------------

2. Appointments Management
---------------------------
- Add a new appointment (patient name, doctor, date, time,
  specialty, status)
- Selecting a doctor auto-fills and locks the specialty field
- Delete an appointment with confirmation
- Search appointments by patient name or doctor name
- Appointment statuses: Active / Pending / Cancelled

----------------------------------------------------------------

3. Patients Management
-----------------------
- Add a new patient (name, age, gender, phone, diagnosis)
- Edit patient data via a modal dialog
- Delete a patient with confirmation
- Search by name, diagnosis, or phone number
- Displays patient initials as an avatar

----------------------------------------------------------------

4. Dashboard
-------------
- Doctor stats   : Total / Active / On Leave
- Appointment stats: Active / Pending / Cancelled
- Patient stats  : Total / Male / Female
- Bar charts (Chart.js) for doctors, patients, and appointments
- Department breakdown as percentage of total appointments:
    Internal Medicine / General Surgery / Pediatrics / Emergency

================================================================
⚙️ General Features
================================================================

- Dark / Light mode toggle with preference saved across sessions
- Toast notifications on add, edit, and delete actions
- All data persisted in localStorage (no server required)
- Full RTL layout with Arabic UI labels
- Sidebar navigation with active section highlighting

================================================================
💾 localStorage Keys
================================================================

  Key                      | Stored Data
  -------------------------|----------------------------
  doctors                  | Doctors list
  NABDH_FINAL_APP_DB       | Appointments list
  NABDH_PATIENTS_DB        | Patients list
  theme                    | UI theme preference (dark/light)

================================================================
📦 Dependencies
================================================================

- Chart.js       — bar charts and data visualization
- Font Awesome   — icons throughout the UI

================================================================
🚀 Getting Started
================================================================

1. Open index.html in any modern browser (Chrome / Firefox / Edge)
2. No server or internet connection required
3. All data is saved automatically in the browser's localStorage

================================================================
🔢 Default Demo Data
================================================================

Two doctors are pre-loaded on first launch:
  • DR-001 — Dr. Ahmed Mahmoud Ali — Internal Medicine — Active
  • DR-002 — Dr. Sara Khaled Hassan — Pediatrics       — Active

================================================================
📋 Validation Rules
================================================================

  Field              | Rule
  -------------------|-------------------------------------------
  Doctor name        | Required
  Specialty          | Required — must select from dropdown
  Phone number       | Must start with 05, exactly 10 digits
  Patient age        | Numeric value between 1 and 120
  Patient name       | Required
  Patient phone      | Required
  Diagnosis          | Required
================================================================

GitHub Repo : 

================================================================
              Version: 2.2  |  Nabdh System © 2025
================================================================
