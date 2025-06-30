// server/services/appointments.service.ts
import { db } from '../storage/db';
import { appointments } from '../storage/db';
import { eq } from 'drizzle-orm';

export const bookAppointment = async (data: {
  patientId: number;
  doctorId: number;
  hospitalId: number;
  appointmentDate: string;
  timeSlot: string;
  mode: 'online' | 'walk-in';
}) => {
  return db.insert(appointments).values(data).returning();
};

export const getAppointmentsByDoctor = async (doctorId: number) => {
  return db.select().from(appointments).where(eq(appointments.doctorId, doctorId));
};

export const getAppointmentsByPatient = async (patientId: number) => {
  return db.select().from(appointments).where(eq(appointments.patientId, patientId));
};
