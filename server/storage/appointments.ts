import { db } from "./db";
import { appointments } from "../../shared/schema";
import { InsertAppointment } from "../../shared/schema-types";
import { eq } from "drizzle-orm";

export const createAppointment = async (appt: InsertAppointment) => {
  return await db.insert(appointments).values(appt).returning();
};

export const getAppointmentById = async (id: string) => {
  return await db.select().from(appointments).where(eq(appointments.id, id)).limit(1);
};

export const getAppointmentsForDoctor = async (doctorId: string) => {
  return await db.select().from(appointments).where(eq(appointments.doctorId, doctorId));
};

export const getAppointmentsForPatient = async (patientId: string) => {
  return await db.select().from(appointments).where(eq(appointments.patientId, patientId));
};
