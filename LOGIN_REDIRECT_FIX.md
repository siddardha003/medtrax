# Login Redirect Fix Guide

## Problem
Regular users are incorrectly being redirected to `/hospital-dashboard` instead of staying on the homepage (`/`) after login.

## Root Cause Analysis
The redirection issue could be happening at multiple places:

1. Redux login action (`loginAccount` in actions.js)
2. User role determination logic in the backend
3. EnhancedLogin component useEffect redirect logic
4. Dashboard component redirect logic

## Step-by-Step Fix

### Step 1: Explicitly check the login API response

Add a `console.log` to display the server response for the login:

```javascript
// In Redux/user/actions.js - loginAccount action
try {
  const { data } = await loginUserApi(formData);
  console.log("LOGIN RESPONSE:", data);
  
  // Check if user role is explicitly set
  console.log("User role from API:", data.data?.user?.role);
  console.log("Is admin check:", ['super_admin', 'hospital_admin', 'shop_admin'].includes(data.data?.user?.role));
  
  // Rest of the code...
}
```

### Step 2: Add clear role discrimination

Modify the Redux login action to add this code immediately after receiving the response:

```javascript
// Right after getting the response data
if (!data.data?.user?.role) {
  console.error("USER ROLE MISSING IN RESPONSE!");
  data.data.user.role = 'user'; // Force default role if missing
}
```

### Step 3: Fix the dashboard redirection

Modify the Dashboard.js file to prevent automatic redirection for regular users:

```javascript
useEffect(() => {
  // Only redirect admins, not regular users
  if (userInfo?.role && ['super_admin', 'hospital_admin', 'shop_admin'].includes(userInfo.role)) {
    switch (userInfo.role) {
      case 'super_admin':
        navigate('/admin-panel');
        break;
      case 'hospital_admin':
        navigate('/hospital-dashboard');
        break;
      case 'shop_admin':
        navigate('/shop-dashboard');
        break;
      default:
        // Don't redirect regular users
        break;
    }
  }
}, [userInfo?.role, navigate]);
```

### Step 4: Bypass the role check in ProtectedRoute component

For testing purposes, temporarily modify the ProtectedRoute.js file:

```javascript
// In ProtectedRoute.js
// Check if specific role is required
if (requiredRole && userInfo.role !== requiredRole) {
  console.log("Role mismatch - required:", requiredRole, "user has:", userInfo.role);
  
  // TEMPORARY FIX: Skip the role check for hospital_admin to debug
  if (requiredRole === 'hospital_admin') {
    console.log("BYPASSING ROLE CHECK FOR DEBUGGING");
    return children;
  }
  
  // Rest of the access denied UI...
}
```

### Step 5: Create a test user with explicit role

Go to MongoDB and modify a test user to have an explicit role field set to "user"

### Step 6: Check localStorage after login

After login, open browser dev tools and run:
```javascript
console.log(JSON.parse(localStorage.getItem("profile")));
```
Make sure the user's role is correctly set.

## Immediate Fix To Try

Add this code to the Header.jsx component to log user info on each render:

```javascript
// Add near the top of the Header component
console.log("HEADER RENDER - User info:", userInfo);
console.log("HEADER RENDER - Is logged in:", isLoggedIn);
console.log("HEADER RENDER - Role:", userInfo?.role);
```

This will help track what's happening with the user state.

## Complete Solution

For a complete solution, ensure these are fixed:

1. User model in backend includes 'user' as a valid role
2. Registration function assigns 'user' role to new signups
3. Login action properly distinguishes between admin and regular users
4. Dashboard component doesn't auto-redirect regular users
5. All isAdmin checks use the proper role comparison

Check Redux DevTools after login to see exactly what user data is stored in state.
