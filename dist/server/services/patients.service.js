import { db } from "../storage/db";
import { patients } from "../../shared/schema";
import { eq } from "drizzle-orm";
export const getPatientById = async (patientId) => {
    const [patient] = await db.select().from(patients).where(eq(patients.id, patientId));
    return patient;
};
export const getPatientByUserId = async (userId) => {
    const [patient] = await db.select().from(patients).where(eq(patients.userId, userId));
    return patient;
};
export const updatePatientByUserId = async (userId, data) => {
    const updated = await db
        .update(patients)
        .set(data)
        .where(eq(patients.userId, userId))
        .returning();
    return updated[0];
};
export const getPatientsByHospital = async (hospitalId) => {
    // Only possible if you join hospital → appointments → patient
    throw new Error("Not implemented: hospitalId is not a column on patients.");
};
