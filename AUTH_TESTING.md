# MedTrax Authentication Testing Checklist

Use this checklist to verify that the authentication and routing structure works as expected.

## Setup Verification

- [ ] Confirm both login pages are accessible:
  - [ ] User login at `/login`
  - [ ] Admin login at `/admin-login`
- [ ] Verify links between login pages work

## User Authentication Flow

### Regular User

- [ ] Access the login page at `/login`
- [ ] Login with regular user credentials
- [ ] Verify you remain on the homepage (Homepage.jsx)
- [ ] Check that the profile icon appears in the header
- [ ] Click profile icon and verify dropdown works
- [ ] Verify "My Account" link navigates to the homepage
- [ ] Logout and verify you're redirected to the homepage

### Admin User

- [ ] Access the admin login page at `/admin-login`
- [ ] Login with admin credentials and select appropriate role
- [ ] Verify redirection to the role-specific dashboard:
  - [ ] Super Admin → `/admin-panel`
  - [ ] Hospital Admin → `/hospital-dashboard`
  - [ ] Shop Admin → `/shop-dashboard`
- [ ] Check that the profile icon appears in the header
- [ ] Click profile icon and verify dropdown works
- [ ] Verify "Admin Dashboard" link navigates to the correct dashboard
- [ ] Logout and verify you're redirected to the homepage

## Route Protection Testing

- [ ] While not logged in, try accessing:
  - [ ] `/user-home` (should redirect to login)
  - [ ] `/admin-panel` (should redirect to login)
  - [ ] `/hospital-dashboard` (should redirect to login)
  - [ ] `/shop-dashboard` (should redirect to login)

- [ ] While logged in as a regular user, try accessing:
  - [ ] `/admin-panel` (should show access denied)
  - [ ] `/hospital-dashboard` (should show access denied)
  - [ ] `/shop-dashboard` (should show access denied)

- [ ] While logged in as an admin, try accessing dashboards for other admin roles:
  - [ ] Super Admin accessing `/hospital-dashboard` (should show access denied)
  - [ ] Hospital Admin accessing `/admin-panel` (should show access denied)
  - [ ] Shop Admin accessing `/admin-panel` (should show access denied)

## Header Display Testing

- [ ] When not logged in:
  - [ ] Verify "User Login" link is visible
  - [ ] Verify "Admin Login" link is visible

- [ ] When logged in as regular user:
  - [ ] Verify user's initial appears in profile icon
  - [ ] Verify dropdown shows user's name and email
  - [ ] Verify dropdown shows "My Account" (not "Admin Dashboard")

- [ ] When logged in as admin:
  - [ ] Verify admin's initial appears in profile icon
  - [ ] Verify dropdown shows admin's name and email
  - [ ] Verify dropdown shows "Admin Dashboard" (not "My Account")

## Notes

Document any issues encountered during testing here:

1. 
2. 
3. 
