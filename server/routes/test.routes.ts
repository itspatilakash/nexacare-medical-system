// Simple test routes for demo
import { Router } from 'express';

const router = Router();

// Test endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'NexaCare Medical System API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Test auth endpoint
router.get('/test-auth', (req, res) => {
  res.json({ 
    message: 'Auth system is working',
    demoAccounts: {
      hospital: '9876543210 / password123',
      doctor: '9876543211 / password123', 
      patient: '9876543212 / password123'
    }
  });
});

export default router;
