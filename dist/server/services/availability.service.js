// server/services/availability.service.ts
import { db } from "../storage/db";
import { appointments, doctors } from "../storage/db";
import { and, eq } from "drizzle-orm";
export const isDoctorAvailable = async (doctorId, appointmentDate, timeSlot) => {
    const [conflict] = await db
        .select()
        .from(appointments)
        .where(and(eq(appointments.doctorId, doctorId), eq(appointments.appointmentDate, new Date(appointmentDate)), eq(appointments.timeSlot, timeSlot)));
    return !conflict;
};
// Update available slots (Hospital admin)
export const updateDoctorAvailability = async (doctorId, slots) => {
    return await db
        .update(doctors)
        .set({ availableSlots: slots })
        .where(eq(doctors.id, doctorId))
        .returning();
};
// Doctor sets their in/out status
export const setDoctorStatus = async (doctorId, status) => {
    return await db
        .update(doctors)
        .set({ status })
        .where(eq(doctors.id, doctorId))
        .returning();
};
