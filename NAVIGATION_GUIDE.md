# MedTrax Navigation Flow Guide

## Navigation Behavior

### Regular Users
1. When a regular user logs in, they are redirected to the homepage (localhost:3000)
2. Their profile icon appears in the header (showing first letter of name)
3. Clicking the profile icon shows a dropdown with:
   - Dashboard option (takes them to /dashboard)
   - Logout option

### Admin Users
1. When an admin logs in, they are redirected to their specific dashboard:
   - Super Admin → /admin-panel
   - Hospital Admin → /hospital-dashboard
   - Shop Admin → /shop-dashboard
2. Their profile icon also appears in the header
3. Clicking the profile icon shows the same dropdown options

## Common Issues & Solutions

### Profile Icon Not Showing After Login
- Make sure the user data is correctly stored in Redux state
- Check that `userInfo.name` is properly available in the Header component
- Verify localStorage is storing user data correctly

### Incorrect Navigation After Login
- The navigation happens in `loginAccount` action in Redux
- Make sure the proper role check is implemented
- Ensure all admin roles are properly identified with `isAdmin` flag

### Dashboard Not Showing Correct Content
- Each dashboard should check the user's role
- Protected routes should verify the proper user role
- Hospital/Shop dashboards should only show data for that specific admin

### Can't Access Dashboards
- Make sure the proper routes are protected with `ProtectedRoute` component
- Verify the `requiredRole` prop is correctly set
- Check that the user token is valid and not expired

## Testing Navigation Flow

1. Login as a regular user:
   - Should redirect to homepage
   - Header should show profile icon
   - Dropdown should work
   - Dashboard should show user info

2. Login as an admin:
   - Should redirect to proper dashboard based on role
   - Header should still show profile icon if on a page with the Header component
   - Dashboard specific to role should appear

## Troubleshooting

If navigation issues persist:
1. Check browser console for errors
2. Verify Redux state has correct user information
3. Ensure localStorage has the proper user profile data
4. Check that all routes are properly defined in App.js
5. Make sure the Header component is correctly handling the user state
