# MedTrax Authentication & Role-Based Access Control

This document outlines the authentication and role-based access control (RBAC) implementation for the MedTrax system.

## 1. Authentication Flow

### 1.1 Enhanced Login Page

We've implemented a unified login page (`EnhancedLogin.js`) that handles both user and admin authentication:

- **Toggle between User and Admin login modes**
- **Admin Role Selection Dropdown** (Super Admin, Hospital Admin, Medical Shop Admin)
- **Redirects users to appropriate dashboards** based on their role after successful login
- **Login preference memory** - remembers if user last logged in as admin or regular user

### 1.2 User Authentication

- Regular users can both login and signup
- After login, users see the normal website with additional personalized features
- User navbar shows a profile icon with the first letter of their name

### 1.3 Admin Authentication

- No signup option for admin roles
- Only Super Admin can create login credentials for Hospital Admins and Medical Shop Admins
- Admin credentials are used to access role-specific dashboards

## 2. Role-Based Access Control

### 2.1 Super Admin

- Can access the Admin Panel (`/admin-panel`)
- Can create and manage credentials for Hospital Admins and Medical Shop Admins
- Has overall administrative control of the system

### 2.2 Hospital Admin

- Can access the Hospital Dashboard (`/hospital-dashboard`)
- Can manage hospital information:
  - Name, address, contact details, departments
  - Doctors and staff information
  - Available services and facilities
  - Hospital images
- This information becomes visible to users only after being filled and saved

### 2.3 Medical Shop Admin

- Can access the Shop Dashboard (`/shop-dashboard`)
- Can manage medical shop information:
  - Name, address, contact details
  - Available medicines and their stock information
  - Pricing details
- This information becomes visible to users only after being filled and saved

### 2.4 Regular User

- Can access the main website and user-specific features
- Can view hospital and medical shop information (only what has been published by admins)
- Can make appointments, purchase medicines, etc.

## 3. Protected Routes

All admin dashboards are protected using the `ProtectedRoute` component that:
- Verifies user authentication
- Checks if the user has the required role
- Redirects unauthorized access to the login page
- Shows an "Access Denied" message for authenticated users with insufficient permissions

## 4. Technical Implementation Details

- **Redux Store**: Maintains authentication state
- **localStorage**: Persists authentication between page refreshes
- **Role-Based Redirects**: Automatic navigation to appropriate dashboards after login
- **Profile Dropdown**: Shows logged-in user information and logout option
- **Login Type Memory**: Remembers if user last logged in as admin or regular user

## 5. Security Considerations

- Admin roles cannot be self-registered
- Protected routes validate both authentication and role permissions
- JWT tokens are used for session management
- Hospital and Medical Shop data visibility is controlled by admin publication
