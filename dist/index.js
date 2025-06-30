var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import bcrypt2 from "bcrypt";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  appointments: () => appointments,
  appointmentsRelations: () => appointmentsRelations,
  doctors: () => doctors,
  doctorsRelations: () => doctorsRelations,
  hospitals: () => hospitals,
  hospitalsRelations: () => hospitalsRelations,
  insertAppointmentSchema: () => insertAppointmentSchema,
  insertDoctorSchema: () => insertDoctorSchema,
  insertHospitalSchema: () => insertHospitalSchema,
  insertLabReportSchema: () => insertLabReportSchema,
  insertLabSchema: () => insertLabSchema,
  insertNotificationSchema: () => insertNotificationSchema,
  insertOtpSchema: () => insertOtpSchema,
  insertPatientSchema: () => insertPatientSchema,
  insertPrescriptionSchema: () => insertPrescriptionSchema,
  insertReceptionistSchema: () => insertReceptionistSchema,
  insertUserSchema: () => insertUserSchema,
  labReports: () => labReports,
  labReportsRelations: () => labReportsRelations,
  labs: () => labs,
  labsRelations: () => labsRelations,
  loginSchema: () => loginSchema,
  notifications: () => notifications,
  notificationsRelations: () => notificationsRelations,
  otpVerificationSchema: () => otpVerificationSchema,
  otpVerifications: () => otpVerifications,
  patients: () => patients,
  patientsRelations: () => patientsRelations,
  prescriptions: () => prescriptions,
  prescriptionsRelations: () => prescriptionsRelations,
  receptionists: () => receptionists,
  receptionistsRelations: () => receptionistsRelations,
  registrationSchema: () => registrationSchema,
  users: () => users,
  usersRelations: () => usersRelations
});
import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  mobileNumber: text("mobile_number").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull(),
  // 'hospital', 'doctor', 'patient', 'lab', 'receptionist'
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var hospitals = pgTable("hospitals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  licenseNumber: text("license_number").notNull(),
  contactEmail: text("contact_email"),
  website: text("website"),
  establishedYear: integer("established_year"),
  totalBeds: integer("total_beds"),
  departments: text("departments"),
  // JSON array as text
  services: text("services"),
  // JSON array as text
  operatingHours: text("operating_hours"),
  // JSON object as text
  emergencyServices: boolean("emergency_services").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  hospitalId: integer("hospital_id").references(() => hospitals.id),
  specialty: text("specialty").notNull(),
  licenseNumber: text("license_number").notNull(),
  qualification: text("qualification").notNull(),
  experience: integer("experience"),
  // years
  consultationFee: decimal("consultation_fee", { precision: 10, scale: 2 }),
  workingHours: text("working_hours"),
  // JSON object as text
  availableSlots: text("available_slots"),
  // JSON array as text
  status: text("status").default("in"),
  // 'in', 'out', 'break', 'busy'
  languages: text("languages"),
  // JSON array as text
  awards: text("awards"),
  // JSON array as text
  bio: text("bio"),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  gender: text("gender"),
  bloodGroup: text("blood_group"),
  height: decimal("height", { precision: 5, scale: 2 }),
  // in cm
  weight: decimal("weight", { precision: 5, scale: 2 }),
  // in kg
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  emergencyContact: text("emergency_contact"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyRelation: text("emergency_relation"),
  medicalHistory: text("medical_history"),
  allergies: text("allergies"),
  currentMedications: text("current_medications"),
  // JSON array as text
  chronicConditions: text("chronic_conditions"),
  // JSON array as text
  insuranceProvider: text("insurance_provider"),
  insuranceNumber: text("insurance_number"),
  occupation: text("occupation"),
  maritalStatus: text("marital_status"),
  createdAt: timestamp("created_at").defaultNow()
});
var labs = pgTable("labs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  hospitalId: integer("hospital_id").references(() => hospitals.id),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  licenseNumber: text("license_number").notNull(),
  contactEmail: text("contact_email"),
  operatingHours: text("operating_hours"),
  // JSON object as text
  specializations: text("specializations"),
  // JSON array as text
  testCategories: text("test_categories"),
  // JSON array as text
  equipment: text("equipment"),
  // JSON array as text
  accreditation: text("accreditation"),
  // JSON array as text
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var receptionists = pgTable("receptionists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  hospitalId: integer("hospital_id").references(() => hospitals.id).notNull(),
  employeeId: text("employee_id"),
  department: text("department"),
  shift: text("shift"),
  // 'morning', 'evening', 'night'
  workingHours: text("working_hours"),
  // JSON object as text
  permissions: text("permissions"),
  // JSON array as text
  dateOfJoining: timestamp("date_of_joining"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  doctorId: integer("doctor_id").references(() => doctors.id).notNull(),
  hospitalId: integer("hospital_id").references(() => hospitals.id).notNull(),
  receptionistId: integer("receptionist_id").references(() => receptionists.id),
  appointmentDate: timestamp("appointment_date").notNull(),
  appointmentTime: text("appointment_time").notNull(),
  timeSlot: text("time_slot").notNull(),
  // e.g., "10:00-10:30"
  reason: text("reason").notNull(),
  status: text("status").default("pending"),
  // 'pending', 'confirmed', 'completed', 'cancelled', 'no-show'
  type: text("type").default("online"),
  // 'online', 'walk-in'
  priority: text("priority").default("normal"),
  // 'emergency', 'urgent', 'normal'
  symptoms: text("symptoms"),
  notes: text("notes"),
  confirmedAt: timestamp("confirmed_at"),
  completedAt: timestamp("completed_at"),
  createdBy: integer("created_by").references(() => users.id),
  // receptionist or patient
  createdAt: timestamp("created_at").defaultNow()
});
var prescriptions = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  doctorId: integer("doctor_id").references(() => doctors.id).notNull(),
  diagnosis: text("diagnosis").notNull(),
  medications: text("medications").notNull(),
  // JSON array as text
  instructions: text("instructions"),
  followUpDate: timestamp("follow_up_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var labReports = pgTable("lab_reports", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  doctorId: integer("doctor_id").references(() => doctors.id),
  labId: integer("lab_id").references(() => labs.id).notNull(),
  testName: text("test_name").notNull(),
  testType: text("test_type").notNull(),
  results: text("results").notNull(),
  // JSON as text
  normalRanges: text("normal_ranges"),
  // JSON as text
  reportDate: timestamp("report_date").notNull(),
  reportUrl: text("report_url"),
  // for file uploads
  status: text("status").default("pending"),
  // 'pending', 'completed', 'reviewed'
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});
var otpVerifications = pgTable("otp_verifications", {
  id: serial("id").primaryKey(),
  mobileNumber: text("mobile_number").notNull(),
  otp: text("otp").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isUsed: boolean("is_used").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(),
  // 'appointment_confirmed', 'appointment_cancelled', 'prescription_ready', etc.
  title: text("title").notNull(),
  message: text("message").notNull(),
  relatedId: integer("related_id"),
  // appointment_id, prescription_id, etc.
  relatedType: text("related_type"),
  // 'appointment', 'prescription', etc.
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var usersRelations = relations(users, ({ one, many }) => ({
  hospital: one(hospitals, { fields: [users.id], references: [hospitals.userId] }),
  doctor: one(doctors, { fields: [users.id], references: [doctors.userId] }),
  patient: one(patients, { fields: [users.id], references: [patients.userId] }),
  lab: one(labs, { fields: [users.id], references: [labs.userId] }),
  receptionist: one(receptionists, { fields: [users.id], references: [receptionists.userId] }),
  notifications: many(notifications)
}));
var hospitalsRelations = relations(hospitals, ({ one, many }) => ({
  user: one(users, { fields: [hospitals.userId], references: [users.id] }),
  doctors: many(doctors),
  receptionists: many(receptionists),
  appointments: many(appointments)
}));
var doctorsRelations = relations(doctors, ({ one, many }) => ({
  user: one(users, { fields: [doctors.userId], references: [users.id] }),
  hospital: one(hospitals, { fields: [doctors.hospitalId], references: [hospitals.id] }),
  appointments: many(appointments),
  prescriptions: many(prescriptions),
  labReports: many(labReports)
}));
var patientsRelations = relations(patients, ({ one, many }) => ({
  user: one(users, { fields: [patients.userId], references: [users.id] }),
  appointments: many(appointments),
  prescriptions: many(prescriptions),
  labReports: many(labReports)
}));
var labsRelations = relations(labs, ({ one, many }) => ({
  user: one(users, { fields: [labs.userId], references: [users.id] }),
  hospital: one(hospitals, { fields: [labs.hospitalId], references: [hospitals.id] }),
  labReports: many(labReports)
}));
var receptionistsRelations = relations(receptionists, ({ one }) => ({
  user: one(users, { fields: [receptionists.userId], references: [users.id] }),
  hospital: one(hospitals, { fields: [receptionists.hospitalId], references: [hospitals.id] })
}));
var appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(patients, { fields: [appointments.patientId], references: [patients.id] }),
  doctor: one(doctors, { fields: [appointments.doctorId], references: [doctors.id] }),
  hospital: one(hospitals, { fields: [appointments.hospitalId], references: [hospitals.id] }),
  receptionist: one(receptionists, { fields: [appointments.receptionistId], references: [receptionists.id] }),
  prescription: one(prescriptions, { fields: [appointments.id], references: [prescriptions.appointmentId] })
}));
var prescriptionsRelations = relations(prescriptions, ({ one }) => ({
  appointment: one(appointments, { fields: [prescriptions.appointmentId], references: [appointments.id] }),
  patient: one(patients, { fields: [prescriptions.patientId], references: [patients.id] }),
  doctor: one(doctors, { fields: [prescriptions.doctorId], references: [doctors.id] })
}));
var labReportsRelations = relations(labReports, ({ one }) => ({
  patient: one(patients, { fields: [labReports.patientId], references: [patients.id] }),
  doctor: one(doctors, { fields: [labReports.doctorId], references: [doctors.id] }),
  lab: one(labs, { fields: [labReports.labId], references: [labs.id] })
}));
var notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] })
}));
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertHospitalSchema = createInsertSchema(hospitals).omit({
  id: true,
  userId: true,
  createdAt: true
});
var insertDoctorSchema = createInsertSchema(doctors).omit({
  id: true,
  userId: true,
  createdAt: true
});
var insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  userId: true,
  createdAt: true
});
var insertLabSchema = createInsertSchema(labs).omit({
  id: true,
  userId: true,
  createdAt: true
});
var insertReceptionistSchema = createInsertSchema(receptionists).omit({
  id: true,
  userId: true,
  createdAt: true
});
var insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true
});
var insertPrescriptionSchema = createInsertSchema(prescriptions).omit({
  id: true,
  createdAt: true
});
var insertLabReportSchema = createInsertSchema(labReports).omit({
  id: true,
  createdAt: true
});
var insertOtpSchema = createInsertSchema(otpVerifications).omit({
  id: true,
  createdAt: true
});
var insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true
});
var registrationSchema = z.object({
  mobileNumber: z.string().min(10).max(15),
  fullName: z.string().min(2),
  role: z.enum(["hospital", "doctor", "patient", "lab"])
});
var loginSchema = z.object({
  mobileNumber: z.string().min(10).max(15),
  password: z.string().min(6)
});
var otpVerificationSchema = z.object({
  mobileNumber: z.string().min(10).max(15),
  otp: z.string().length(6),
  password: z.string().min(6)
});

