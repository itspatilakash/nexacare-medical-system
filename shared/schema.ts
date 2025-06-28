import { pgTable, text, serial, integer, boolean, timestamp, decimal, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - central auth table for all roles
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  mobileNumber: text("mobile_number").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull(), // 'hospital', 'doctor', 'patient', 'lab', 'receptionist'
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Hospitals table
export const hospitals = pgTable("hospitals", {
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
  departments: text("departments"), // JSON array as text
  services: text("services"), // JSON array as text
  operatingHours: text("operating_hours"), // JSON object as text
  emergencyServices: boolean("emergency_services").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Doctors table
export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  hospitalId: integer("hospital_id").references(() => hospitals.id),
  specialty: text("specialty").notNull(),
  licenseNumber: text("license_number").notNull(),
  qualification: text("qualification").notNull(),
  experience: integer("experience"), // years
  consultationFee: decimal("consultation_fee", { precision: 10, scale: 2 }),
  workingHours: text("working_hours"), // JSON object as text
  availableSlots: text("available_slots"), // JSON array as text
  status: text("status").default('in'), // 'in', 'out', 'break', 'busy'
  languages: text("languages"), // JSON array as text
  awards: text("awards"), // JSON array as text
  bio: text("bio"),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Patients table
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  gender: text("gender"),
  bloodGroup: text("blood_group"),
  height: decimal("height", { precision: 5, scale: 2 }), // in cm
  weight: decimal("weight", { precision: 5, scale: 2 }), // in kg
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  emergencyContact: text("emergency_contact"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyRelation: text("emergency_relation"),
  medicalHistory: text("medical_history"),
  allergies: text("allergies"),
  currentMedications: text("current_medications"), // JSON array as text
  chronicConditions: text("chronic_conditions"), // JSON array as text
  insuranceProvider: text("insurance_provider"),
  insuranceNumber: text("insurance_number"),
  occupation: text("occupation"),
  maritalStatus: text("marital_status"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Labs table
export const labs = pgTable("labs", {
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
  operatingHours: text("operating_hours"), // JSON object as text
  specializations: text("specializations"), // JSON array as text
  testCategories: text("test_categories"), // JSON array as text
  equipment: text("equipment"), // JSON array as text
  accreditation: text("accreditation"), // JSON array as text
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Receptionists table
export const receptionists = pgTable("receptionists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  hospitalId: integer("hospital_id").references(() => hospitals.id).notNull(),
  employeeId: text("employee_id"),
  department: text("department"),
  shift: text("shift"), // 'morning', 'evening', 'night'
  workingHours: text("working_hours"), // JSON object as text
  permissions: text("permissions"), // JSON array as text
  dateOfJoining: timestamp("date_of_joining"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Appointments table
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  doctorId: integer("doctor_id").references(() => doctors.id).notNull(),
  hospitalId: integer("hospital_id").references(() => hospitals.id).notNull(),
  receptionistId: integer("receptionist_id").references(() => receptionists.id),
  appointmentDate: timestamp("appointment_date").notNull(),
  appointmentTime: text("appointment_time").notNull(),
  timeSlot: text("time_slot").notNull(), // e.g., "10:00-10:30"
  reason: text("reason").notNull(),
  status: text("status").default('pending'), // 'pending', 'confirmed', 'completed', 'cancelled', 'no-show'
  type: text("type").default('online'), // 'online', 'walk-in'
  priority: text("priority").default('normal'), // 'emergency', 'urgent', 'normal'
  symptoms: text("symptoms"),
  notes: text("notes"),
  confirmedAt: timestamp("confirmed_at"),
  completedAt: timestamp("completed_at"),
  createdBy: integer("created_by").references(() => users.id), // receptionist or patient
  createdAt: timestamp("created_at").defaultNow(),
});

// Prescriptions table
export const prescriptions = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id").references(() => appointments.id),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  doctorId: integer("doctor_id").references(() => doctors.id).notNull(),
  diagnosis: text("diagnosis").notNull(),
  medications: text("medications").notNull(), // JSON array as text
  instructions: text("instructions"),
  followUpDate: timestamp("follow_up_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Lab Reports table
export const labReports = pgTable("lab_reports", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  doctorId: integer("doctor_id").references(() => doctors.id),
  labId: integer("lab_id").references(() => labs.id).notNull(),
  testName: text("test_name").notNull(),
  testType: text("test_type").notNull(),
  results: text("results").notNull(), // JSON as text
  normalRanges: text("normal_ranges"), // JSON as text
  reportDate: timestamp("report_date").notNull(),
  reportUrl: text("report_url"), // for file uploads
  status: text("status").default('pending'), // 'pending', 'completed', 'reviewed'
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// OTP table for registration
export const otpVerifications = pgTable("otp_verifications", {
  id: serial("id").primaryKey(),
  mobileNumber: text("mobile_number").notNull(),
  otp: text("otp").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isUsed: boolean("is_used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'appointment_confirmed', 'appointment_cancelled', 'prescription_ready', etc.
  title: text("title").notNull(),
  message: text("message").notNull(),
  relatedId: integer("related_id"), // appointment_id, prescription_id, etc.
  relatedType: text("related_type"), // 'appointment', 'prescription', etc.
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  hospital: one(hospitals, { fields: [users.id], references: [hospitals.userId] }),
  doctor: one(doctors, { fields: [users.id], references: [doctors.userId] }),
  patient: one(patients, { fields: [users.id], references: [patients.userId] }),
  lab: one(labs, { fields: [users.id], references: [labs.userId] }),
  receptionist: one(receptionists, { fields: [users.id], references: [receptionists.userId] }),
  notifications: many(notifications),
}));

export const hospitalsRelations = relations(hospitals, ({ one, many }) => ({
  user: one(users, { fields: [hospitals.userId], references: [users.id] }),
  doctors: many(doctors),
  receptionists: many(receptionists),
  appointments: many(appointments),
}));

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  user: one(users, { fields: [doctors.userId], references: [users.id] }),
  hospital: one(hospitals, { fields: [doctors.hospitalId], references: [hospitals.id] }),
  appointments: many(appointments),
  prescriptions: many(prescriptions),
  labReports: many(labReports),
}));

export const patientsRelations = relations(patients, ({ one, many }) => ({
  user: one(users, { fields: [patients.userId], references: [users.id] }),
  appointments: many(appointments),
  prescriptions: many(prescriptions),
  labReports: many(labReports),
}));

export const labsRelations = relations(labs, ({ one, many }) => ({
  user: one(users, { fields: [labs.userId], references: [users.id] }),
  hospital: one(hospitals, { fields: [labs.hospitalId], references: [hospitals.id] }),
  labReports: many(labReports),
}));

export const receptionistsRelations = relations(receptionists, ({ one }) => ({
  user: one(users, { fields: [receptionists.userId], references: [users.id] }),
  hospital: one(hospitals, { fields: [receptionists.hospitalId], references: [hospitals.id] }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(patients, { fields: [appointments.patientId], references: [patients.id] }),
  doctor: one(doctors, { fields: [appointments.doctorId], references: [doctors.id] }),
  hospital: one(hospitals, { fields: [appointments.hospitalId], references: [hospitals.id] }),
  receptionist: one(receptionists, { fields: [appointments.receptionistId], references: [receptionists.id] }),
  prescription: one(prescriptions, { fields: [appointments.id], references: [prescriptions.appointmentId] }),
}));

export const prescriptionsRelations = relations(prescriptions, ({ one }) => ({
  appointment: one(appointments, { fields: [prescriptions.appointmentId], references: [appointments.id] }),
  patient: one(patients, { fields: [prescriptions.patientId], references: [patients.id] }),
  doctor: one(doctors, { fields: [prescriptions.doctorId], references: [doctors.id] }),
}));

export const labReportsRelations = relations(labReports, ({ one }) => ({
  patient: one(patients, { fields: [labReports.patientId], references: [patients.id] }),
  doctor: one(doctors, { fields: [labReports.doctorId], references: [doctors.id] }),
  lab: one(labs, { fields: [labReports.labId], references: [labs.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertHospitalSchema = createInsertSchema(hospitals).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertLabSchema = createInsertSchema(labs).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertReceptionistSchema = createInsertSchema(receptionists).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

export const insertPrescriptionSchema = createInsertSchema(prescriptions).omit({
  id: true,
  createdAt: true,
});

export const insertLabReportSchema = createInsertSchema(labReports).omit({
  id: true,
  createdAt: true,
});

export const insertOtpSchema = createInsertSchema(otpVerifications).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

// Registration schema with role
export const registrationSchema = z.object({
  mobileNumber: z.string().min(10).max(15),
  fullName: z.string().min(2),
  role: z.enum(['hospital', 'doctor', 'patient', 'lab']),
});

// Login schema
export const loginSchema = z.object({
  mobileNumber: z.string().min(10).max(15),
  password: z.string().min(6),
});

// OTP verification schema
export const otpVerificationSchema = z.object({
  mobileNumber: z.string().min(10).max(15),
  otp: z.string().length(6),
  password: z.string().min(6),
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertHospital = z.infer<typeof insertHospitalSchema>;
export type Hospital = typeof hospitals.$inferSelect;
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type Doctor = typeof doctors.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;
export type InsertLab = z.infer<typeof insertLabSchema>;
export type Lab = typeof labs.$inferSelect;
export type InsertReceptionist = z.infer<typeof insertReceptionistSchema>;
export type Receptionist = typeof receptionists.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertPrescription = z.infer<typeof insertPrescriptionSchema>;
export type Prescription = typeof prescriptions.$inferSelect;
export type InsertLabReport = z.infer<typeof insertLabReportSchema>;
export type LabReport = typeof labReports.$inferSelect;
export type InsertOtp = z.infer<typeof insertOtpSchema>;
export type OtpVerification = typeof otpVerifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
