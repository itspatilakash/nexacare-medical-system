import { db } from "./db";
import { patients } from "../../shared/schema";
import { eq } from "drizzle-orm";
export const createPatient = async (patient) => {
    return await db.insert(patients).values(patient).returning();
};
export const getPatientById = async (id) => {
    return await db.select().from(patients).where(eq(patients.id, id)).limit(1);
};
export const getAllPatients = async () => {
    return await db.select().from(patients);
};
