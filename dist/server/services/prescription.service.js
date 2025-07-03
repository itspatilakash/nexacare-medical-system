// server/services/prescription.service.ts
import { db } from '../storage/db';
import { prescriptions } from '../storage/db';
export const issuePrescription = async (data) => {
    const inserted = await db.insert(prescriptions).values(data).returning();
    return inserted[0];
};
export const getPatientPrescriptions = async (patientId) => {
    return db.select().from(prescriptions).where(prescriptions.patientId === patientId);
};
