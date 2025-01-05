import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f9f9;
`;

const LoginCard = styled.div`
  background-color: #e8efef;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
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
`;

// const Link = styled.p`
//   text-align: center;
//   margin-top: 20px;
//   color: #0066cc;
//   font-size: 14px;
//   cursor: pointer;
// `;

const Signin = () => {
  return (
    <Container>
      <LoginCard>
        <Title>Login</Title>
        <form>
          <InputField type="email" placeholder="Email" required />
          <InputField type="password" placeholder="Password" required />
          <Button type="submit">Login</Button>
        </form>
        <Link to="/Signup">Don't have an account? Sign Up</Link>
      </LoginCard>
    </Container>
  );
};

export default Signin;
