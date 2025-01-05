import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Label } from '@headlessui/react';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 110vh;
  background-color: #f4f9f9;
  margin-top: 10vh;
`;

const SignUpCard = styled.div`
  background-color: #e8efef;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  margin-top: 10vh;
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

const GenderWrapper = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
`;

const RadioLabel = styled.label`
  font-size: 16px;
  color: #555;
`;

const EmailWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const VerifyButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  margin-top: -3vh;
  &:hover {
    background-color: #218838;
  }
`;

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const handleVerifyEmail = (e) => {
    e.preventDefault();
    // Add any email validation logic here if needed
    if (email) {
      setIsEmailVerified(true);
    } else {
      alert('Please enter a valid email');
    }
  };

  return (
    <Container>
      <SignUpCard>
        <Title>Sign Up</Title>
        <form>
          <InputField type="text" placeholder="Full Name" required />
          
          <EmailWrapper>
            <InputField
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <VerifyButton onClick={handleVerifyEmail}>✓</VerifyButton>
          </EmailWrapper>
{/* Show OTP field only after email is verified */}
{isEmailVerified && (
            <InputField type="number" placeholder="OTP" required />
          )}

          <InputField type="number" placeholder="Phone Number" required />

          <GenderWrapper>
            <div>
              <input type="radio" id="male" name="gender" value="male" required />
              <RadioLabel htmlFor="male">Male</RadioLabel>
            </div>
            <div>
              <input type="radio" id="female" name="gender" value="female" required />
              <RadioLabel htmlFor="female">Female</RadioLabel>
            </div>
          </GenderWrapper>

          <InputField type="password" placeholder="Password" required />
          <InputField type="password" placeholder="Confirm Password" required />

          
          <Button type="submit">Sign Up</Button>
        </form>
        <Link to="/login">Already have an account? Login</Link>
      </SignUpCard>
    </Container>
  );
};

export default SignUp;
