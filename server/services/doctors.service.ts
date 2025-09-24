// server/services/doctors.service.ts
import { db } from '../storage/db';
import { doctors, appointments } from '../../shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Get doctors in a hospital.
 */
export const getDoctorsByHospital = async (hospitalId: number) => {
  return db.select().from(doctors).where(eq(doctors.hospitalId, hospitalId));
};

/**
 * Mark a doctor as verified.
 */
export const verifyDoctor = async (doctorId: number) => {
  return db.update(doctors).set({ isVerified: true }).where(eq(doctors.id, doctorId)).returning();
};

/**
 * Get all doctors marked as available.
 */
export const getAvailableDoctors = async () => {
  return db.select().from(doctors).where(eq(doctors.isAvailable, true));
};

/**
 * Get all appointments assigned to this doctor.
 */
export const getDoctorAppointments = async (doctorId: number) => {
  return db.select().from(appointments).where(eq(appointments.doctorId, doctorId));
};
