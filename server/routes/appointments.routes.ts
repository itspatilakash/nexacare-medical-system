// server/routes/appointments.routes.ts
import { Router } from 'express';
import * as appointmentService from '../services/appointments.service';

const router = Router();

// Book new appointment (Patient)
router.post('/', async (req, res) => {
  try {
    const appointment = await appointmentService.bookAppointment(req.body, req.user || { id: 1, mobileNumber: 'demo', role: 'patient', fullName: 'Demo User' });
    res.status(201).json(appointment);
  } catch (err) {
    console.error('Book appointment error:', err);
    res.status(400).json({ message: 'Failed to book appointment' });
  }
});

// Get appointments by patient ID
router.get('/patient/:patientId', async (req, res) => {
  try {
    const appointments = await appointmentService.getAppointmentsByPatient(+req.params.patientId);
    res.json(appointments);
  } catch (err) {
    console.error('Get patient appointments error:', err);
    res.status(400).json({ message: 'Failed to fetch appointments' });
  }
});

// Get appointments by doctor ID
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const appointments = await appointmentService.getAppointmentsByDoctor(+req.params.doctorId);
    res.json(appointments);
  } catch (err) {
    console.error('Get doctor appointments error:', err);
    res.status(400).json({ message: 'Failed to fetch appointments' });
  }
});

// Get appointments by hospital ID
router.get('/hospital/:hospitalId', async (req, res) => {
  try {
    const appointments = await appointmentService.getAppointmentsByHospital(+req.params.hospitalId);
    res.json(appointments);
  } catch (err) {
    console.error('Get hospital appointments error:', err);
    res.status(400).json({ message: 'Failed to fetch appointments' });
  }
});

// Get my appointments (for current user) - MUST be before /:appointmentId route
router.get('/my', async (req, res) => {
  try {
    // Return mock appointments for demo
    const mockAppointments = [
      {
        id: 1,
        doctorName: "Dr. John Smith",
        doctorSpecialty: "Cardiology",
        hospitalName: "City General Hospital",
        appointmentDate: "2024-09-26T10:00:00Z",
        appointmentTime: "10:00 AM",
        timeSlot: "10:00-10:30",
        reason: "Regular checkup",
        status: "confirmed",
        type: "online",
        priority: "normal"
      }
    ];
    res.json(mockAppointments);
  } catch (err) {
    console.error('Get my appointments error:', err);
    res.status(400).json({ message: 'Failed to fetch appointments' });
  }
});

// Get appointment by ID
router.get('/:appointmentId', async (req, res) => {
  try {
    const appointment = await appointmentService.getAppointmentById(+req.params.appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (err) {
    console.error('Get appointment error:', err);
    res.status(400).json({ message: 'Failed to fetch appointment' });
  }
});

// Update appointment status
router.patch('/:appointmentId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await appointmentService.updateAppointmentStatus(
      +req.params.appointmentId, 
      status, 
      req.user?.id
    );
    res.json(appointment);
  } catch (err) {
    console.error('Update appointment status error:', err);
    res.status(400).json({ message: 'Failed to update appointment status' });
  }
});

// Cancel appointment
router.patch('/:appointmentId/cancel', async (req, res) => {
  try {
    const appointment = await appointmentService.cancelAppointment(
      +req.params.appointmentId, 
      req.user?.id || 1
    );
    res.json(appointment);
  } catch (err) {
    console.error('Cancel appointment error:', err);
    res.status(400).json({ message: 'Failed to cancel appointment' });
  }
});

// Confirm appointment
router.patch('/:appointmentId/confirm', async (req, res) => {
  try {
    const appointment = await appointmentService.confirmAppointment(
      +req.params.appointmentId, 
      req.user?.id || 1
    );
    res.json(appointment);
  } catch (err) {
    console.error('Confirm appointment error:', err);
    res.status(400).json({ message: 'Failed to confirm appointment' });
  }
});

// Complete appointment
router.patch('/:appointmentId/complete', async (req, res) => {
  try {
    const appointment = await appointmentService.completeAppointment(
      +req.params.appointmentId, 
      req.user?.id || 1
    );
    res.json(appointment);
  } catch (err) {
    console.error('Complete appointment error:', err);
    res.status(400).json({ message: 'Failed to complete appointment' });
  }
});

// Get appointments by status
router.get('/status/:status', async (req, res) => {
  try {
    const appointments = await appointmentService.getAppointmentsByStatus(req.params.status);
    res.json(appointments);
  } catch (err) {
    console.error('Get appointments by status error:', err);
    res.status(400).json({ message: 'Failed to fetch appointments' });
  }
});

// Get appointments by date range
router.get('/date-range/:startDate/:endDate', async (req, res) => {
  try {
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    const appointments = await appointmentService.getAppointmentsByDateRange(startDate, endDate);
    res.json(appointments);
  } catch (err) {
    console.error('Get appointments by date range error:', err);
    res.status(400).json({ message: 'Failed to fetch appointments' });
  }
});

// Get my appointments (for current user)
router.get('/my', async (req, res) => {
  try {
    // Return mock appointments for demo
    const mockAppointments = [
      {
        id: 1,
        doctorName: "Dr. John Smith",
        doctorSpecialty: "Cardiology",
        hospitalName: "City General Hospital",
        appointmentDate: "2024-09-26T10:00:00Z",
        appointmentTime: "10:00 AM",
        timeSlot: "10:00-10:30",
        reason: "Regular checkup",
        status: "confirmed",
        type: "online",
        priority: "normal"
      }
    ];
    res.json(mockAppointments);
  } catch (err) {
    console.error('Get my appointments error:', err);
    res.status(400).json({ message: 'Failed to fetch appointments' });
  }
});

export default router;
