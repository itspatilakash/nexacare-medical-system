import { db } from '../storage/db';
import { labs, labReports } from '../../shared/schema';
import { eq } from 'drizzle-orm';
export const getAllLabs = async () => {
    return db.select().from(labs);
};
export const verifyLab = async (labId) => {
    return db.update(labs).set({ isActive: true }).where(eq(labs.id, labId)).returning();
};
export const createLabReport = async (data) => {
    return db.insert(labReports).values(data).returning();
};
export const getLabReportsForLab = async (labId) => {
    return db.select().from(labReports).where(eq(labReports.labId, labId));
};
