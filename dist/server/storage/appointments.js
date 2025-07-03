// server/storage/appointments.ts
import { db } from './db';
import { appointments } from '../../shared/schema';
import { eq } from 'drizzle-orm';
/**
 * Insert a new appointment record into the DB.
 */
export const createAppointment = (appt) => {
    return db.insert(appointments).values(appt).returning();
};
/**
 * Get a single appointment by ID.
 */
export const getAppointmentById = (id) => {
    return db.select().from(appointments).where(eq(appointments.id, id)).limit(1);
};
/**
 * Get all appointments for a doctor.
 */
export const getAppointmentsForDoctor = (doctorId) => {
    return db.select().from(appointments).where(eq(appointments.doctorId, doctorId));
};
/**
 * Get all appointments for a patient.
 */
export const getAppointmentsForPatient = (patientId) => {
    return db.select().from(appointments).where(eq(appointments.patientId, patientId));
};
