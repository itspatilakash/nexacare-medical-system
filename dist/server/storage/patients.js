import { db } from "./db";
import { patients } from "../../shared/schema";
import { eq } from "drizzle-orm";
// Insert a new patient
export const createPatient = async (patient) => {
    return await db.insert(patients).values(patient).returning();
};
// Get patient by ID (expects number, not string)
export const getPatientById = async (id) => {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id)).limit(1);
    return patient;
};
// List all patients
export const getAllPatients = async () => {
    return await db.select().from(patients);
};
