// server/services/doctors.service.ts
import { db } from '../storage/db';
import { doctors } from '../storage/db';
import { eq } from 'drizzle-orm';
export const getDoctorsByHospital = async (hospitalId) => {
    return db.select().from(doctors).where(eq(doctors.hospitalId, hospitalId));
};
export const verifyDoctor = async (doctorId) => {
    return db.update(doctors).set({ isVerified: true }).where(eq(doctors.id, doctorId));
};
export function getAvailableDoctors() {
    throw new Error("Function not implemented.");
}
export function getDoctorAppointments(doctorId) {
    throw new Error("Function not implemented.");
}
