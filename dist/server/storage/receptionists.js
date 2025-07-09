// server/storage/receptionists.ts
import { db } from './db';
import { receptionists } from '../../shared/schema';
import { eq } from 'drizzle-orm';
export const createReceptionist = (rec) => {
    return db.insert(receptionists).values(rec).returning();
};
export const getReceptionistById = (id) => {
    return db.select().from(receptionists).where(eq(receptionists.id, id)).limit(1);
};
export const getReceptionistsByHospital = (hospitalId) => {
    return db.select().from(receptionists).where(eq(receptionists.hospitalId, hospitalId));
};
