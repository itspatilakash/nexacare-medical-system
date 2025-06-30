import { db } from "./db";
import { receptionists } from "../../shared/schema";
import { InsertReceptionist } from "../../shared/schema-types";
import { eq } from "drizzle-orm";

export const createReceptionist = async (rec: InsertReceptionist) => {
  return await db.insert(receptionists).values(rec).returning();
};

export const getReceptionistById = async (id: string) => {
  return await db.select().from(receptionists).where(eq(receptionists.id, id)).limit(1);
};

export const getReceptionistsByHospital = async (hospitalId: string) => {
  return await db.select().from(receptionists).where(eq(receptionists.hospitalId, hospitalId));
};
