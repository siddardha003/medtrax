# MedTrax Authentication & RBAC Testing Checklist

## User Authentication Tests

- [ ] Regular user signup works correctly
- [ ] Regular user login works correctly
- [ ] After user login, profile icon with first letter of name appears in navbar
- [ ] Profile dropdown menu works when clicking on profile icon
- [ ] User can logout successfully from profile dropdown
- [ ] User remains on the main website after login (no redirect to dashboard)

## Admin Authentication Tests

- [ ] Admin login page shows role selection dropdown
- [ ] Login fails if no admin role is selected
- [ ] Super Admin login redirects to Admin Panel
- [ ] Hospital Admin login redirects to Hospital Dashboard
- [ ] Medical Shop Admin login redirects to Shop Dashboard
- [ ] Admin signup options are not available anywhere in the UI

## Super Admin Tests

- [ ] Super Admin can create new Hospital Admin credentials
- [ ] Super Admin can create new Medical Shop Admin credentials
- [ ] Created admins can login successfully with their credentials

## Hospital Admin Tests

- [ ] Hospital Admin can access Hospital Dashboard
- [ ] Hospital Admin can fill and save hospital information
- [ ] Saved hospital information appears correctly on the user-facing website
- [ ] Unsaved/unpublished hospital information is not visible to users

## Medical Shop Admin Tests

- [ ] Medical Shop Admin can access Shop Dashboard
- [ ] Medical Shop Admin can fill and save shop information and inventory
- [ ] Saved shop information appears correctly on the user-facing website
- [ ] Unsaved/unpublished shop information is not visible to users

## Protection & Access Control Tests

- [ ] Unauthenticated users cannot access any dashboard
- [ ] Users with insufficient permissions see an "Access Denied" message
- [ ] Users are redirected to login when trying to access protected routes
- [ ] Each admin role can only access their authorized dashboard

## UI Consistency Tests

- [ ] All login/signup forms maintain consistent visual styling
- [ ] Responsive design works on mobile, tablet, and desktop views
- [ ] No broken links or redirects in the authentication flow
- [ ] Enhanced Login page preserves the user's login type preference

## Logout & Session Tests

- [ ] Logout clears user data from local storage
- [ ] Logout redirects user to the home page
- [ ] Session persists correctly between page refreshes
- [ ] Session expires after token timeout

## Edge Cases & Error Handling

- [ ] Proper error messages for invalid credentials
- [ ] Handling of network errors during login/signup
- [ ] Proper loading states during authentication processes
- [ ] Form validation works correctly for all inputs

## Test Accounts

**Super Admin:**
- Email: superadmin@medtrax.com
- Password: (secure password)

**Hospital Admin:**
- Email: hospital@medtrax.com
- Password: (secure password)

**Medical Shop Admin:**
- Email: shop@medtrax.com
- Password: (secure password)

**Regular User:**
- Email: user@example.com
- Password: (secure password)
