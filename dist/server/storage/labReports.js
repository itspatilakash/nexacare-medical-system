import { db } from "./db";
import { labReports } from "../../shared/schema";
import { eq } from "drizzle-orm";
export const createLabReport = async (report) => {
    return await db.insert(labReports).values(report).returning();
};
export const getLabReportsForPatient = async (patientId) => {
    return await db.select().from(labReports).where(eq(labReports.patientId, patientId));
};
export const getLabReportsByLab = async (labId) => {
    return await db.select().from(labReports).where(eq(labReports.labId, labId));
};
