// server/services/availability.service.ts
import { db } from '../storage/db';
import { appointments } from '../storage/db';
import { and, eq } from 'drizzle-orm';

export const isDoctorAvailable = async (
  doctorId: number,
  appointmentDate: string,
  timeSlot: string
) => {
  const [conflict] = await db
    .select()
    .from(appointments)
    .where(
      and(
        eq(appointments.doctorId, doctorId),
        eq(appointments.appointmentDate, appointmentDate),
        eq(appointments.timeSlot, timeSlot)
      )
    );

  return !conflict;
};
