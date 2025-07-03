// server/routes/auth.routes.ts
import { Router } from 'express';
import { z } from 'zod';
import {
  sendOtp,
  verifyOtp,
  registerUser,
  loginUser,
} from '../services/auth.service';
import {
  registrationSchema,
  otpVerificationSchema,
  loginSchema,
} from '../../shared/schema';

const router = Router();

router.post('/otp/send', async (req, res) => {
  try {
    const validated = registrationSchema.pick({ mobileNumber: true, role: true }).parse(req.body);
    const result = await sendOtp(validated.mobileNumber, validated.role);
    res.json(result);
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(400).json({ message: 'Invalid OTP request' });
  }
});

router.post('/otp/verify', async (req, res) => {
  try {
    const validated = otpVerificationSchema.parse(req.body);
    const result = await verifyOtp(validated);
    res.json(result);
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(400).json({ message: 'OTP verification failed' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const validated = registrationSchema.parse(req.body);
    const result = await registerUser(validated);
    res.json(result);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const validated = loginSchema.parse(req.body);
    const result = await loginUser(validated);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: 'Login failed' });
  }
});

export default router;