import express from 'express';
import { signUp, signIn, verifyOTP } from '../controllers/authControllers.js';

const router = express.Router();

// Routes for sign-up, sign-in, OTP verification
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/verify-otp', verifyOTP);

export default router;