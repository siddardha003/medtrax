import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { initializeAuth } from '../../Redux/user/actions';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, userInfo } = useSelector(state => state.user || {});

  useEffect(() => {
    // Initialize authentication state only once on app startup
    dispatch(initializeAuth());
  }, [dispatch]);

  // Handle routing based on user role after authentication is loaded
  useEffect(() => {
    // Only redirect if we're at the root or user layout path and the user is an admin
    if (token && userInfo?.role && userInfo?.isAdmin && 
        (location.pathname === '/' || location.pathname === '/user-home')) {
      console.log('AuthInitializer: Admin detected, redirecting to appropriate dashboard');
      
      switch (userInfo.role) {
        case 'super_admin':
          navigate('/admin-panel', { replace: true });
          break;
        case 'hospital_admin':
          navigate('/hospital-dashboard', { replace: true });
          break;
        case 'shop_admin':
          navigate('/shop-dashboard', { replace: true });
          break;
        default:
          break;
      }
    }
  }, [token, userInfo, navigate, location.pathname]);

  return children;
};

export default AuthInitializer;