// server/middleware/auth.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
}
function generateToken(user) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "24h" });
}

// scripts/seed-data.ts
import bcrypt from "bcrypt";

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and, gte, desc, asc } from "drizzle-orm";
var DatabaseStorage = class {
  // User management
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByMobileNumber(mobileNumber) {
    const [user] = await db.select().from(users).where(eq(users.mobileNumber, mobileNumber));
    return user || void 0;
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
    const now = /* @__PURE__ */ new Date();
    const [otpRecord] = await db.select().from(otpVerifications).where(
      and(
        eq(otpVerifications.mobileNumber, mobileNumber),
        eq(otpVerifications.otp, otp),
        eq(otpVerifications.isUsed, false),
        gte(otpVerifications.expiresAt, now)
      )
    );
    return otpRecord || void 0;
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
    return hospital || void 0;
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
    return doctor || void 0;
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
    return patient || void 0;
  }
  async getPatientsByHospitalId(hospitalId) {
    return db.select({
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
      createdAt: patients.createdAt
    }).from(patients).innerJoin(appointments, eq(patients.id, appointments.patientId)).where(eq(appointments.hospitalId, hospitalId));
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
    return lab || void 0;
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
    return receptionist || void 0;
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
    return db.select().from(appointments).where(eq(appointments.patientId, patientId)).orderBy(desc(appointments.appointmentDate));
  }
  async getAppointmentsByDoctorId(doctorId) {
    return db.select().from(appointments).where(eq(appointments.doctorId, doctorId)).orderBy(desc(appointments.appointmentDate));
  }
  async getAppointmentsByHospitalId(hospitalId) {
    return db.select().from(appointments).where(eq(appointments.hospitalId, hospitalId)).orderBy(desc(appointments.appointmentDate));
  }
  async getTodaysAppointments(doctorId) {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return db.select().from(appointments).where(
      and(
        eq(appointments.doctorId, doctorId),
        gte(appointments.appointmentDate, today),
        gte(tomorrow, appointments.appointmentDate)
      )
    ).orderBy(asc(appointments.appointmentTime));
  }
  async updateAppointmentStatus(id, status) {
    const [updated] = await db.update(appointments).set({ status }).where(eq(appointments.id, id)).returning();
    return updated;
  }
  // Prescription management
  async createPrescription(prescription) {
    const [newPrescription] = await db.insert(prescriptions).values(prescription).returning();
    return newPrescription;
  }
  async getPrescriptionsByPatientId(patientId) {
    return db.select().from(prescriptions).where(eq(prescriptions.patientId, patientId)).orderBy(desc(prescriptions.createdAt));
  }
  async getPrescriptionsByDoctorId(doctorId) {
    return db.select().from(prescriptions).where(eq(prescriptions.doctorId, doctorId)).orderBy(desc(prescriptions.createdAt));
  }
  // Lab report management
  async createLabReport(labReport) {
    const [newLabReport] = await db.insert(labReports).values(labReport).returning();
    return newLabReport;
  }
  async getLabReportsByPatientId(patientId) {
    return db.select().from(labReports).where(eq(labReports.patientId, patientId)).orderBy(desc(labReports.reportDate));
  }
  async getLabReportsByLabId(labId) {
    return db.select().from(labReports).where(eq(labReports.labId, labId)).orderBy(desc(labReports.reportDate));
  }
  async updateLabReportStatus(id, status) {
    const [updated] = await db.update(labReports).set({ status }).where(eq(labReports.id, id)).returning();
    return updated;
  }
};
var storage = new DatabaseStorage();

