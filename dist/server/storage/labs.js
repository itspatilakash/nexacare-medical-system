import { db } from "./db";
import { labs } from "../../shared/schema";
import { eq } from "drizzle-orm";
export const createLab = async (lab) => {
    return await db.insert(labs).values(lab).returning();
};
export const getLabById = async (id) => {
    return await db.select().from(labs).where(eq(labs.id, id)).limit(1);
};
export const getAllLabs = async () => {
    return await db.select().from(labs);
};
