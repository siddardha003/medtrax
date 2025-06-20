# Authentication and Navigation Update

## Summary of Changes
This update simplifies the authentication and navigation flow to ensure:

1. Regular users remain on the homepage (Homepage.jsx) after login
2. Admin users (super_admin, hospital_admin, shop_admin) are redirected to their respective dashboards
3. The navigation is more intuitive with clear separation between user and admin interfaces

## Key Changes Made

### Redux Login Action
- Modified to redirect regular users to the homepage (`/`) instead of `/user-home`
- Admin users continue to be redirected to their specific dashboards based on role

### Header Component
- Updated to navigate regular users to the homepage instead of `/user-home`
- Maintains profile dropdown functionality for all users
- Keeps separate login links for users and admins

### Dashboard.js
- Fixed eslint error (removed stray `~` character)
- Maintains redirection logic for admin users who somehow end up on the general dashboard

### App.js
- Updated `/user-home` route to render `Home2` (Homepage) component instead of `UserHome`
- This ensures consistency if any legacy code still redirects to `/user-home`

## Testing Instructions

### User Login Flow
1. Navigate to `/login`
2. Log in with regular user credentials
3. Verify you remain on the homepage with header showing profile icon

### Admin Login Flow
1. Navigate to `/admin-login`
2. Log in with admin credentials
3. Verify you are redirected to the appropriate dashboard based on role

## Additional Notes
- The `UserHome.jsx` component is no longer used as `Homepage.jsx` serves as the landing page for all users
- Maintaining backward compatibility with any existing navigation links
