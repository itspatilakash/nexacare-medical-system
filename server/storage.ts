import { 
  users, hospitals, doctors, patients, labs, receptionists, 
  appointments, prescriptions, labReports, otpVerifications,
  type User, type InsertUser, type Hospital, type InsertHospital,
  type Doctor, type InsertDoctor, type Patient, type InsertPatient,
  type Lab, type InsertLab, type Receptionist, type InsertReceptionist,
  type Appointment, type InsertAppointment, type Prescription, type InsertPrescription,
  type LabReport, type InsertLabReport, type OtpVerification, type InsertOtp
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByMobileNumber(mobileNumber: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserVerification(id: number, isVerified: boolean): Promise<void>;

  // OTP management
  createOtp(otp: InsertOtp): Promise<OtpVerification>;
  getValidOtp(mobileNumber: string, otp: string): Promise<OtpVerification | undefined>;
  markOtpAsUsed(id: number): Promise<void>;

  // Hospital management
  createHospital(hospital: InsertHospital & { userId: number }): Promise<Hospital>;
  getHospitalByUserId(userId: number): Promise<Hospital | undefined>;
  updateHospital(id: number, hospital: Partial<InsertHospital>): Promise<Hospital>;

  // Doctor management
  createDoctor(doctor: InsertDoctor & { userId: number }): Promise<Doctor>;
  getDoctorByUserId(userId: number): Promise<Doctor | undefined>;
  getDoctorsByHospitalId(hospitalId: number): Promise<Doctor[]>;
  updateDoctor(id: number, doctor: Partial<InsertDoctor>): Promise<Doctor>;

  // Patient management
  createPatient(patient: InsertPatient & { userId: number }): Promise<Patient>;
  getPatientByUserId(userId: number): Promise<Patient | undefined>;
  getPatientsByHospitalId(hospitalId: number): Promise<Patient[]>;
  updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient>;

  // Lab management
  createLab(lab: InsertLab & { userId: number }): Promise<Lab>;
  getLabByUserId(userId: number): Promise<Lab | undefined>;
  updateLab(id: number, lab: Partial<InsertLab>): Promise<Lab>;

  // Receptionist management
  createReceptionist(receptionist: InsertReceptionist & { userId: number }): Promise<Receptionist>;
  getReceptionistByUserId(userId: number): Promise<Receptionist | undefined>;
  getReceptionistsByHospitalId(hospitalId: number): Promise<Receptionist[]>;

  // Appointment management
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointmentsByPatientId(patientId: number): Promise<Appointment[]>;
  getAppointmentsByDoctorId(doctorId: number): Promise<Appointment[]>;
  getAppointmentsByHospitalId(hospitalId: number): Promise<Appointment[]>;
  getTodaysAppointments(doctorId: number): Promise<Appointment[]>;
  updateAppointmentStatus(id: number, status: string): Promise<Appointment>;

  // Prescription management
  createPrescription(prescription: InsertPrescription): Promise<Prescription>;
  getPrescriptionsByPatientId(patientId: number): Promise<Prescription[]>;
  getPrescriptionsByDoctorId(doctorId: number): Promise<Prescription[]>;

  // Lab report management
  createLabReport(labReport: InsertLabReport): Promise<LabReport>;
  getLabReportsByPatientId(patientId: number): Promise<LabReport[]>;
  getLabReportsByLabId(labId: number): Promise<LabReport[]>;
  updateLabReportStatus(id: number, status: string): Promise<LabReport>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByMobileNumber(mobileNumber: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.mobileNumber, mobileNumber));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserVerification(id: number, isVerified: boolean): Promise<void> {
    await db.update(users).set({ isVerified }).where(eq(users.id, id));
  }

  // OTP management
  async createOtp(insertOtp: InsertOtp): Promise<OtpVerification> {
    const [otp] = await db.insert(otpVerifications).values(insertOtp).returning();
    return otp;
  }

  async getValidOtp(mobileNumber: string, otp: string): Promise<OtpVerification | undefined> {
    const now = new Date();
    const [otpRecord] = await db
      .select()
      .from(otpVerifications)
      .where(
        and(
          eq(otpVerifications.mobileNumber, mobileNumber),
          eq(otpVerifications.otp, otp),
          eq(otpVerifications.isUsed, false),
          gte(otpVerifications.expiresAt, now)
        )
      );
    return otpRecord || undefined;
  }

  async markOtpAsUsed(id: number): Promise<void> {
    await db.update(otpVerifications).set({ isUsed: true }).where(eq(otpVerifications.id, id));
  }

  // Hospital management
  async createHospital(hospital: InsertHospital & { userId: number }): Promise<Hospital> {
    const [newHospital] = await db.insert(hospitals).values(hospital).returning();
    return newHospital;
  }

  async getHospitalByUserId(userId: number): Promise<Hospital | undefined> {
    const [hospital] = await db.select().from(hospitals).where(eq(hospitals.userId, userId));
    return hospital || undefined;
  }

  async updateHospital(id: number, hospital: Partial<InsertHospital>): Promise<Hospital> {
    const [updated] = await db.update(hospitals).set(hospital).where(eq(hospitals.id, id)).returning();
    return updated;
  }

  // Doctor management
  async createDoctor(doctor: InsertDoctor & { userId: number }): Promise<Doctor> {
    const [newDoctor] = await db.insert(doctors).values(doctor).returning();
    return newDoctor;
  }

  async getDoctorByUserId(userId: number): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.userId, userId));
    return doctor || undefined;
  }

  async getDoctorsByHospitalId(hospitalId: number): Promise<Doctor[]> {
    return db.select().from(doctors).where(eq(doctors.hospitalId, hospitalId));
  }

  async updateDoctor(id: number, doctor: Partial<InsertDoctor>): Promise<Doctor> {
    const [updated] = await db.update(doctors).set(doctor).where(eq(doctors.id, id)).returning();
    return updated;
  }

  // Patient management
  async createPatient(patient: InsertPatient & { userId: number }): Promise<Patient> {
    const [newPatient] = await db.insert(patients).values(patient).returning();
    return newPatient;
  }

  async getPatientByUserId(userId: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.userId, userId));
    return patient || undefined;
  }

  async getPatientsByHospitalId(hospitalId: number): Promise<Patient[]> {
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

  async updatePatient(id: number, patient: Partial<InsertPatient>): Promise<Patient> {
    const [updated] = await db.update(patients).set(patient).where(eq(patients.id, id)).returning();
    return updated;
  }

  // Lab management
  async createLab(lab: InsertLab & { userId: number }): Promise<Lab> {
    const [newLab] = await db.insert(labs).values(lab).returning();
    return newLab;
  }

  async getLabByUserId(userId: number): Promise<Lab | undefined> {
    const [lab] = await db.select().from(labs).where(eq(labs.userId, userId));
    return lab || undefined;
  }

  async updateLab(id: number, lab: Partial<InsertLab>): Promise<Lab> {
    const [updated] = await db.update(labs).set(lab).where(eq(labs.id, id)).returning();
    return updated;
  }

  // Receptionist management
  async createReceptionist(receptionist: InsertReceptionist & { userId: number }): Promise<Receptionist> {
    const [newReceptionist] = await db.insert(receptionists).values(receptionist).returning();
    return newReceptionist;
  }

  async getReceptionistByUserId(userId: number): Promise<Receptionist | undefined> {
    const [receptionist] = await db.select().from(receptionists).where(eq(receptionists.userId, userId));
    return receptionist || undefined;
  }

  async getReceptionistsByHospitalId(hospitalId: number): Promise<Receptionist[]> {
    return db.select().from(receptionists).where(eq(receptionists.hospitalId, hospitalId));
  }

  // Appointment management
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
  }

  async getAppointmentsByPatientId(patientId: number): Promise<Appointment[]> {
    return db
      .select()
      .from(appointments)
      .where(eq(appointments.patientId, patientId))
      .orderBy(desc(appointments.appointmentDate));
  }

  async getAppointmentsByDoctorId(doctorId: number): Promise<Appointment[]> {
    return db
      .select()
      .from(appointments)
      .where(eq(appointments.doctorId, doctorId))
      .orderBy(desc(appointments.appointmentDate));
  }

  async getAppointmentsByHospitalId(hospitalId: number): Promise<Appointment[]> {
    return db
      .select()
      .from(appointments)
      .where(eq(appointments.hospitalId, hospitalId))
      .orderBy(desc(appointments.appointmentDate));
  }

  async getTodaysAppointments(doctorId: number): Promise<Appointment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.doctorId, doctorId),
          gte(appointments.appointmentDate, today),
          gte(tomorrow, appointments.appointmentDate)
        )
      )
      .orderBy(asc(appointments.appointmentTime));
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment> {
    const [updated] = await db
      .update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();
    return updated;
  }

  // Prescription management
  async createPrescription(prescription: InsertPrescription): Promise<Prescription> {
    const [newPrescription] = await db.insert(prescriptions).values(prescription).returning();
    return newPrescription;
  }

  async getPrescriptionsByPatientId(patientId: number): Promise<Prescription[]> {
    return db
      .select()
      .from(prescriptions)
      .where(eq(prescriptions.patientId, patientId))
      .orderBy(desc(prescriptions.createdAt));
  }

  async getPrescriptionsByDoctorId(doctorId: number): Promise<Prescription[]> {
    return db
      .select()
      .from(prescriptions)
      .where(eq(prescriptions.doctorId, doctorId))
      .orderBy(desc(prescriptions.createdAt));
  }

  // Lab report management
  async createLabReport(labReport: InsertLabReport): Promise<LabReport> {
    const [newLabReport] = await db.insert(labReports).values(labReport).returning();
    return newLabReport;
  }

  async getLabReportsByPatientId(patientId: number): Promise<LabReport[]> {
    return db
      .select()
      .from(labReports)
      .where(eq(labReports.patientId, patientId))
      .orderBy(desc(labReports.reportDate));
  }

  async getLabReportsByLabId(labId: number): Promise<LabReport[]> {
    return db
      .select()
      .from(labReports)
      .where(eq(labReports.labId, labId))
      .orderBy(desc(labReports.reportDate));
  }

  async updateLabReportStatus(id: number, status: string): Promise<LabReport> {
    const [updated] = await db
      .update(labReports)
      .set({ status })
      .where(eq(labReports.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
