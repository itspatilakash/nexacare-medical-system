import { db } from "./db";
import { doctors } from "../../shared/schema";
import { eq } from "drizzle-orm";
export const createDoctor = async (doctor) => {
    return await db.insert(doctors).values(doctor).returning();
};
export const getDoctorById = async (id) => {
    return await db.select().from(doctors).where(eq(doctors.id, id)).limit(1);
};
export const getDoctorsByHospital = async (hospitalId) => {
    return await db.select().from(doctors).where(eq(doctors.hospitalId, hospitalId));
};
export const getAllDoctors = async () => {
    return await db.select().from(doctors);
};
