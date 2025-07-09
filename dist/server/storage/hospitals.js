// server/storage/hospitals.ts
import { db } from './db';
import { hospitals } from '../../shared/schema';
import { eq } from 'drizzle-orm';
export const createHospital = (hospital) => {
    return db.insert(hospitals).values(hospital).returning();
};
export const getHospitalById = (id) => {
    return db.select().from(hospitals).where(eq(hospitals.id, id)).limit(1);
};
export const getAllHospitals = () => {
    return db.select().from(hospitals);
};
