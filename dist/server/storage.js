import { users, hospitals, doctors, patients, labs, receptionists, appointments, prescriptions, labReports, otpVerifications } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, desc, asc } from "drizzle-orm";
export class DatabaseStorage {
    // User management
    async getUser(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user || undefined;
    }
    async getUserByMobileNumber(mobileNumber) {
        const [user] = await db.select().from(users).where(eq(users.mobileNumber, mobileNumber));
        return user || undefined;
    }
    async createUser(insertUser) {
        const [user] = await db.insert(users).values(insertUser).returning();
        return user;
    }
    async updateUserVerification(id, isVerified) {
        await db.update(users).set({ isVerified }).where(eq(users.id, id));
    }
    // OTP management
    async createOtp(insertOtp) {
        const [otp] = await db.insert(otpVerifications).values(insertOtp).returning();
        return otp;
    }
    async getValidOtp(mobileNumber, otp) {
        const now = new Date();
        const [otpRecord] = await db
            .select()
            .from(otpVerifications)
            .where(and(eq(otpVerifications.mobileNumber, mobileNumber), eq(otpVerifications.otp, otp), eq(otpVerifications.isUsed, false), gte(otpVerifications.expiresAt, now)));
        return otpRecord || undefined;
    }
    async markOtpAsUsed(id) {
        await db.update(otpVerifications).set({ isUsed: true }).where(eq(otpVerifications.id, id));
    }
    // Hospital management
    async createHospital(hospital) {
        const [newHospital] = await db.insert(hospitals).values(hospital).returning();
        return newHospital;
    }
    async getHospitalByUserId(userId) {
        const [hospital] = await db.select().from(hospitals).where(eq(hospitals.userId, userId));
        return hospital || undefined;
    }
    async updateHospital(id, hospital) {
        const [updated] = await db.update(hospitals).set(hospital).where(eq(hospitals.id, id)).returning();
        return updated;
    }
    // Doctor management
    async createDoctor(doctor) {
        const [newDoctor] = await db.insert(doctors).values(doctor).returning();
        return newDoctor;
    }
    async getDoctorByUserId(userId) {
        const [doctor] = await db.select().from(doctors).where(eq(doctors.userId, userId));
        return doctor || undefined;
    }
    async getDoctorsByHospitalId(hospitalId) {
        return db.select().from(doctors).where(eq(doctors.hospitalId, hospitalId));
    }
    async updateDoctor(id, doctor) {
        const [updated] = await db.update(doctors).set(doctor).where(eq(doctors.id, id)).returning();
        return updated;
    }
    // Patient management
    async createPatient(patient) {
        const [newPatient] = await db.insert(patients).values(patient).returning();
        return newPatient;
    }
    async getPatientByUserId(userId) {
        const [patient] = await db.select().from(patients).where(eq(patients.userId, userId));
        return patient || undefined;
    }
    async getPatientsByHospitalId(hospitalId) {
        // Get patients through appointments
        return db
            .select({
            id: patients.id,
            userId: patients.userId,
            dateOfBirth: patients.dateOfBirth,
            gender: patients.gender,
            bloodGroup: patients.bloodGroup,
            address: patients.address,
            emergencyContact: patients.emergencyContact,
            emergencyContactName: patients.emergencyContactName,
            medicalHistory: patients.medicalHistory,
            allergies: patients.allergies,
            createdAt: patients.createdAt,
        })
            .from(patients)
            .innerJoin(appointments, eq(patients.id, appointments.patientId))
            .where(eq(appointments.hospitalId, hospitalId));
    }
    async updatePatient(id, patient) {
        const [updated] = await db.update(patients).set(patient).where(eq(patients.id, id)).returning();
        return updated;
    }
    // Lab management
    async createLab(lab) {
        const [newLab] = await db.insert(labs).values(lab).returning();
        return newLab;
    }
    async getLabByUserId(userId) {
        const [lab] = await db.select().from(labs).where(eq(labs.userId, userId));
        return lab || undefined;
    }
    async updateLab(id, lab) {
        const [updated] = await db.update(labs).set(lab).where(eq(labs.id, id)).returning();
        return updated;
    }
    // Receptionist management
    async createReceptionist(receptionist) {
        const [newReceptionist] = await db.insert(receptionists).values(receptionist).returning();
        return newReceptionist;
    }
    async getReceptionistByUserId(userId) {
        const [receptionist] = await db.select().from(receptionists).where(eq(receptionists.userId, userId));
        return receptionist || undefined;
    }
    async getReceptionistsByHospitalId(hospitalId) {
        return db.select().from(receptionists).where(eq(receptionists.hospitalId, hospitalId));
    }
    // Appointment management
    async createAppointment(appointment) {
        const [newAppointment] = await db.insert(appointments).values(appointment).returning();
        return newAppointment;
    }
    async getAppointmentsByPatientId(patientId) {
        return db
            .select()
            .from(appointments)
            .where(eq(appointments.patientId, patientId))
            .orderBy(desc(appointments.appointmentDate));
    }
    async getAppointmentsByDoctorId(doctorId) {
        return db
            .select()
            .from(appointments)
            .where(eq(appointments.doctorId, doctorId))
            .orderBy(desc(appointments.appointmentDate));
    }
    async getAppointmentsByHospitalId(hospitalId) {
        return db
            .select()
            .from(appointments)
            .where(eq(appointments.hospitalId, hospitalId))
            .orderBy(desc(appointments.appointmentDate));
    }
    async getTodaysAppointments(doctorId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return db
            .select()
            .from(appointments)
            .where(and(eq(appointments.doctorId, doctorId), gte(appointments.appointmentDate, today), gte(tomorrow, appointments.appointmentDate)))
            .orderBy(asc(appointments.appointmentTime));
    }
    async updateAppointmentStatus(id, status) {
        const [updated] = await db
            .update(appointments)
            .set({ status })
            .where(eq(appointments.id, id))
            .returning();
        return updated;
    }
    // Prescription management
    async createPrescription(prescription) {
        const [newPrescription] = await db.insert(prescriptions).values(prescription).returning();
        return newPrescription;
    }
    async getPrescriptionsByPatientId(patientId) {
        return db
            .select()
            .from(prescriptions)
            .where(eq(prescriptions.patientId, patientId))
            .orderBy(desc(prescriptions.createdAt));
    }
    async getPrescriptionsByDoctorId(doctorId) {
        return db
            .select()
            .from(prescriptions)
            .where(eq(prescriptions.doctorId, doctorId))
            .orderBy(desc(prescriptions.createdAt));
    }
    // Lab report management
    async createLabReport(labReport) {
        const [newLabReport] = await db.insert(labReports).values(labReport).returning();
        return newLabReport;
    }
    async getLabReportsByPatientId(patientId) {
        return db
            .select()
            .from(labReports)
            .where(eq(labReports.patientId, patientId))
            .orderBy(desc(labReports.reportDate));
    }
    async getLabReportsByLabId(labId) {
        return db
            .select()
            .from(labReports)
            .where(eq(labReports.labId, labId))
            .orderBy(desc(labReports.reportDate));
    }
    async updateLabReportStatus(id, status) {
        const [updated] = await db
            .update(labReports)
            .set({ status })
            .where(eq(labReports.id, id))
            .returning();
        return updated;
    }
}
export const storage = new DatabaseStorage();
export function getUserByMobileNumber(mobileNumber) {
    throw new Error("Function not implemented.");
}
export function createOtp(arg0) {
    throw new Error("Function not implemented.");
}
export function getValidOtp(mobileNumber, otp) {
    throw new Error("Function not implemented.");
}
export function createUser(arg0) {
    throw new Error("Function not implemented.");
}
export function markOtpAsUsed(id) {
    throw new Error("Function not implemented.");
}
export function getUser(id) {
    throw new Error("Function not implemented.");
}
export function getHospitalByUserId(id) {
    throw new Error("Function not implemented.");
}
export function getDoctorByUserId(id) {
    throw new Error("Function not implemented.");
}
export function getPatientByUserId(id) {
    throw new Error("Function not implemented.");
}
export function getLabByUserId(id) {
    throw new Error("Function not implemented.");
}
export function getReceptionistByUserId(id) {
    throw new Error("Function not implemented.");
}
export function createHospital(arg0) {
    throw new Error("Function not implemented.");
}
export function updateHospital(id, validatedData) {
    throw new Error("Function not implemented.");
}
export function createDoctor(arg0) {
    throw new Error("Function not implemented.");
}
export function getDoctorsByHospitalId(hospitalId) {
    throw new Error("Function not implemented.");
}
export function createPatient(arg0) {
    throw new Error("Function not implemented.");
}
export function createAppointment(appointmentData) {
    throw new Error("Function not implemented.");
}
export function getAppointmentsByPatientId(id) {
    throw new Error("Function not implemented.");
}
export function getAppointmentsByDoctorId(id) {
    throw new Error("Function not implemented.");
}
export function getAppointmentsByHospitalId(id) {
    throw new Error("Function not implemented.");
}
export function getTodaysAppointments(id) {
    throw new Error("Function not implemented.");
}
export function createPrescription(arg0) {
    throw new Error("Function not implemented.");
}
export function getPrescriptionsByPatientId(id) {
    throw new Error("Function not implemented.");
}
export function getPrescriptionsByDoctorId(id) {
    throw new Error("Function not implemented.");
}
export function createLabReport(arg0) {
    throw new Error("Function not implemented.");
}
export function getLabReportsByPatientId(id) {
    throw new Error("Function not implemented.");
}
export function getLabReportsByLabId(id) {
    throw new Error("Function not implemented.");
}
export function updateAppointmentStatus(appointmentId, arg1) {
    throw new Error("Function not implemented.");
}
export function getPatientsByHospitalId(id) {
    throw new Error("Function not implemented.");
}
