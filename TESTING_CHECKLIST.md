# MedTrax Testing Checklist

Use this checklist to verify that the authentication and routing system is working correctly.

## User Authentication Testing

### Regular User Login
- [ ] Sign up as a new user
- [ ] Verify you're redirected to login page after signup
- [ ] Login with the new user credentials
- [ ] Verify you stay on the homepage after login
- [ ] Verify the profile icon appears in header
- [ ] Click profile icon and verify dropdown works
- [ ] Navigate to Dashboard from dropdown
- [ ] Verify you can see the Dashboard page
- [ ] Try accessing `/admin-panel` and verify you get Access Denied
- [ ] Try accessing `/hospital-dashboard` and verify you get Access Denied
- [ ] Try accessing `/shop-dashboard` and verify you get Access Denied
- [ ] Logout and verify you're redirected to the homepage
- [ ] Verify the profile icon is replaced with Login button

### Hospital Admin Login
- [ ] Login as a hospital admin
- [ ] Verify you're redirected to hospital dashboard
- [ ] Click profile icon and verify dropdown works
- [ ] Navigate to Dashboard from dropdown
- [ ] Verify you go to the hospital dashboard
- [ ] Try accessing `/admin-panel` and verify you get Access Denied
- [ ] Try accessing `/shop-dashboard` and verify you get Access Denied
- [ ] Logout and verify you're redirected to the homepage

### Shop Admin Login
- [ ] Login as a shop admin
- [ ] Verify you're redirected to shop dashboard
- [ ] Click profile icon and verify dropdown works
- [ ] Navigate to Dashboard from dropdown
- [ ] Verify you go to the shop dashboard
- [ ] Try accessing `/admin-panel` and verify you get Access Denied
- [ ] Try accessing `/hospital-dashboard` and verify you get Access Denied
- [ ] Logout and verify you're redirected to the homepage

### Super Admin Login
- [ ] Login as a super admin
- [ ] Verify you're redirected to admin panel
- [ ] Click profile icon and verify dropdown works
- [ ] Navigate to Dashboard from dropdown
- [ ] Verify you go to the admin panel
- [ ] Verify you can access all admin areas
- [ ] Logout and verify you're redirected to the homepage

## Redux State Testing

- [ ] After login, check Redux state in browser devtools
- [ ] Verify userInfo.isAdmin is correct for your user type
- [ ] Verify userInfo.role is correct for your user type
- [ ] Verify localStorage has the correct profile information

## Notes

- If any test fails, check the browser console for error messages
- Look for any React rendering errors or Redux state issues
- Check network requests for any API failures
