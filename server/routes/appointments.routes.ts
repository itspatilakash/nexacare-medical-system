// server/routes/appointments.routes.ts
import { Router } from 'express';
import * as appointmentService from '../services/appointments.service';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import type { AuthenticatedRequest } from '../types';

const router = Router();

router.post('/', authenticateToken, authorizeRoles('patient'), async (req : AuthenticatedRequest, res) => {
  try {
    const appointment = await appointmentService.bookAppointment(req.body, req.user!);
    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to book appointment' });
  }
});

router.get(
  '/patient/:patientId',
  authenticateToken,
  authorizeRoles('patient'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const appointments = await appointmentService.getAppointmentsByPatient(+req.params.patientId);
      res.json(appointments);
    } catch (err) {
      res.status(400).json({ message: 'Failed to fetch appointments' });
    }
  }
);

router.get(
  '/doctor/:doctorId',
  authenticateToken,
  authorizeRoles('doctor'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const appointments = await appointmentService.getAppointmentsByDoctor(+req.params.doctorId);
      res.json(appointments);
    } catch (err) {
      res.status(400).json({ message: 'Failed to fetch appointments' });
    }
  }
);

export default router;