// scripts/seed-data.ts
var hospitalNames = [
  "Apollo Medical Center",
  "Sunrise General Hospital",
  "Metro Healthcare",
  "Central City Medical"
];
var doctorNames = [
  "Dr. Rajesh Kumar",
  "Dr. Priya Sharma",
  "Dr. Amit Patel",
  "Dr. Sneha Gupta",
  "Dr. Ravi Singh",
  "Dr. Meera Nair",
  "Dr. Vikram Joshi",
  "Dr. Anita Verma",
  "Dr. Suresh Reddy",
  "Dr. Kavitha Rao",
  "Dr. Deepak Shah",
  "Dr. Pooja Mehta",
  "Dr. Arun Pillai",
  "Dr. Lakshmi Iyer",
  "Dr. Rohit Malhotra",
  "Dr. Divya Krishnan"
];
var patientNames = [
  "Arjun Nair",
  "Kavya Pillai",
  "Rohan Gupta",
  "Shreya Patel",
  "Aditya Sharma",
  "Ritika Singh",
  "Karan Mehta",
  "Nisha Verma",
  "Varun Reddy",
  "Priya Joshi"
];
var receptionistNames = [
  "Sunita Kumar",
  "Rashmi Patel",
  "Neha Singh",
  "Pooja Sharma"
];
var labNames = [
  "PathLab Diagnostics",
  "MediCore Labs",
  "HealthCheck Labs",
  "DiagnoTech",
  "ClinLab Services",
  "BioTest Labs",
  "MediScan Labs",
  "LabCare Plus"
];
var specialties = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "Oncology",
  "Psychiatry",
  "ENT"
];
var departments = [
  "Emergency",
  "ICU",
  "Surgery",
  "Pediatrics",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Radiology",
  "Laboratory"
];
var cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad"];
var states = ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Telangana"];
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}
function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
function generateMobileNumber() {
  return "98" + Math.floor(1e7 + Math.random() * 9e7).toString();
}
function generateLicenseNumber(prefix) {
  return prefix + Math.floor(1e5 + Math.random() * 9e5).toString();
}
function generateTimeSlots() {
  const slots = [];
  for (let hour = 10; hour < 20; hour++) {
    if (hour === 13) continue;
    slots.push(`${hour.toString().padStart(2, "0")}:00-${hour.toString().padStart(2, "0")}:30`);
    if (hour !== 19) {
      slots.push(`${hour.toString().padStart(2, "0")}:30-${(hour + 1).toString().padStart(2, "0")}:00`);
    }
  }
  return slots;
}
function generateWorkingHours() {
  return {
    monday: { start: "10:00", end: "20:00", lunchBreak: { start: "13:00", end: "14:00" } },
    tuesday: { start: "10:00", end: "20:00", lunchBreak: { start: "13:00", end: "14:00" } },
    wednesday: { start: "10:00", end: "20:00", lunchBreak: { start: "13:00", end: "14:00" } },
    thursday: { start: "10:00", end: "20:00", lunchBreak: { start: "13:00", end: "14:00" } },
    friday: { start: "10:00", end: "20:00", lunchBreak: { start: "13:00", end: "14:00" } },
    saturday: { start: "10:00", end: "18:00", lunchBreak: { start: "13:00", end: "14:00" } },
    sunday: { start: "10:00", end: "16:00", lunchBreak: null }
  };
}
async function seedDummyData() {
  console.log("Starting data seeding...");
  try {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const availableSlots = generateTimeSlots();
    const workingHours = generateWorkingHours();
    const hospitals2 = [];
    for (let i = 0; i < 4; i++) {
      const hospitalUser = await storage.createUser({
        mobileNumber: generateMobileNumber(),
        password: hashedPassword,
        fullName: hospitalNames[i],
        role: "hospital",
        isVerified: true
      });
      const hospital = await storage.createHospital({
        userId: hospitalUser.id,
        name: hospitalNames[i],
        address: `${Math.floor(Math.random() * 999) + 1}, Medical Street`,
        city: getRandomItem(cities),
        state: getRandomItem(states),
        zipCode: (11e4 + Math.floor(Math.random() * 9e4)).toString(),
        licenseNumber: generateLicenseNumber("HOS"),
        contactEmail: `contact@${hospitalNames[i].toLowerCase().replace(/\s+/g, "")}.com`,
        website: `www.${hospitalNames[i].toLowerCase().replace(/\s+/g, "")}.com`,
        establishedYear: 1990 + Math.floor(Math.random() * 30),
        totalBeds: 100 + Math.floor(Math.random() * 400),
        departments: JSON.stringify(getRandomItems(departments, 6)),
        services: JSON.stringify([
          "Emergency Care",
          "Surgery",
          "Diagnostics",
          "Pharmacy",
          "Ambulance",
          "Blood Bank",
          "Radiology",
          "Laboratory"
        ]),
        operatingHours: JSON.stringify({
          "24x7": true,
          emergency: "Always Open",
          opd: "10:00 AM - 8:00 PM"
        }),
        emergencyServices: true,
        isActive: true
      });
      hospitals2.push(hospital);
      console.log(`Created hospital: ${hospital.name}`);
    }
    const doctors2 = [];
    for (let hospitalIndex = 0; hospitalIndex < hospitals2.length; hospitalIndex++) {
      const hospital = hospitals2[hospitalIndex];
      for (let j = 0; j < 4; j++) {
        const doctorIndex = hospitalIndex * 4 + j;
        const doctorUser = await storage.createUser({
          mobileNumber: generateMobileNumber(),
          password: hashedPassword,
          fullName: doctorNames[doctorIndex],
          role: "doctor",
          isVerified: true
        });
        const doctor = await storage.createDoctor({
          userId: doctorUser.id,
          hospitalId: hospital.id,
          specialty: getRandomItem(specialties),
          licenseNumber: generateLicenseNumber("DOC"),
          qualification: `MBBS, MD (${getRandomItem(specialties)})`,
          experience: 5 + Math.floor(Math.random() * 20),
          consultationFee: (500 + Math.floor(Math.random() * 1500)).toString(),
          workingHours: JSON.stringify(workingHours),
          availableSlots: JSON.stringify(availableSlots),
          status: getRandomItem(["in", "out"]),
          languages: JSON.stringify(["English", "Hindi", getRandomItem(["Tamil", "Telugu", "Kannada", "Marathi"])]),
          awards: JSON.stringify([
            "Best Doctor Award 2020",
            "Excellence in Medical Service 2021",
            "Outstanding Healthcare Professional 2022"
          ]),
          bio: `Experienced ${getRandomItem(specialties)} specialist with over ${5 + Math.floor(Math.random() * 20)} years of practice. Committed to providing excellent patient care.`,
          isAvailable: true
        });
        doctors2.push(doctor);
        console.log(`Created doctor: ${doctorNames[doctorIndex]} at ${hospital.name}`);
      }
    }
    const patients2 = [];
    for (let i = 0; i < 10; i++) {
      const patientUser = await storage.createUser({
        mobileNumber: generateMobileNumber(),
        password: hashedPassword,
        fullName: patientNames[i],
        role: "patient",
        isVerified: true
      });
      const birthYear = 1950 + Math.floor(Math.random() * 50);
      const patient = await storage.createPatient({
        userId: patientUser.id,
        dateOfBirth: /* @__PURE__ */ new Date(`${birthYear}-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`),
        gender: getRandomItem(["Male", "Female"]),
        bloodGroup: getRandomItem(["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"]),
        height: (150 + Math.floor(Math.random() * 40)).toString(),
        weight: (50 + Math.floor(Math.random() * 50)).toString(),
        address: `${Math.floor(Math.random() * 999) + 1}, Residential Colony`,
        city: getRandomItem(cities),
        state: getRandomItem(states),
        zipCode: (11e4 + Math.floor(Math.random() * 9e4)).toString(),
        emergencyContact: generateMobileNumber(),
        emergencyContactName: `Emergency Contact ${i + 1}`,
        emergencyRelation: getRandomItem(["Spouse", "Parent", "Sibling", "Child"]),
        medicalHistory: getRandomItem([
          "No significant medical history",
          "Hypertension, managed with medication",
          "Diabetes Type 2, controlled",
          "Previous surgery - Appendectomy",
          "Allergic rhinitis"
        ]),
        allergies: getRandomItem([
          "No known allergies",
          "Penicillin allergy",
          "Dust allergy",
          "Food allergies - nuts",
          "Seasonal allergies"
        ]),
        currentMedications: JSON.stringify(getRandomItem([
          [],
          ["Metformin 500mg"],
          ["Lisinopril 10mg", "Aspirin 75mg"],
          ["Levothyroxine 50mcg"]
        ])),
        chronicConditions: JSON.stringify(getRandomItem([
          [],
          ["Hypertension"],
          ["Diabetes"],
          ["Hypothyroidism"],
          ["Asthma"]
        ])),
        insuranceProvider: getRandomItem(["Star Health", "HDFC ERGO", "Bajaj Allianz", "Max Bupa", "None"]),
        insuranceNumber: `INS${Math.floor(1e8 + Math.random() * 9e8)}`,
        occupation: getRandomItem(["Software Engineer", "Teacher", "Business", "Government Employee", "Student", "Retired"]),
        maritalStatus: getRandomItem(["Single", "Married", "Divorced", "Widowed"])
      });
      patients2.push(patient);
      console.log(`Created patient: ${patientNames[i]}`);
    }
    const receptionists2 = [];
    for (let i = 0; i < hospitals2.length; i++) {
      const receptionistUser = await storage.createUser({
        mobileNumber: generateMobileNumber(),
        password: hashedPassword,
        fullName: receptionistNames[i],
        role: "receptionist",
        isVerified: true
      });
      const receptionist = await storage.createReceptionist({
        userId: receptionistUser.id,
        hospitalId: hospitals2[i].id,
        employeeId: `EMP${Math.floor(1e3 + Math.random() * 9e3)}`,
        department: "Reception",
        shift: getRandomItem(["morning", "evening"]),
        workingHours: JSON.stringify({
          monday: { start: "09:00", end: "17:00" },
          tuesday: { start: "09:00", end: "17:00" },
          wednesday: { start: "09:00", end: "17:00" },
          thursday: { start: "09:00", end: "17:00" },
          friday: { start: "09:00", end: "17:00" },
          saturday: { start: "09:00", end: "14:00" },
          sunday: "off"
        }),
        permissions: JSON.stringify([
          "manage_appointments",
          "view_patient_details",
          "confirm_bookings",
          "cancel_appointments",
          "generate_reports"
        ]),
        dateOfJoining: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        isActive: true
      });
      receptionists2.push(receptionist);
      console.log(`Created receptionist: ${receptionistNames[i]} at ${hospitals2[i].name}`);
    }
    const labs2 = [];
    for (let hospitalIndex = 0; hospitalIndex < hospitals2.length; hospitalIndex++) {
      const hospital = hospitals2[hospitalIndex];
      for (let j = 0; j < 2; j++) {
        const labIndex = hospitalIndex * 2 + j;
        const labUser = await storage.createUser({
          mobileNumber: generateMobileNumber(),
          password: hashedPassword,
          fullName: labNames[labIndex],
          role: "lab",
          isVerified: true
        });
        const lab = await storage.createLab({
          userId: labUser.id,
          hospitalId: hospital.id,
          name: labNames[labIndex],
          address: `${Math.floor(Math.random() * 999) + 1}, Lab Complex`,
          city: hospital.city || getRandomItem(cities),
          state: hospital.state || getRandomItem(states),
          zipCode: (11e4 + Math.floor(Math.random() * 9e4)).toString(),
          licenseNumber: generateLicenseNumber("LAB"),
          contactEmail: `info@${labNames[labIndex].toLowerCase().replace(/\s+/g, "")}.com`,
          operatingHours: JSON.stringify({
            weekdays: "08:00 AM - 8:00 PM",
            saturday: "08:00 AM - 6:00 PM",
            sunday: "08:00 AM - 2:00 PM"
          }),
          specializations: JSON.stringify([
            "Clinical Pathology",
            "Blood Tests",
            "Urine Analysis",
            "X-Ray",
            "ECG",
            "Ultrasound"
          ]),
          testCategories: JSON.stringify([
            "Blood Chemistry",
            "Hematology",
            "Immunology",
            "Microbiology",
            "Radiology",
            "Cardiology"
          ]),
          equipment: JSON.stringify([
            "Digital X-Ray Machine",
            "Ultrasound Scanner",
            "ECG Machine",
            "Automated Analyzer",
            "Microscopes"
          ]),
          accreditation: JSON.stringify([
            "NABL Certified",
            "ISO 15189:2012",
            "CAP Accredited"
          ]),
          isActive: true
        });
        labs2.push(lab);
        console.log(`Created lab: ${labNames[labIndex]} for ${hospital.name}`);
      }
    }
    return { hospitals: hospitals2, doctors: doctors2, patients: patients2, receptionists: receptionists2, labs: labs2 };
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  }
}

