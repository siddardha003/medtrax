import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from '../../Redux/user/actions';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize authentication state only once on app startup
    dispatch(initializeAuth());
  }, [dispatch]);

  return children;
};

export default AuthInitializer;
