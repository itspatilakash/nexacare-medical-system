// server/routes/reception.routes.ts
import { Router } from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import type { AuthenticatedRequest } from '../types';
import * as receptionService from '../services/reception.service';

const router = Router();

/**
 * Get walk-in appointments.
 */
router.get(
  '/walkins',
  authenticateToken,
  authorizeRoles('receptionist'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const receptionistId = req.user!.id;
      const walkins = await receptionService.getWalkInAppointments(receptionistId);
      res.json(walkins);
    } catch (err) {
      console.error('Get walk-ins error:', err);
      res.status(500).json({ message: 'Failed to fetch walk-ins' });
    }
  }
);

/**
 * Confirm a patient appointment.
 */
router.post(
  '/appointments/:id/confirm',
  authenticateToken,
  authorizeRoles('receptionist'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const appointmentId = Number(req.params.id);
      const receptionistId = req.user!.id;
      const result = await receptionService.confirmAppointment(appointmentId, receptionistId);
      res.json(result);
    } catch (err) {
      console.error('Confirm appointment error:', err);
      res.status(500).json({ message: 'Failed to confirm appointment' });
    }
  }
);

export default router;
