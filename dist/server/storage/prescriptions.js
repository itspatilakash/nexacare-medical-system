import { db } from "./db";
import { prescriptions } from "../../shared/schema";
import { eq } from "drizzle-orm";
export const createPrescription = async (prescription) => {
    return await db.insert(prescriptions).values(prescription).returning();
};
export const getPrescriptionsForPatient = async (patientId) => {
    return await db.select().from(prescriptions).where(eq(prescriptions.patientId, patientId));
};
export const getPrescriptionsForAppointment = async (appointmentId) => {
    return await db.select().from(prescriptions).where(eq(prescriptions.appointmentId, appointmentId));
};
