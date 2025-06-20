import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createAccount } from '../../Redux/user/actions';

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

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      await dispatch(createAccount({
        name,
        email,
        phone,
        gender,
        password
      }, navigate));
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <SignUpCard>
        <Title>Sign Up</Title>
        <form onSubmit={handleSubmit}>
          <InputField type="text" placeholder="Full Name" required value={name} onChange={e => setName(e.target.value)} />
          <InputField type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
          <InputField type="tel" placeholder="Phone Number" required value={phone} onChange={e => setPhone(e.target.value)} />

          <GenderWrapper>
            <div>
              <input type="radio" id="male" name="gender" value="male" required checked={gender === 'male'} onChange={() => setGender('male')} />
              <RadioLabel htmlFor="male">Male</RadioLabel>
            </div>
            <div>
              <input type="radio" id="female" name="gender" value="female" required checked={gender === 'female'} onChange={() => setGender('female')} />
              <RadioLabel htmlFor="female">Female</RadioLabel>
            </div>
            <div>
              <input type="radio" id="other" name="gender" value="other" required checked={gender === 'other'} onChange={() => setGender('other')} />
              <RadioLabel htmlFor="other">Other</RadioLabel>
            </div>
          </GenderWrapper>

          <InputField type="password" placeholder="Password (min 6 characters)" required value={password} onChange={e => setPassword(e.target.value)} />
          <InputField type="password" placeholder="Confirm Password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />

          <Button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>

          {error && <div style={{ color: 'red', marginTop: 10, fontSize: '14px' }}>{error}</div>}
        </form>
        <Link to="/login">Already have an account? Login</Link>
      </SignUpCard>
    </Container>
  );
}

export default Signup;
