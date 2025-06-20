# MedTrax Routing and Authentication Flow

This document explains how the routing and authentication flow works in the MedTrax application.

## Authentication Logic

1. **Login Process**:
   - Users can log in through `/login` (EnhancedLogin component)
   - Admin users select their role (super_admin, hospital_admin, shop_admin)
   - Regular users just provide email and password

2. **Role Assignment**:
   - Admin users have `isAdmin: true` in their user object
   - Regular users have `isAdmin: false` and role: 'user'
   - The backend validates roles during login

3. **After Login Redirection**:
   - Admin users are redirected to their specific dashboards:
     - super_admin → `/admin-panel`
     - hospital_admin → `/hospital-dashboard`
     - shop_admin → `/shop-dashboard`
   - Regular users stay on the homepage (`/`)

## Component-Specific Logic

### Dashboard.js
- Generic dashboard available at `/dashboard`
- Admins who land here are redirected to their specific dashboard
- Regular users can view this dashboard but it doesn't automatically redirect them

### Header.jsx
- Shows login/logout buttons
- When logged in, shows user's initial in a circle with dropdown
- Dropdown "Dashboard" button navigates:
  - Admins → to their specific dashboard
  - Regular users → to `/dashboard`

### ProtectedRoute.js
- Guards routes that require authentication
- Can require specific roles for certain routes
- Redirects unauthorized users to login page
- Shows access denied for incorrect roles

## Common Issues and Solutions

1. **Incorrect Redirections**:
   - Check `userInfo.isAdmin` is set correctly in Redux state
   - Verify the role is correct in Redux state
   - Ensure navigation is only happening once (beware of infinite redirect loops)

2. **Missing Profile Icon/Menu**:
   - Check if user is correctly stored in Redux state
   - Verify localStorage has the profile information 
   - Make sure the Header component can access the Redux state

3. **Access to Admin Areas**:
   - Protected by ProtectedRoute component with requiredRole
   - Only users with matching roles can access these areas
   - Authenticated users with wrong roles see an "Access Denied" message

## Testing the Flow

1. **Regular User**:
   - Login → Stay on homepage
   - Can access general content and `/dashboard`
   - Cannot access admin dashboards

2. **Admin User**:
   - Login → Redirect to role-specific dashboard
   - Can access their specific dashboard
   - Cannot access dashboards for other admin roles
