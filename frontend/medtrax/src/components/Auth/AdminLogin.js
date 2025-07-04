import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginAdminAccount } from '../../Redux/user/actions';
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

const SelectField = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  box-sizing: border-box;
  background-color: white;
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

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector(state => state.user || {});
  
  // Redirect if already logged in as admin
  useEffect(() => {
    if (userInfo && userInfo.id && userInfo.isAdmin) {
      
      // Navigate based on admin role
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
          navigate('/');
          break;
      }
    }
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!selectedRole) {
      setError('Please select an admin role');
      return;
    }

    setLoading(true);
    
    try {
      const loginData = {
        email,
        password,
        role: selectedRole // Explicitly include admin role
      };
      
      
      const result = await dispatch(loginAdminAccount(loginData, navigate));
      
      if (result && result.success) {
        dispatch(showNotification({
          message: result.message || 'Admin login successful!',
          messageType: 'success'
        }));
      }
    } catch (err) {
      console.error('Admin login error:', err);
      
      // Check for special case of user trying to use admin login
      if (err?.response?.status === 401 && 
          err?.response?.data?.message?.includes('Invalid credentials')) {
        const userFriendlyMessage = 'Admin not found. Please check your credentials or use the regular user login if you have a user account.';
        setError(userFriendlyMessage);
        dispatch(showNotification({
          message: userFriendlyMessage,
          messageType: 'error'
        }));
      } 
      // Check for unknown email
      else if (err?.response?.status === 401 && 
              err?.response?.data?.message?.includes('User not found')) {
        const userFriendlyMessage = 'Admin not found. Please check your email or contact system administrator.';
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
        const userFriendlyMessage = 'Invalid email or password. Please check your credentials and try again.';
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
        <Title>Admin Login</Title>
        
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
          
          <SelectField 
            value={selectedRole} 
            onChange={e => setSelectedRole(e.target.value)}
            required
          >
            <option value="">Select Admin Role</option>
            <option value="super_admin">Super Admin</option>
            <option value="hospital_admin">Hospital Admin</option>
            <option value="shop_admin">Medical Shop Admin</option>
          </SelectField>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </form>
      </LoginCard>
    </Container>
  );
};

export default AdminLogin;
