import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f9f9;
  padding: 20px;
`;

const Card = styled.div`
  background-color: #e8efef;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  color: #02a2ae;
  margin-bottom: 20px;
  font-size: 28px;
`;

const Subtitle = styled.h2`
  color: #4b5563;
  margin-bottom: 30px;
  font-size: 18px;
`;

const Button = styled(Link)`
  display: inline-block;
  background-color: #02a2ae;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  margin-top: 10px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0052a3;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
  }
`;

const BackLink = styled(Link)`
  color: #6b7280;
  margin-top: 30px;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const AdminPortal = () => {
  return (
    <Container>
      <Card>
        <Title>MedTrax Admin Portal</Title>
        <Subtitle>Access restricted to authorized administrators only</Subtitle>
        
        <Button to="/admin-login">
          Go to Admin Login
        </Button>
        
        <div style={{ marginTop: '40px' }}>
          <BackLink to="/">
            ← Return to Homepage
          </BackLink>
        </div>
      </Card>
    </Container>
  );
};

export default AdminPortal;
