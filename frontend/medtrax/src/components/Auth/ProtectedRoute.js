import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { token, userInfo } = useSelector(state => state.user || {});
  const location = useLocation();
  
  useEffect(() => {
    console.log('ProtectedRoute check:', {
      path: location.pathname,
      requiredRole,
      userRole: userInfo?.role,
      isAdmin: userInfo?.isAdmin,
      isAuthenticated: !!token && !!userInfo?.id
    });
  }, [location.pathname, requiredRole, token, userInfo, userInfo?.role, userInfo?.isAdmin]);
  
  // Check if user is authenticated
  if (!token || !userInfo?.id) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if specific role is required
  if (requiredRole && userInfo.role !== requiredRole) {
    console.log('Access denied - wrong role', {
      required: requiredRole,
      actual: userInfo.role
    });
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500">
            Required role: <span className="font-semibold">{requiredRole}</span><br/>
            Your role: <span className="font-semibold">{userInfo.role}</span>
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  console.log('Access granted to', location.pathname);
  return children;
};

export default ProtectedRoute;
