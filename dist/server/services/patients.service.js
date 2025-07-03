// server/services/patients.service.ts
import { db } from '../storage/db';
import { patients } from '../storage/db';
import { eq } from 'drizzle-orm';
export const getPatientById = async (patientId) => {
    const [patient] = await db.select().from(patients).where(eq(patients.id, patientId));
    return patient;
};
export const getPatientsByHospital = async (hospitalId) => {
    return db.select().from(patients).where(eq(patients.hospitalId, hospitalId));
};
