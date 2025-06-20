# MedTrax Authentication System Documentation

## Overview

MedTrax now has separate login systems for regular users and administrators to prevent confusion and improve user experience. This document explains how the authentication system works and how to use it.

## Login Pages

### User Login (`/login`)
- Simple login form with email and password
- For regular users without administrative privileges
- After successful login, user stays on the homepage
- Contains a link to sign up for new accounts
- Contains a button to navigate to Admin Login page

### Admin Login (`/admin-login`)
- Enhanced login form with email, password, and role selection
- Role selection dropdown with options:
  - Super Admin
  - Hospital Admin
  - Medical Shop Admin
- After successful login, administrators are redirected to their specific dashboards
- Contains a button to navigate to User Login page

## Navigation Flow

### For Regular Users
1. User visits `/login`
2. After successful login, user stays on the homepage (`/`)
3. User sees profile icon in header with access to Dashboard
4. Dashboard shows basic user information

### For Administrators
1. Admin visits `/admin-login` (or clicks "Admin Login" from `/login`)
2. Admin selects their specific role
3. After successful login, admin is redirected to their specific dashboard:
   - Super Admin → `/admin-panel`
   - Hospital Admin → `/hospital-dashboard`
   - Shop Admin → `/shop-dashboard`
4. Admin sees profile icon in header with access to their admin dashboard

## Authentication Components

1. **UserLogin.js**: Simple login form for regular users
2. **AdminLogin.js**: Enhanced login form with role selection
3. **Dashboard.js**: General dashboard with conditional redirection for admins
4. **ProtectedRoute.js**: Route protection for role-based access control

## Security and Access Control

- Role-based authorization is enforced through the `ProtectedRoute` component
- Role-specific dashboards are only accessible to users with matching roles
- Non-admin users cannot access admin dashboards

## Testing the Authentication Flow

### Regular User Flow
1. Go to `/login`
2. Enter valid user credentials
3. Verify you stay on the homepage after login
4. Check that the profile icon appears in the header
5. Click profile icon and verify the dropdown menu works
6. Try accessing `/admin-panel` and verify you get "Access Denied"

### Admin User Flow
1. Go to `/admin-login`
2. Enter valid admin credentials and select appropriate role
3. Verify you're redirected to the correct role-specific dashboard
4. Check that the profile icon appears in the header
5. Click profile icon and verify the dropdown menu works
6. Try accessing dashboards for other roles and verify access control works

## Common Issues and Troubleshooting

1. **Not redirecting to the correct page after login**
   - Check console logs for navigation attempts
   - Verify the user's role and isAdmin properties in Redux state

2. **Access denied to dashboard**
   - Verify your login role matches the dashboard's required role
   - Check that role assignment is working correctly

3. **Profile icon not appearing**
   - Check if user is properly authenticated in Redux state
   - Verify the localStorage has the correct user information
