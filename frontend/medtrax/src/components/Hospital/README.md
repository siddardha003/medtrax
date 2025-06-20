# Hospital Components

This folder contains components specifically for the Hospital Admin dashboard functionality.

## Main Components

- **HospitalDashboard.js**: The main dashboard component for hospital administrators. This component includes:
  - Dashboard overview with stats
  - Appointment management
  - Patient management
  - Analytics

## Navigation

The Hospital Dashboard is accessed via the `/hospital-dashboard` route and is protected by the ProtectedRoute component which verifies that the user has the `hospital_admin` role.

## Authentication

Hospital administrators should log in through the `/admin-login` route, selecting the "Hospital Admin" role. After logging out, users are redirected to the admin login page.
