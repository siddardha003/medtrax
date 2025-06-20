# MedTrax Application Structure

This document explains the structure of the MedTrax application, focusing on the separation of user and admin interfaces.

## Authentication Flow

### User Authentication

1. Regular users access the login page at `/login`
2. After successful login, they remain on the homepage (Homepage.jsx)
3. The user interface is integrated with the main website layout
4. Regular users see their profile icon in the header with a dropdown menu

### Admin Authentication

1. Admins access a dedicated login page at `/admin-login`
2. The admin login requires selecting a specific role
3. After login, admins are redirected to their role-specific dashboard:
   - Super Admin → `/admin-panel`
   - Hospital Admin → `/hospital-dashboard`
   - Shop Admin → `/shop-dashboard`
4. Each admin dashboard has its own specialized interface

## Component Organization

### User Components

- `UserLogin.js` - Regular user login form
- `Homepage.jsx` - Main landing page for all users (before and after login)
- `Header.jsx` - Contains profile dropdown with personalized options

### Admin Components

- `AdminLogin.js` - Admin login with role selection
- `Dashboard.js` - Legacy dashboard used for redirection logic
- `HospitalDashboard.js` - Specialized dashboard for hospital admins
- `ShopDashboard.js` - Specialized dashboard for shop admins
- `AdminPanel.js` - Specialized dashboard for super admins

## Route Protection

- `ProtectedRoute.js` - Guards routes based on authentication status
- Role-specific routes require the appropriate user role
- Regular users cannot access admin routes

## Navigation Flow

1. Guest users see "User Login" and "Admin Login" links in the header
2. Authenticated users see their profile icon with a dropdown
3. The dropdown shows "My Account" for regular users and "Admin Dashboard" for admins
4. The logout button is available in both the dropdown and as a separate button

## Redux Integration

- The Redux store maintains the user's authentication state
- The `isAdmin` flag determines whether a user has admin privileges
- The user's `role` determines which specific admin dashboard to show

## Benefits of This Approach

1. Clear separation between user and admin interfaces
2. Dedicated login pages reduce confusion
3. Intuitive navigation based on user role
4. Simplified routing logic
5. More maintainable component structure
