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
    
    
    // Re-throw to allow component to handle the error
    throw error;
  }
};

export const loginUserAccount = (formData, navigate) => async (dispatch) => {
  try {    
    // Ensure we're explicitly marking this as a regular user login
    const userFormData = {
      ...formData,
      role: 'user'  // Explicitly set role to 'user' for regular user login - required for backend validation
    };
    
    const { data } = await loginUserApi(userFormData);
    
    
    // Backend sends: { success: true, message: "Login successful", data: { token, user } }
    if (data.success && data.data) {
      const { token, user } = data.data;
      
      
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
        
        navigate("/");
      }
      
      return { success: true, data: userData, message: data.message || `Welcome ${userData.userInfo.name}` };
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    
    throw error; // Re-throw to allow components to handle the error
  }
};

export const loginAdminAccount = (formData, navigate) => async (dispatch) => {
  try {
    
    
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
    
    
    // Backend sends: { success: true, message: "Login successful", data: { token, user } }
    if (data.success && data.data) {
      const { token, user } = data.data;
      
      
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
        
        
        // Admin dashboard navigation
        switch (user.role) {
          case 'super_admin':
            
            navigate("/admin-panel");
            break;
          case 'hospital_admin':
            
            navigate("/hospital-dashboard");
            break;
          case 'shop_admin':
            
            navigate("/shop-dashboard");
            break;          default:
            // Fallback for unknown admin roles to homepage
            
            navigate("/");
            break;
        }
      } else {
        
      }
      
      return { success: true, data: userData, message: data.message || `Welcome Admin ${userData.userInfo.name}` };
    } else {
      throw new Error("Invalid response format");
    }
  } catch (error) {
    
    throw error; // Re-throw to allow components to handle the error
  }
};

// Remove the wrapper function that causes double calls
// Components should call loginUserAccount or loginAdminAccount directly
// export const loginAccount = (formData, navigate) => async (dispatch) => {
//   
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
  
  
  return { success: true, message: "Logged out successfully" };
};

// Initialize authentication state from localStorage on app startup
export const initializeAuth = () => (dispatch) => {
  try {
    const profile = localStorage.getItem("profile");
    if (profile && profile !== 'null' && profile !== 'undefined') {
      const userData = JSON.parse(profile);
      if (userData && userData.token && userData.userInfo?.id) {
        
        dispatch({ type: Add_LOGIN_USER, payload: userData });
      } else {
        
        localStorage.removeItem("profile");
      }
    }
  } catch (error) {
    console.error('Error initializing auth state:', error);
    localStorage.removeItem("profile");
  }
};
