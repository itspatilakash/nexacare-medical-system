// server/services/prescription.service.ts
import { db } from "../storage/db";
import { prescriptions } from "../../shared/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { InsertPrescription } from "../../shared/schema-types";

// 1. Issue new prescription
export const issuePrescription = async (data: InsertPrescription) => {
  const inserted = await db.insert(prescriptions).values(data).returning();
  return inserted[0];
};

// 2. Get prescriptions for a patient (basic)
export const getPrescriptionsForPatient = async (patientId: number) => {
  return await db
    .select()
    .from(prescriptions)
    .where(eq(prescriptions.patientId, patientId));
};

// 3. Get filtered prescriptions for a patient by hospital/date range
export const getPrescriptionsByFilters = async ({
  patientId,
  hospitalId,
  from,
  to,
}: {
  patientId: number;
  hospitalId?: number;
  from?: Date;
  to?: Date;
}) => {
  let conditions = [eq(prescriptions.patientId, patientId)];

  if (hospitalId) {
    conditions.push(eq(prescriptions.hospitalId, hospitalId));
  }
  if (from && to) {
    conditions.push(gte(prescriptions.createdAt, from));
    conditions.push(lte(prescriptions.createdAt, to));
  }

  return await db.select().from(prescriptions).where(and(...conditions));
};

// 4. Update prescription (doctor-only)
export const updatePrescription = async (
  prescriptionId: number,
  doctorId: number,
  updates: Partial<Pick<InsertPrescription, "diagnosis" | "medications" | "instructions">>
) => {
  return await db
    .update(prescriptions)
    .set({ ...updates, createdAt: new Date() }) // use updatedAt if present
    .where(and(eq(prescriptions.id, prescriptionId), eq(prescriptions.doctorId, doctorId)))
    .returning();
};

// 5. Delete prescription (doctor-only)
export const deletePrescription = async (
  prescriptionId: number,
  doctorId: number
) => {
  return await db
    .delete(prescriptions)
    .where(and(eq(prescriptions.id, prescriptionId), eq(prescriptions.doctorId, doctorId)))
    .returning();
};

