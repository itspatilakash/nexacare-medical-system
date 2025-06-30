import { db } from "./db";
import { hospitals } from "../../shared/schema";
import { InsertHospital } from "../../shared/schema-types";
import { eq } from "drizzle-orm";

export const createHospital = async (hospital: InsertHospital) => {
  return await db.insert(hospitals).values(hospital).returning();
};

export const getHospitalById = async (id: string) => {
  return await db.select().from(hospitals).where(eq(hospitals.id, id)).limit(1);
};

export const getAllHospitals = async () => {
  return await db.select().from(hospitals);
};
