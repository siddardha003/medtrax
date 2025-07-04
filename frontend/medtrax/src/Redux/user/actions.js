import { createUserApi, loginUserApi } from "../../Api";

export const CREATE_ACCOUNT = "CREATE_ACCOUNT";
export const Add_LOGIN_USER = "Add_LOGIN_USER";
export const LOGOUT = "LOGOUT";
export const INITIALIZE_AUTH = "INITIALIZE_AUTH";

export const createAccount = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await createUserApi(formData);
    
    // Navigate to login page after successful registration
    if (navigate) {
      navigate("/login");
    }
    
    return data; // Return data for component to handle notifications
  } catch (error) {
    console.log(error?.message);
    console.log(error);
    // Re-throw to allow component to handle the error
    throw error;
  }
};

export const loginUserAccount = (formData, navigate) => async (dispatch) => {
  try {
    console.log('loginUserAccount (regular user) action called with formData:', formData);
    
    // Ensure we're explicitly marking this as a regular user login
    const userFormData = {
      ...formData,
      role: 'user'  // Explicitly set role to 'user' for regular user login - required for backend validation
    };
    
    const { data } = await loginUserApi(userFormData);
    console.log("Regular user login response:", data);
    
    // Backend sends: { success: true, message: "Login successful", data: { token, user } }
    if (data.success && data.data) {
      const { token, user } = data.data;
      console.log('User data from API:', user);
      
      // Format for frontend storage
      const userData = {
        token: token,
        userInfo: {
          id: user._id || user.id,
          name: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role || 'user',
          isAdmin: false  // Force isAdmin to false for regular user login
        }
      };
        // Store in localStorage
      localStorage.setItem("profile", JSON.stringify(userData));
      
      dispatch({ type: Add_LOGIN_USER, payload: userData });
      
      // Always navigate to homepage for regular users
      if (navigate) {
        console.log('Regular user successfully logged in, going to homepage');
        navigate("/");
      }
      
      return { success: true, data: userData, message: data.message || `Welcome ${userData.userInfo.name}` };
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.log(error);
    throw error; // Re-throw to allow components to handle the error
  }
};

export const loginAdminAccount = (formData, navigate) => async (dispatch) => {
  try {
    console.log('loginAdminAccount action called with formData:', formData);
    
    // Ensure admin role is provided
    if (!formData.role || !['super_admin', 'hospital_admin', 'shop_admin'].includes(formData.role)) {
      throw new Error("Valid admin role is required");
    }
    
    // Ensure the role is properly set in the form data for backend validation
    const adminFormData = {
      ...formData,
      role: formData.role // Make sure role is included for backend validation
    };
    
    const { data } = await loginUserApi(adminFormData); // Use adminFormData with role properly set
    console.log("Admin login response:", data);
    
    // Backend sends: { success: true, message: "Login successful", data: { token, user } }
    if (data.success && data.data) {
      const { token, user } = data.data;
      console.log('Admin data from API:', user);
      
      // Format for frontend storage
      const userData = {
        token: token,
        userInfo: {
          id: user._id || user.id,
          name: user.fullName || `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isAdmin: true  // Force isAdmin to true for admin login
        }
      };
      
      // Store in localStorage
      localStorage.setItem("profile", JSON.stringify(userData));
        dispatch({ type: Add_LOGIN_USER, payload: userData });
      
      // Navigate based on admin role - ONLY if navigate function is provided
      if (navigate) {
        console.log('Navigating after admin login, role:', user.role);
        
        // Admin dashboard navigation
        switch (user.role) {
          case 'super_admin':
            console.log('Redirecting super_admin to /admin-panel');
            navigate("/admin-panel");
            break;
          case 'hospital_admin':
            console.log('Redirecting hospital_admin to /hospital-dashboard');
            navigate("/hospital-dashboard");
            break;
          case 'shop_admin':
            console.log('Redirecting shop_admin to /shop-dashboard');
            navigate("/shop-dashboard");
            break;          default:
            // Fallback for unknown admin roles to homepage
            console.log('Unknown admin role, redirecting to homepage');
            navigate("/");
            break;
        }
      } else {
        console.log('No navigate function provided, skipping navigation');
      }
      
      return { success: true, data: userData, message: data.message || `Welcome Admin ${userData.userInfo.name}` };
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.log(error);
    throw error; // Re-throw to allow components to handle the error
  }
};

// Remove the wrapper function that causes double calls
// Components should call loginUserAccount or loginAdminAccount directly
// export const loginAccount = (formData, navigate) => async (dispatch) => {
//   console.log('Original loginAccount called, checking if admin or regular user');
//   
//   const isAdminLogin = formData.role && ['super_admin', 'hospital_admin', 'shop_admin'].includes(formData.role);
//   
//   if (isAdminLogin) {
//     return dispatch(loginAdminAccount(formData, navigate));
//   } else {
//     return dispatch(loginUserAccount(formData, navigate));
//   }
// };

export const logOut = () => async (dispatch) => {
  console.log('Logging out user...');
  
  // Completely remove the profile from localStorage
  localStorage.removeItem("profile");
  
  dispatch({
    type: LOGOUT,
    payload: {
      token: null,
      userInfo: {
        id: "",
        name: "",
        email: "",
        role: "",
        isAdmin: false,
      },
    },
  });
  
  console.log('User logged out, navigation will be handled by component');
  return { success: true, message: "Logged out successfully" };
};

// Initialize authentication state from localStorage on app startup
export const initializeAuth = () => (dispatch) => {
  try {
    const profile = localStorage.getItem("profile");
    if (profile && profile !== 'null' && profile !== 'undefined') {
      const userData = JSON.parse(profile);
      if (userData && userData.token && userData.userInfo?.id) {
        console.log('Initializing authentication state from localStorage');
        dispatch({ type: Add_LOGIN_USER, payload: userData });
      } else {
        console.log('Invalid profile data found, clearing localStorage');
        localStorage.removeItem("profile");
      }
    }
  } catch (error) {
    console.error('Error initializing auth state:', error);
    localStorage.removeItem("profile");
  }
};
