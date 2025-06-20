# ADMIN ACCESS GUIDE

## Overview

MedTrax now uses completely separated login flows for regular users and administrators. To maintain proper security and separation, the admin login page is no longer directly accessible from the main navigation.

## How to Access Admin Features

### Option 1: Direct URL Access
- Navigate directly to `/admin-portal` for the admin portal landing page
- Navigate directly to `/admin-login` to access the admin login screen

### Option 2: Access from Admin Portal
1. Go to `/admin-portal` to access the admin entry point
2. Click on "Go to Admin Login" to access the admin login screen

## Security Benefits

1. **Reduced Attack Surface**: By removing the admin login link from the public interface, we reduce the visibility of the admin area to potential attackers
2. **Clear User Separation**: Regular users are not prompted or encouraged to try accessing admin features
3. **Dedicated Access Path**: Administrators have a clear, dedicated path to access their login screen

## Admin Login Flow

1. Visit `/admin-portal` or `/admin-login`
2. Enter admin credentials:
   - Email
   - Password
   - Select the appropriate admin role (super_admin, hospital_admin, or shop_admin)
3. After successful login, you will be redirected to the appropriate dashboard based on your role:
   - Super Admin → Admin Panel
   - Hospital Admin → Hospital Dashboard
   - Shop Admin → Shop Dashboard

## Creating New Admin Users

As a Super Admin, you can create new admin users through the Admin Panel:

1. Log in to the Super Admin panel
2. Navigate to the "Users" tab or click "Create Admin" on the dashboard
3. Fill in the required information:
   - **First Name** (required)
   - **Last Name** (optional)
   - **Email** (required) - This will be their login username
   - **Password** (required) - Must be at least 6 characters
   - **Phone** (optional)
   - **Role** (required) - Select Hospital Admin or Shop Admin

For detailed information about creating admin users, refer to the [Admin Creation Guide](./ADMIN_CREATION_GUIDE.md).

## Role-Based Dashboards

Each admin role has access to a specific dashboard with functionality appropriate to their responsibilities:

- **Super Admin**: Full system access and administration
- **Hospital Admin**: Hospital management and operations
- **Shop Admin**: Medical shop inventory and sales management

## Troubleshooting Admin Access

If you encounter issues with admin access:

1. **Cannot create new admin user**:
   - Ensure all required fields are filled in correctly
   - Check that the email address is not already in use
   - Verify that the password is at least 6 characters

2. **Admin login issues**:
   - Verify that you're using the correct email and password
   - Check that your account has not been deactivated
   - Clear your browser cache or try an incognito window

## Important Notes

- Bookmark the admin portal URL for easy access
- Regular users cannot access admin dashboards, even if they have the direct URL
- Proper role validation happens both on the frontend and backend
- All admin navigation is managed centrally through Redux actions
