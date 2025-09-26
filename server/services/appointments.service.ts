// server/services/appointments.service.ts
import { db } from '../storage/db';
import { appointments } from '../../shared/schema';
import type { InsertAppointment } from '../../shared/schema-types';

// Mock data storage for demo purposes
let mockAppointments: any[] = [
  {
    id: 1,
    patientId: 1,
    doctorId: 1,
    hospitalId: 1,
    appointmentDate: new Date('2024-09-26T10:00:00Z'),
    appointmentTime: '10:00 AM',
    timeSlot: '10:00-10:30',
    reason: 'Regular checkup',
    status: 'pending',
    type: 'online',
    priority: 'normal',
    symptoms: 'None',
    notes: 'First appointment',
    createdBy: 1,
    createdAt: new Date('2024-09-25T08:00:00Z')
  },
  {
    id: 2,
    patientId: 2,
    doctorId: 1,
    hospitalId: 1,
    appointmentDate: new Date('2024-09-26T11:00:00Z'),
    appointmentTime: '11:00 AM',
    timeSlot: '11:00-11:30',
    reason: 'Follow-up consultation',
    status: 'confirmed',
    type: 'online',
    priority: 'normal',
    symptoms: 'Cough and cold',
    notes: 'Follow-up from previous visit',
    createdBy: 2,
    createdAt: new Date('2024-09-24T10:00:00Z'),
    confirmedAt: new Date('2024-09-24T12:00:00Z')
  }
];

/**
 * Book a new appointment.
 */
export const bookAppointment = async (
  data: Omit<InsertAppointment, 'id' | 'createdAt' | 'status'>,
  user: { id: number; mobileNumber: string; role: string; fullName: string }
) => {
  console.log(`📅 Creating appointment for patient ${data.patientId} with doctor ${data.doctorId}`);
  
  const appointmentData = {
    id: mockAppointments.length + 1,
    ...data,
    status: 'pending',
    createdBy: user.id,
    createdAt: new Date()
  };

  mockAppointments.push(appointmentData);
  console.log(`✅ Appointment created: ${appointmentData.id}`);
  
  return [appointmentData];
};

/**
 * Get all appointments assigned to a specific doctor.
 */
export const getAppointmentsByDoctor = async (doctorId: number) => {
  console.log(`📅 Fetching appointments for doctor ${doctorId}`);
  const result = mockAppointments.filter(apt => apt.doctorId === doctorId);
  console.log(`📋 Found ${result.length} appointments for doctor`);
  return result;
};

/**
 * Get all appointments for a specific patient.
 */
export const getAppointmentsByPatient = async (patientId: number) => {
  console.log(`📅 Fetching appointments for patient ${patientId}`);
  const result = mockAppointments.filter(apt => apt.patientId === patientId);
  console.log(`📋 Found ${result.length} appointments for patient`);
  return result;
};

/**
 * Get all appointments for a specific hospital.
 */
export const getAppointmentsByHospital = async (hospitalId: number) => {
  console.log(`📅 Fetching appointments for hospital ${hospitalId}`);
  const result = mockAppointments.filter(apt => apt.hospitalId === hospitalId);
  console.log(`📋 Found ${result.length} appointments for hospital`);
  return result;
};

/**
 * Get appointment by ID.
 */
export const getAppointmentById = async (appointmentId: number) => {
  console.log(`📅 Fetching appointment ${appointmentId}`);
  const result = mockAppointments.find(apt => apt.id === appointmentId);
  return result || null;
};

/**
 * Update appointment status.
 */
export const updateAppointmentStatus = async (
  appointmentId: number, 
  status: string, 
  updatedBy?: number
) => {
  console.log(`📅 Updating appointment ${appointmentId} status to ${status}`);
  
  const appointmentIndex = mockAppointments.findIndex(apt => apt.id === appointmentId);
  if (appointmentIndex === -1) {
    throw new Error('Appointment not found');
  }
  
  mockAppointments[appointmentIndex].status = status;
  if (updatedBy) mockAppointments[appointmentIndex].updatedBy = updatedBy;
  mockAppointments[appointmentIndex].updatedAt = new Date();
  
  console.log(`✅ Appointment ${appointmentId} status updated to ${status}`);
  return mockAppointments[appointmentIndex];
};

/**
 * Cancel appointment.
 */
export const cancelAppointment = async (appointmentId: number, userId: number) => {
  console.log(`📅 Cancelling appointment ${appointmentId}`);
  
  const appointmentIndex = mockAppointments.findIndex(apt => apt.id === appointmentId);
  if (appointmentIndex === -1) {
    throw new Error('Appointment not found');
  }
  
  mockAppointments[appointmentIndex].status = 'cancelled';
  mockAppointments[appointmentIndex].updatedBy = userId;
  mockAppointments[appointmentIndex].updatedAt = new Date();
  
  console.log(`✅ Appointment ${appointmentId} cancelled`);
  return mockAppointments[appointmentIndex];
};

/**
 * Confirm appointment.
 */
export const confirmAppointment = async (appointmentId: number, userId: number) => {
  console.log(`📅 Confirming appointment ${appointmentId}`);
  
  const appointmentIndex = mockAppointments.findIndex(apt => apt.id === appointmentId);
  if (appointmentIndex === -1) {
    throw new Error('Appointment not found');
  }
  
  mockAppointments[appointmentIndex].status = 'confirmed';
  mockAppointments[appointmentIndex].confirmedAt = new Date();
  mockAppointments[appointmentIndex].updatedBy = userId;
  mockAppointments[appointmentIndex].updatedAt = new Date();
  
  console.log(`✅ Appointment ${appointmentId} confirmed`);
  return mockAppointments[appointmentIndex];
};

/**
 * Complete appointment.
 */
export const completeAppointment = async (appointmentId: number, userId: number) => {
  console.log(`📅 Completing appointment ${appointmentId}`);
  
  const appointmentIndex = mockAppointments.findIndex(apt => apt.id === appointmentId);
  if (appointmentIndex === -1) {
    throw new Error('Appointment not found');
  }
  
  mockAppointments[appointmentIndex].status = 'completed';
  mockAppointments[appointmentIndex].completedAt = new Date();
  mockAppointments[appointmentIndex].updatedBy = userId;
  mockAppointments[appointmentIndex].updatedAt = new Date();
  
  console.log(`✅ Appointment ${appointmentId} completed`);
  return mockAppointments[appointmentIndex];
};

/**
 * Get appointments by status.
 */
export const getAppointmentsByStatus = async (status: string) => {
  console.log(`📅 Fetching appointments with status: ${status}`);
  const result = mockAppointments.filter(apt => apt.status === status);
  console.log(`📋 Found ${result.length} appointments with status ${status}`);
  return result;
};

/**
 * Get appointments by date range.
 */
export const getAppointmentsByDateRange = async (startDate: Date, endDate: Date) => {
  console.log(`📅 Fetching appointments from ${startDate} to ${endDate}`);
  const result = mockAppointments.filter(apt => {
    const aptDate = new Date(apt.appointmentDate);
    return aptDate >= startDate && aptDate <= endDate;
  });
  console.log(`📋 Found ${result.length} appointments in date range`);
  return result;
};
