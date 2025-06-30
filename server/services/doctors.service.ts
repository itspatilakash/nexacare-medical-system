// server/services/doctors.service.ts
import { db } from '../storage/db';
import { getDoctors } from "../storage"; 
import { eq } from 'drizzle-orm';

export const getDoctorsByHospital = async (hospitalId: number) => {
  return db.select().from(doctors).where(eq(doctors.hospitalId, hospitalId));
};

export const verifyDoctor = async (doctorId: number) => {
  return db.update(doctors).set({ isVerified: true }).where(eq(doctors.id, doctorId));
};
