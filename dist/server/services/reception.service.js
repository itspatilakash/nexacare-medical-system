// server/services/reception.service.ts
import { db } from '../storage/db';
import { receptionists } from '../storage/db';
import { eq } from 'drizzle-orm';
export const getReceptionistsByHospital = async (hospitalId) => {
    return db.select().from(receptionists).where(eq(receptionists.hospitalId, hospitalId));
};
export const addReceptionist = async (data) => {
    return db.insert(receptionists).values(data).returning();
};
