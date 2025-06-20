# Admin User Creation Guide

## Password Requirements

When creating a new admin account, the password must meet the following requirements:

1. **Minimum length**: 6 characters
2. **Character types**: Must include at least:
   - One uppercase letter (A-Z)
   - One lowercase letter (a-z)
   - One number (0-9)

Example of a valid password: `Admin123`

## Role-Specific Requirements

### Hospital Admin
When creating a Hospital Admin account, you must:
1. Select "Hospital Admin" as the role
2. Choose a hospital from the dropdown menu
   - If no hospitals are available, create a hospital first in the Hospitals tab

### Shop Admin
When creating a Shop Admin account, you must:
1. Select "Shop Admin" as the role
2. Choose a medical shop from the dropdown menu
   - If no shops are available, create a shop first in the Shops tab

## Name Requirements

- **First Name**: Required, minimum 2 characters
- **Last Name**: Optional, but if provided, must be at least 2 characters

## Email Requirements

- Must be a valid email format (e.g., user@example.com)
- Must be unique (not already used by another user)

## Troubleshooting

If you encounter validation errors when creating an admin user:

1. Check that the password meets all requirements
2. Ensure you've selected the correct role
3. For Hospital/Shop Admins, verify you've selected a facility from the dropdown
4. Make sure the email address is not already in use
5. Verify that the first name and last name (if provided) are at least 2 characters

## Admin Types and Permissions

| Admin Type | Access Level | Can Manage |
|------------|--------------|------------|
| Super Admin | Full system access | All hospitals, shops, and users |
| Hospital Admin | Hospital-specific | Appointments, patients, hospital operations |
| Shop Admin | Shop-specific | Inventory, orders, shop operations |
