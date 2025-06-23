import { useSelector } from 'react-redux';

// Custom hook to check if user is authenticated
export const useAuth = () => {
  const user = useSelector(state => state.user);
  
  const isAuthenticated = !!(user?.token && user?.userInfo?.id);
  
  return {
    isAuthenticated,
    user: user?.userInfo || null,
    token: user?.token || null
  };
};

export default useAuth;
