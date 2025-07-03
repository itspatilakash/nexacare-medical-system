import { db } from "./db";
import { receptionists } from "../../shared/schema";
import { eq } from "drizzle-orm";
export const createReceptionist = async (rec) => {
    return await db.insert(receptionists).values(rec).returning();
};
export const getReceptionistById = async (id) => {
    return await db.select().from(receptionists).where(eq(receptionists.id, id)).limit(1);
};
export const getReceptionistsByHospital = async (hospitalId) => {
    return await db.select().from(receptionists).where(eq(receptionists.hospitalId, hospitalId));
};
