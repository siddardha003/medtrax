import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUserAccount } from '../../Redux/user/actions';
import { showNotification } from '../../Redux/notification/actions';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f9f9;
  padding: 20px;
`;

const LoginCard = styled.div`
  background-color: #e8efef;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 450px;
  width: 100%;
`;

const Title = styled.h2`
  text-align: center;
  color: #02a2ae;
  margin-bottom: 20px;
  font-size: 24px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  box-sizing: border-box;
`;

const Button = styled.button`
  background-color: #02a2ae;
  color: white;
  padding: 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  margin-top: 10px;

  &:hover {
    background-color: #0052a3;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  margin-top: 10px;
  font-size: 14px;
  text-align: center;
`;

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector(state => state.user || {});
  
  // Redirect if already logged in
  useEffect(() => {
    if (userInfo && userInfo.id) {
      console.log('User already logged in, redirecting to homepage');
      navigate('/');
    }
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    
    try {
      const loginData = {
        email,
        password,
        role: 'user' // Explicitly specify user role for validation
      };
      
      console.log('User login attempt with data:', loginData);
      const result = await dispatch(loginUserAccount(loginData, navigate));
      
      if (result && result.success) {
        dispatch(showNotification({
          message: result.message || 'Login successful!',
          messageType: 'success'
        }));
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Check for special case of admin trying to use user login
      if (err?.response?.status === 401 && 
          err?.response?.data?.message?.includes('Admin accounts must use the admin login')) {
        const userFriendlyMessage = 'User not found. If you are an admin, please use the admin login page.';
        setError(userFriendlyMessage);
        dispatch(showNotification({
          message: userFriendlyMessage,
          messageType: 'error'
        }));
      } 
      // Check for unknown email (regular user not found)
      else if (err?.response?.status === 401 && 
               err?.response?.data?.message?.includes('User not found')) {
        const userFriendlyMessage = 'User not found. Please check your email or register if you don\'t have an account.';
        setError(userFriendlyMessage);
        dispatch(showNotification({
          message: userFriendlyMessage,
          messageType: 'error'
        }));
      }
      else if (err?.response?.status === 403 && 
                 err?.response?.data?.message?.includes('use the correct login page')) {
        const userFriendlyMessage = 'Access denied. Please use the correct login page for your account type.';
        setError(userFriendlyMessage);
        dispatch(showNotification({
          message: userFriendlyMessage,
          messageType: 'error'
        }));
      } 
      // Generic 401 errors (invalid credentials)
      else if (err?.response?.status === 401) {
        const userFriendlyMessage = 'Invalid email or password. Please try again or register if you don\'t have an account.';
        setError(userFriendlyMessage);
        dispatch(showNotification({
          message: userFriendlyMessage,
          messageType: 'error'
        }));
      }
      else {
        // Handle other errors
        const errorMessage = err?.response?.data?.message || err?.message || 'Login failed. Please check your credentials and try again.';
        setError(errorMessage);
        dispatch(showNotification({
          message: errorMessage,
          messageType: 'error'
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard>
        <Title>User Login</Title>
        
        <form onSubmit={handleSubmit}>
          <InputField 
            type="email" 
            placeholder="Email" 
            required 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          
          <InputField 
            type="password" 
            placeholder="Password" 
            required 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </form>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/signup">Don't have an account? Sign Up</Link>
        </div>
      </LoginCard>
    </Container>
  );
};

export default UserLogin;
