import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUserAccount, loginAdminAccount } from '../../Redux/user/actions';
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

const ToggleContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #d1d5db;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 10px;
  border: none;
  background-color: ${props => props.active ? '#02a2ae' : 'white'};
  color: ${props => props.active ? 'white' : '#4a5568'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.active ? '#02a2ae' : '#f0f0f0'};
  }
`;

const EnhancedLogin = () => {
  // Try to get saved login type from localStorage
  const savedLoginType = localStorage.getItem('medtrax_login_type') || 'user';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState(savedLoginType);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { userInfo } = useSelector(state => state.user || {});
  // Save login type preference to localStorage
  useEffect(() => {
    localStorage.setItem('medtrax_login_type', loginType);
  }, [loginType]);

  // Redirect if already logged in
  useEffect(() => {
    if (userInfo && userInfo.id) {
      console.log('User already logged in, redirecting appropriately');
      if (userInfo.isAdmin) {
        // Admin users - redirect to their dashboard
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
      } else {
        // Regular users - redirect to homepage
        navigate('/');
      }
    }
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (loginType === 'admin' && !selectedRole) {
      setError('Please select an admin role');
      return;
    }    setLoading(true);
    
    try {
      if (loginType === 'admin') {
        // Admin login
        const loginData = {
          email,
          password,
          role: selectedRole
        };
        console.log('Admin login attempt with data:', loginData);
        await dispatch(loginAdminAccount(loginData, navigate));
      } else {
        // Regular user login
        const loginData = {
          email,
          password
        };
        console.log('User login attempt with data:', loginData);
        await dispatch(loginUserAccount(loginData, navigate));
      }
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard>
        <Title>Login to MedTrax</Title>
        
        <ToggleContainer>
          <ToggleButton 
            active={loginType === 'user'} 
            onClick={() => setLoginType('user')}
          >
            User Login
          </ToggleButton>
          <ToggleButton 
            active={loginType === 'admin'} 
            onClick={() => setLoginType('admin')}
          >
            Admin Login
          </ToggleButton>
        </ToggleContainer>
        
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
          
          {loginType === 'admin' && (
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
          )}
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </form>
        
        {loginType === 'user' && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/signup">Don't have an account? Sign Up</Link>
          </div>
        )}
      </LoginCard>    </Container>
  );
};

export default EnhancedLogin;
