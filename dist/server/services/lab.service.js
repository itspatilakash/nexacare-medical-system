// server/services/labs.service.ts
import { db } from '../storage/db';
import { labs } from '../storage/db';
import { eq } from 'drizzle-orm';
export const getAllLabs = async () => {
    return db.select().from(labs);
};
export const verifyLab = async (labId) => {
    return db.update(labs).set({ isVerified: true }).where(eq(labs.id, labId));
};
