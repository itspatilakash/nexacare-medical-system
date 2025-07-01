import type { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    mobileNumber: string;
    role: string;
    fullName: string;
  };
}

export type UserRole = 'hospital' | 'doctor' | 'patient' | 'lab' | 'receptionist';
export type AppointmentType = 'online' | 'walk-in';
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
export type NotificationType = 'appointment_confirmed' | 'appointment_cancelled' | 'prescription_ready';