// server/routes.ts
import { eq as eq2, and as and2 } from "drizzle-orm";
async function registerRoutes(app2) {
  function generateOTP() {
    return Math.floor(1e5 + Math.random() * 9e5).toString();
  }
  async function sendSMS(mobileNumber, message) {
    console.log(`SMS to ${mobileNumber}: ${message}`);
  }
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registrationSchema.parse(req.body);
      const existingUser = await (void 0).getUserByMobileNumber(validatedData.mobileNumber);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this mobile number" });
      }
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1e3);
      await (void 0).createOtp({
        mobileNumber: validatedData.mobileNumber,
        otp,
        expiresAt,
        isUsed: false
      });
      await sendSMS(validatedData.mobileNumber, `Your MedCare verification code is: ${otp}`);
      res.json({
        message: "OTP sent successfully",
        mobileNumber: validatedData.mobileNumber,
        role: validatedData.role
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Invalid registration data" });
    }
  });
  app2.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const validatedData = otpVerificationSchema.parse(req.body);
      const otpRecord = await (void 0).getValidOtp(validatedData.mobileNumber, validatedData.otp);
      if (!otpRecord) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
      const hashedPassword = await bcrypt2.hash(validatedData.password, 10);
      const role = req.body.role || "patient";
      const user = await (void 0).createUser({
        mobileNumber: validatedData.mobileNumber,
        password: hashedPassword,
        fullName: req.body.fullName || "User",
        role,
        isVerified: true
      });
      await (void 0).markOtpAsUsed(otpRecord.id);
      const token = generateToken({
        id: user.id,
        mobileNumber: user.mobileNumber,
        role: user.role,
        fullName: user.fullName
      });
      res.json({
        message: "Registration successful",
        token,
        user: {
          id: user.id,
          mobileNumber: user.mobileNumber,
          fullName: user.fullName,
          role: user.role
        }
      });
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(400).json({ message: "OTP verification failed" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const user = await (void 0).getUserByMobileNumber(validatedData.mobileNumber);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isValidPassword = await bcrypt2.compare(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = generateToken({
        id: user.id,
        mobileNumber: user.mobileNumber,
        role: user.role,
        fullName: user.fullName
      });
      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          mobileNumber: user.mobileNumber,
          fullName: user.fullName,
          role: user.role
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Login failed" });
    }
  });
  app2.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
      const user = await (void 0).getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      let profile = null;
      switch (user.role) {
        case "hospital":
          profile = await (void 0).getHospitalByUserId(user.id);
          break;
        case "doctor":
          profile = await (void 0).getDoctorByUserId(user.id);
          break;
        case "patient":
          profile = await (void 0).getPatientByUserId(user.id);
          break;
        case "lab":
          profile = await (void 0).getLabByUserId(user.id);
          break;
        case "receptionist":
          profile = await (void 0).getReceptionistByUserId(user.id);
          break;
      }
      res.json({
        user: {
          id: user.id,
          mobileNumber: user.mobileNumber,
          fullName: user.fullName,
          role: user.role,
          isVerified: user.isVerified
        },
        profile
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });
  app2.post("/api/hospitals/profile", authenticateToken, authorizeRoles("hospital"), async (req, res) => {
    try {
      const validatedData = insertHospitalSchema.parse(req.body);
      const hospital = await (void 0).createHospital({
        ...validatedData,
        userId: req.user.id
      });
      res.json(hospital);
    } catch (error) {
      console.error("Create hospital profile error:", error);
      res.status(400).json({ message: "Failed to create hospital profile" });
    }
  });
  app2.put("/api/hospitals/profile", authenticateToken, authorizeRoles("hospital"), async (req, res) => {
    try {
      const hospital = await (void 0).getHospitalByUserId(req.user.id);
      if (!hospital) {
        return res.status(404).json({ message: "Hospital profile not found" });
      }
      const validatedData = insertHospitalSchema.partial().parse(req.body);
      const updated = await (void 0).updateHospital(hospital.id, validatedData);
      res.json(updated);
    } catch (error) {
      console.error("Update hospital profile error:", error);
      res.status(400).json({ message: "Failed to update hospital profile" });
    }
  });
  app2.post("/api/doctors/profile", authenticateToken, authorizeRoles("doctor"), async (req, res) => {
    try {
      const validatedData = insertDoctorSchema.parse(req.body);
      const doctor = await (void 0).createDoctor({
        ...validatedData,
        userId: req.user.id
      });
      res.json(doctor);
    } catch (error) {
      console.error("Create doctor profile error:", error);
      res.status(400).json({ message: "Failed to create doctor profile" });
    }
  });
  app2.get("/api/hospitals/:hospitalId/doctors", authenticateToken, async (req, res) => {
    try {
      const hospitalId = parseInt(req.params.hospitalId);
      const doctors2 = await (void 0).getDoctorsByHospitalId(hospitalId);
      res.json(doctors2);
    } catch (error) {
      console.error("Get doctors error:", error);
      res.status(500).json({ message: "Failed to fetch doctors" });
    }
  });
  app2.post("/api/patients/profile", authenticateToken, authorizeRoles("patient"), async (req, res) => {
    try {
      const validatedData = insertPatientSchema.parse(req.body);
      const patient = await (void 0).createPatient({
        ...validatedData,
        userId: req.user.id
      });
      res.json(patient);
    } catch (error) {
      console.error("Create patient profile error:", error);
      res.status(400).json({ message: "Failed to create patient profile" });
    }
  });
  app2.post("/api/appointments", authenticateToken, async (req, res) => {
    try {
      const patient = await (void 0).getPatientByUserId(req.user.id);
      if (!patient) {
        return res.status(404).json({ message: "Patient profile not found" });
      }
      const appointmentData = {
        patientId: patient.id,
        doctorId: parseInt(req.body.doctorId),
        hospitalId: parseInt(req.body.hospitalId),
        appointmentDate: new Date(req.body.appointmentDate),
        appointmentTime: req.body.appointmentTime || req.body.timeSlot,
        timeSlot: req.body.timeSlot || req.body.appointmentTime,
        reason: req.body.reason,
        priority: req.body.priority || "normal",
        symptoms: req.body.symptoms,
        status: "pending",
        type: req.body.type || "online",
        createdBy: req.user.id
      };
      const appointment = await (void 0).createAppointment(appointmentData);
      res.json({
        message: "Appointment request submitted successfully. Awaiting receptionist confirmation.",
        appointment
      });
    } catch (error) {
      console.error("Create appointment error:", error);
      res.status(400).json({ message: "Failed to create appointment" });
    }
  });
  app2.get("/api/appointments/my", authenticateToken, async (req, res) => {
    try {
      let appointments2 = [];
      switch (req.user.role) {
        case "patient":
          const patient = await (void 0).getPatientByUserId(req.user.id);
          if (patient) {
            appointments2 = await (void 0).getAppointmentsByPatientId(patient.id);
          }
          break;
        case "doctor":
          const doctor = await (void 0).getDoctorByUserId(req.user.id);
          if (doctor) {
            appointments2 = await (void 0).getAppointmentsByDoctorId(doctor.id);
          }
          break;
        case "hospital":
        case "receptionist":
          const hospital = await (void 0).getHospitalByUserId(req.user.id);
          if (hospital) {
            appointments2 = await (void 0).getAppointmentsByHospitalId(hospital.id);
          }
          break;
      }
      res.json(appointments2);
    } catch (error) {
      console.error("Get appointments error:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });
  app2.get("/api/appointments/today", authenticateToken, authorizeRoles("doctor"), async (req, res) => {
    try {
      const doctor = await (void 0).getDoctorByUserId(req.user.id);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }
      const appointments2 = await (void 0).getTodaysAppointments(doctor.id);
      res.json(appointments2);
    } catch (error) {
      console.error("Get today's appointments error:", error);
      res.status(500).json({ message: "Failed to fetch today's appointments" });
    }
  });
  app2.post("/api/prescriptions", authenticateToken, authorizeRoles("doctor"), async (req, res) => {
    try {
      const doctor = await (void 0).getDoctorByUserId(req.user.id);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }
      const validatedData = insertPrescriptionSchema.parse(req.body);
      const prescription = await (void 0).createPrescription({
        ...validatedData,
        doctorId: doctor.id
      });
      res.json(prescription);
    } catch (error) {
      console.error("Create prescription error:", error);
      res.status(400).json({ message: "Failed to create prescription" });
    }
  });
  app2.get("/api/prescriptions/my", authenticateToken, async (req, res) => {
    try {
      let prescriptions2 = [];
      switch (req.user.role) {
        case "patient":
          const patient = await (void 0).getPatientByUserId(req.user.id);
          if (patient) {
            prescriptions2 = await (void 0).getPrescriptionsByPatientId(patient.id);
          }
          break;
        case "doctor":
          const doctor = await (void 0).getDoctorByUserId(req.user.id);
          if (doctor) {
            prescriptions2 = await (void 0).getPrescriptionsByDoctorId(doctor.id);
          }
          break;
      }
      res.json(prescriptions2);
    } catch (error) {
      console.error("Get prescriptions error:", error);
      res.status(500).json({ message: "Failed to fetch prescriptions" });
    }
  });
  app2.post("/api/lab-reports", authenticateToken, authorizeRoles("lab"), async (req, res) => {
    try {
      const lab = await (void 0).getLabByUserId(req.user.id);
      if (!lab) {
        return res.status(404).json({ message: "Lab profile not found" });
      }
      const validatedData = insertLabReportSchema.parse(req.body);
      const labReport = await (void 0).createLabReport({
        ...validatedData,
        labId: lab.id
      });
      res.json(labReport);
    } catch (error) {
      console.error("Create lab report error:", error);
      res.status(400).json({ message: "Failed to create lab report" });
    }
  });
  app2.get("/api/lab-reports/my", authenticateToken, async (req, res) => {
    try {
      let labReports2 = [];
      switch (req.user.role) {
        case "patient":
          const patient = await (void 0).getPatientByUserId(req.user.id);
          if (patient) {
            labReports2 = await (void 0).getLabReportsByPatientId(patient.id);
          }
          break;
        case "lab":
          const lab = await (void 0).getLabByUserId(req.user.id);
          if (lab) {
            labReports2 = await (void 0).getLabReportsByLabId(lab.id);
          }
          break;
      }
      res.json(labReports2);
    } catch (error) {
      console.error("Get lab reports error:", error);
      res.status(500).json({ message: "Failed to fetch lab reports" });
    }
  });
  app2.get("/api/hospitals/list", async (req, res) => {
    try {
      const hospitals2 = await db.select({
        id: hospitals.id,
        name: hospitals.name,
        city: hospitals.city,
        state: hospitals.state,
        totalBeds: hospitals.totalBeds,
        emergencyServices: hospitals.emergencyServices
      }).from(hospitals).where(eq2(hospitals.isActive, true));
      res.json(hospitals2);
    } catch (error) {
      console.error("Get hospitals error:", error);
      res.status(500).json({ message: "Failed to fetch hospitals" });
    }
  });
  app2.get("/api/doctors/by-hospital/:hospitalId", async (req, res) => {
    try {
      const hospitalId = parseInt(req.params.hospitalId);
      const doctors2 = await db.select({
        id: doctors.id,
        specialty: doctors.specialty,
        experience: doctors.experience,
        consultationFee: doctors.consultationFee,
        status: doctors.status,
        isAvailable: doctors.isAvailable,
        user: {
          id: users.id,
          fullName: users.fullName
        }
      }).from(doctors).innerJoin(users, eq2(doctors.userId, users.id)).where(and2(
        eq2(doctors.hospitalId, hospitalId),
        eq2(doctors.isAvailable, true)
      ));
      res.json(doctors2);
    } catch (error) {
      console.error("Get doctors by hospital error:", error);
      res.status(500).json({ message: "Failed to fetch doctors" });
    }
  });
  app2.get("/api/doctors/availability/:doctorId/:date", async (req, res) => {
    try {
      const doctorId = parseInt(req.params.doctorId);
      const date = req.params.date;
      const availableSlots = [];
      for (let hour = 10; hour < 20; hour++) {
        if (hour === 13) continue;
        availableSlots.push(`${hour.toString().padStart(2, "0")}:00-${hour.toString().padStart(2, "0")}:30`);
        if (hour !== 19) {
          availableSlots.push(`${hour.toString().padStart(2, "0")}:30-${(hour + 1).toString().padStart(2, "0")}:00`);
        }
      }
      res.json({ availableSlots });
    } catch (error) {
      console.error("Get doctor availability error:", error);
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  });
  app2.get("/api/appointments/pending", authenticateToken, authorizeRoles("receptionist"), async (req, res) => {
    try {
      const receptionist = await (void 0).getReceptionistByUserId(req.user.id);
      if (!receptionist) {
        return res.status(404).json({ message: "Receptionist profile not found" });
      }
      const pendingAppointments = await db.select({
        id: appointments.id,
        appointmentDate: appointments.appointmentDate,
        timeSlot: appointments.timeSlot,
        reason: appointments.reason,
        priority: appointments.priority,
        status: appointments.status,
        patient: {
          id: patients.id,
          user: {
            fullName: users.fullName,
            mobileNumber: users.mobileNumber
          }
        },
        doctor: {
          id: doctors.id,
          specialty: doctors.specialty,
          user: {
            fullName: users.fullName
          }
        }
      }).from(appointments).innerJoin(patients, eq2(appointments.patientId, patients.id)).innerJoin(doctors, eq2(appointments.doctorId, doctors.id)).innerJoin(users, eq2(patients.userId, users.id)).where(and2(
        eq2(appointments.hospitalId, receptionist.hospitalId),
        eq2(appointments.status, "pending")
      )).orderBy(appointments.appointmentDate);
      res.json(pendingAppointments);
    } catch (error) {
      console.error("Get pending appointments error:", error);
      res.status(500).json({ message: "Failed to fetch pending appointments" });
    }
  });
  app2.put("/api/appointments/:id/confirm", authenticateToken, authorizeRoles("receptionist"), async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const receptionist = await (void 0).getReceptionistByUserId(req.user.id);
      if (!receptionist) {
        return res.status(404).json({ message: "Receptionist profile not found" });
      }
      const appointment = await (void 0).updateAppointmentStatus(appointmentId, "confirmed");
      res.json({ message: "Appointment confirmed successfully", appointment });
    } catch (error) {
      console.error("Confirm appointment error:", error);
      res.status(500).json({ message: "Failed to confirm appointment" });
    }
  });
  app2.get("/api/dashboard/stats", authenticateToken, async (req, res) => {
    try {
      const stats = {};
      switch (req.user.role) {
        case "hospital":
          const hospital = await (void 0).getHospitalByUserId(req.user.id);
          if (hospital) {
            const doctors2 = await (void 0).getDoctorsByHospitalId(hospital.id);
            const patients2 = await (void 0).getPatientsByHospitalId(hospital.id);
            const appointments2 = await (void 0).getAppointmentsByHospitalId(hospital.id);
            stats.doctorsCount = doctors2.length;
            stats.patientsCount = patients2.length;
            stats.todayAppointments = appointments2.filter((apt) => {
              const today = (/* @__PURE__ */ new Date()).toDateString();
              return new Date(apt.appointmentDate).toDateString() === today;
            }).length;
            stats.totalAppointments = appointments2.length;
          }
          break;
        case "doctor":
          const doctor = await (void 0).getDoctorByUserId(req.user.id);
          if (doctor) {
            const appointments2 = await (void 0).getAppointmentsByDoctorId(doctor.id);
            const todayAppointments = await (void 0).getTodaysAppointments(doctor.id);
            const prescriptions2 = await (void 0).getPrescriptionsByDoctorId(doctor.id);
            stats.totalAppointments = appointments2.length;
            stats.todayAppointments = todayAppointments.length;
            stats.totalPrescriptions = prescriptions2.length;
            stats.totalPatients = new Set(appointments2.map((apt) => apt.patientId)).size;
          }
          break;
        case "patient":
          const patient = await (void 0).getPatientByUserId(req.user.id);
          if (patient) {
            const appointments2 = await (void 0).getAppointmentsByPatientId(patient.id);
            const prescriptions2 = await (void 0).getPrescriptionsByPatientId(patient.id);
            const labReports2 = await (void 0).getLabReportsByPatientId(patient.id);
            stats.upcomingAppointments = appointments2.filter(
              (apt) => new Date(apt.appointmentDate) > /* @__PURE__ */ new Date() && apt.status === "scheduled"
            ).length;
            stats.activePrescriptions = prescriptions2.filter((p) => p.isActive).length;
            stats.labReports = labReports2.length;
          }
          break;
      }
      res.json(stats);
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });
  const httpServer = createServer(app2);
  app2.post("/api/seed-data", async (req, res) => {
    if (process.env.NODE_ENV !== "development") {
      return res.status(403).json({ message: "Seeding only allowed in development" });
    }
    try {
      console.log("Starting data seeding...");
      const result = await seedDummyData();
      const credentials = [];
      for (const hospital of result.hospitals) {
        const user = await (void 0).getUser(hospital.userId);
        if (user) {
          credentials.push({
            type: "Hospital",
            name: hospital.name,
            mobile: user.mobileNumber,
            password: "password123"
          });
        }
      }
      for (const doctor of result.doctors) {
        const user = await (void 0).getUser(doctor.userId);
        if (user) {
          credentials.push({
            type: "Doctor",
            name: user.fullName,
            mobile: user.mobileNumber,
            password: "password123",
            specialty: doctor.specialty
          });
        }
      }
      for (const patient of result.patients) {
        const user = await (void 0).getUser(patient.userId);
        if (user) {
          credentials.push({
            type: "Patient",
            name: user.fullName,
            mobile: user.mobileNumber,
            password: "password123"
          });
        }
      }
      for (const receptionist of result.receptionists) {
        const user = await (void 0).getUser(receptionist.userId);
        if (user) {
          credentials.push({
            type: "Receptionist",
            name: user.fullName,
            mobile: user.mobileNumber,
            password: "password123"
          });
        }
      }
      for (const lab of result.labs) {
        const user = await (void 0).getUser(lab.userId);
        if (user) {
          credentials.push({
            type: "Lab",
            name: user.fullName,
            mobile: user.mobileNumber,
            password: "password123"
          });
        }
      }
      res.json({
        message: "Dummy data seeded successfully!",
        summary: {
          hospitals: result.hospitals.length,
          doctors: result.doctors.length,
          patients: result.patients.length,
          receptionists: result.receptionists.length,
          labs: result.labs.length
        },
        credentials
      });
    } catch (error) {
      console.error("Seeding error:", error);
      res.status(500).json({ message: "Failed to seed data", error: error.message });
    }
  });
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
