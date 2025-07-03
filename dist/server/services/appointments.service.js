// server/services/appointments.service.ts
import { db } from '../storage/db';
import { appointments } from '../../shared/schema';
import { eq } from 'drizzle-orm';
/**
 * Book a new appointment.
 * Ensures status defaults to 'pending' and sets createdBy.
 */
export const bookAppointment = async (data, p0) => {
    return await db.insert(appointments).values({
        ...data,
        status: 'pending', // explicitly defaulting; you can remove if schema handles it
    }).returning();
};
/**
 * Get all appointments assigned to a specific doctor.
 */
export const getAppointmentsByDoctor = async (doctorId) => {
    return await db
        .select()
        .from(appointments)
        .where(eq(appointments.doctorId, doctorId));
};
/**
 * Get all appointments for a specific patient.
 */
export const getAppointmentsByPatient = async (patientId) => {
    return await db
        .select()
        .from(appointments)
        .where(eq(appointments.patientId, patientId));
};
