import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to enhanced login page
    navigate('/login');
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Redirecting to login page...</p>
    </div>
  );
};

export default Signin;
