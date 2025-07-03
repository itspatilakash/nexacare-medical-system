// server/services/hospitals.service.ts
import { db } from '../storage/db';
import { hospitals } from '../storage/db';
import { eq } from 'drizzle-orm';
export const getAllHospitals = async () => {
    return db.select().from(hospitals);
};
export const verifyHospital = async (hospitalId) => {
    return db
        .update(hospitals)
        .set({ isVerified: true })
        .where(eq(hospitals.id, hospitalId));
};
