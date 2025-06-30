// server/services/reception.service.ts
import { db } from '../storage/db';
import { receptionists } from '../storage/db';
import { eq } from 'drizzle-orm';

export const getReceptionistsByHospital = async (hospitalId: number) => {
  return db.select().from(receptionists).where(eq(receptionists.hospitalId, hospitalId));
};

export const addReceptionist = async (data: {
  fullName: string;
  mobileNumber: string;
  hospitalId: number;
}) => {
  return db.insert(receptionists).values(data).returning();
};
