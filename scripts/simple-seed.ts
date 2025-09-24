import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { db } from "../server/db";
import { users, hospitals, doctors, patients, receptionists, labs, appointments, prescriptions, labReports, notifications, otpVerifications } from "../drizzle/schema";

// Load environment variables
dotenv.config();

async function seedBasicData() {
  console.log("Starting basic data seeding...");
  
  try {
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    // Create a test hospital user
    const [hospitalUser] = await db.insert(users).values({
      fullName: "Apollo Medical Center",
      mobileNumber: "9876543210",
      password: hashedPassword,
      role: "hospital",
      isVerified: true,
    }).returning();

    // Create a test doctor user
    const [doctorUser] = await db.insert(users).values({
      fullName: "Dr. Sarah Johnson",
      mobileNumber: "9876543211",
      password: hashedPassword,
      role: "doctor",
      isVerified: true,
    }).returning();

    // Create a test patient user
    const [patientUser] = await db.insert(users).values({
      fullName: "John Smith",
      mobileNumber: "9876543212",
      password: hashedPassword,
      role: "patient",
      isVerified: true,
    }).returning();

    // Create hospital
    const [hospital] = await db.insert(hospitals).values({
      userId: hospitalUser.id,
      name: "Apollo Medical Center",
      address: "123 Medical Street",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      licenseNumber: "HOSP001",
      contactEmail: "admin@apollo.com",
      establishedYear: 1995,
      totalBeds: 200,
      departments: "Cardiology,Neurology,Orthopedics",
      services: "Emergency,ICU,Surgery",
      operatingHours: "24/7",
      emergencyServices: true,
      isActive: true,
      isVerified: true,
    }).returning();

    // Create doctor
    const [doctor] = await db.insert(doctors).values({
      userId: doctorUser.id,
      hospitalId: hospital.id,
      specialty: "Cardiology",
      licenseNumber: "DOC001",
      qualification: "MBBS, MD Cardiology",
      experience: 10,
      consultationFee: "1500.00",
      workingHours: "10:00-18:00",
      availableSlots: "10:00,10:30,11:00,11:30,14:00,14:30,15:00,15:30",
      status: "in",
      languages: "English,Hindi",
      isAvailable: true,
      isVerified: true,
      approvalStatus: "approved",
    }).returning();

    // Create patient
    const [patient] = await db.insert(patients).values({
      userId: patientUser.id,
      dateOfBirth: new Date("1990-05-15"),
      gender: "Male",
      bloodGroup: "O+",
      height: "175.00",
      weight: "70.00",
      address: "456 Patient Avenue",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400002",
      emergencyContact: "9876543213",
      emergencyContactName: "Jane Smith",
      emergencyRelation: "Spouse",
      medicalHistory: "Hypertension",
      allergies: "None",
      currentMedications: "None",
      chronicConditions: "None",
      insuranceProvider: "HealthCare Plus",
      insuranceNumber: "INS001",
      occupation: "Software Engineer",
      maritalStatus: "Married",
    }).returning();

    // Create a test appointment
    const [appointment] = await db.insert(appointments).values({
      patientId: patient.id,
      doctorId: doctor.id,
      hospitalId: hospital.id,
      appointmentDate: new Date("2024-02-15"),
      appointmentTime: "10:00",
      timeSlot: "10:00-10:30",
      reason: "Routine Checkup",
      status: "scheduled",
      type: "online",
      priority: "normal",
      symptoms: "None",
      notes: "Regular health checkup",
    }).returning();

    // Create a test prescription
    const [prescription] = await db.insert(prescriptions).values({
      appointmentId: appointment.id,
      patientId: patient.id,
      doctorId: doctor.id,
      hospitalId: hospital.id,
      diagnosis: "Hypertension (High Blood Pressure)",
      medications: JSON.stringify([
        {
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily",
          duration: "30 days"
        },
        {
          name: "Amlodipine",
          dosage: "5mg",
          frequency: "Once daily",
          duration: "30 days"
        }
      ]),
      instructions: "Take medications in the morning. Monitor blood pressure daily. Reduce salt intake and exercise regularly.",
      followUpDate: new Date("2024-03-15"),
      isActive: true,
    }).returning();

    console.log("✅ Basic data seeded successfully!");
    console.log("📋 Test Accounts:");
    console.log(`🏥 Hospital Admin: ${hospitalUser.mobileNumber} / password123`);
    console.log(`👨‍⚕️ Doctor: ${doctorUser.mobileNumber} / password123`);
    console.log(`👤 Patient: ${patientUser.mobileNumber} / password123`);

  } catch (error) {
    console.error("❌ Error seeding data:", error);
  }
}

seedBasicData(); 