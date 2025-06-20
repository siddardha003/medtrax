# Admin User Creation Guide

This document provides a guide for creating and managing administrator accounts in the MedTrax system.

## Overview

The Super Admin panel allows you to create three types of admin accounts:

1. **Hospital Admins** - Manage hospital operations, appointments, and patient records
2. **Shop Admins** - Manage medical shop inventory and orders
3. **Super Admins** - Full system access (only via database seeding, not through the UI)

## Creating Admin Accounts

To create a new admin account:

1. Log in to the Super Admin panel
2. Navigate to the "Users" tab or click "Create Admin" on the dashboard
3. Fill in the required information:
   - **First Name** (required)
   - **Last Name** (optional)
   - **Email** (required) - This will be their login username
   - **Password** (required) - Must be at least 6 characters
   - **Phone** (optional)
   - **Role** (required) - Select Hospital Admin or Shop Admin

4. Click "Create Admin Account"

## Form Validation

The form performs the following validations:

- Email must be a valid email format
- Password must be at least 6 characters
- First Name is required
- Role selection is required

## What Happens After Creation

When an admin account is created:

1. The new admin is added to the database with the selected role
2. The admin appears in the Users list in the Super Admin panel
3. The admin can log in using the provided email and password through the admin login page
4. Hospital or Shop admins will be restricted to managing only their assigned facility

## Troubleshooting

If you encounter errors when creating admin accounts:

- **"User with this email already exists"** - Try a different email address
- **"Password must be at least 6 characters"** - Ensure the password is long enough
- **"Invalid credentials"** - Check if the email format is correct
- **Network errors** - Check your internet connection and try again

## Best Practices

- Use strong passwords (mix of letters, numbers, and special characters)
- Use real email addresses so admins can receive account notifications
- Provide clear instructions to new admins on how to access their dashboard
- Regularly review the list of admin accounts to ensure proper access control
