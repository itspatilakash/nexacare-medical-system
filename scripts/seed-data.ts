import bcrypt from "bcrypt";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users, hospitals, doctors, patients, receptionists, labs, appointments, prescriptions, labReports, notifications, otpVerifications } from "../shared/schema";

// Create database connection
const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);
const db = drizzle(sql);

// Dummy data generators
const hospitalNames = [
  "Apollo Medical Center", 
  "Sunrise General Hospital", 
  "Metro Healthcare", 
  "Central City Medical"
];

const doctorNames = [
  "Dr. Rajesh Kumar", "Dr. Priya Sharma", "Dr. Amit Patel", "Dr. Sneha Gupta",
  "Dr. Ravi Singh", "Dr. Meera Nair", "Dr. Vikram Joshi", "Dr. Anita Verma",
  "Dr. Suresh Reddy", "Dr. Kavitha Rao", "Dr. Deepak Shah", "Dr. Pooja Mehta",
  "Dr. Arun Pillai", "Dr. Lakshmi Iyer", "Dr. Rohit Malhotra", "Dr. Divya Krishnan"
];

const patientNames = [
  "Arjun Nair", "Kavya Pillai", "Rohan Gupta", "Shreya Patel", "Aditya Sharma",
  "Ritika Singh", "Karan Mehta", "Nisha Verma", "Varun Reddy", "Priya Joshi"
];

const receptionistNames = [
  "Sunita Kumar", "Rashmi Patel", "Neha Singh", "Pooja Sharma"
];

const labNames = [
  "PathLab Diagnostics", "MediCore Labs", "HealthCheck Labs", "DiagnoTech",
  "ClinLab Services", "BioTest Labs", "MediScan Labs", "LabCare Plus"
];

const specialties = [
  "Cardiology", "Neurology", "Orthopedics", "Pediatrics", 
  "Dermatology", "Oncology", "Psychiatry", "ENT"
];

const departments = [
  "Emergency", "ICU", "Surgery", "Pediatrics", "Cardiology", 
  "Neurology", "Orthopedics", "Radiology", "Laboratory"
];

const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad"];
const states = ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Telangana"];

// Helper functions
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateMobileNumber(): string {
  return '98' + Math.floor(10000000 + Math.random() * 90000000).toString();
}

function generateLicenseNumber(prefix: string): string {
  return prefix + Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate time slots from 10 AM to 8 PM with 30-minute intervals, excluding 1-2 PM lunch
function generateTimeSlots(): string[] {
  const slots = [];
  for (let hour = 10; hour < 20; hour++) {
    if (hour === 13) continue; // Skip 1 PM hour (lunch break)
    
    slots.push(`${hour.toString().padStart(2, '0')}:00-${hour.toString().padStart(2, '0')}:30`);
    if (hour !== 19) { // Don't add 7:30-8:00 PM slot
      slots.push(`${hour.toString().padStart(2, '0')}:30-${(hour + 1).toString().padStart(2, '0')}:00`);
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
    
    // Create demo users first
    const demoUsers = [
      {
        mobileNumber: "9876543210",
        email: "doctor@nexacare.com",
        password: hashedPassword,
        fullName: "Dr. John Smith",
        role: "DOCTOR",
        isVerified: true,
      },
      {
        mobileNumber: "9876543211", 
        email: "patient@nexacare.com",
        password: hashedPassword,
        fullName: "Jane Doe",
        role: "PATIENT",
        isVerified: true,
      },
      {
        mobileNumber: "9876543212",
        email: "hospital@nexacare.com",
        password: hashedPassword,
        fullName: "Hospital Admin",
        role: "HOSPITAL",
        isVerified: true,
      }
    ];

    const createdUsers = [];
    for (const userData of demoUsers) {
      const [user] = await db.insert(users).values(userData).returning();
      createdUsers.push(user);
      console.log(`Created user: ${user.fullName} (${user.role})`);
    }

    // Create 1 hospital
    const [hospital] = await db.insert(hospitals).values({
      userId: createdUsers[2].id, // Hospital admin user
      name: "NexaCare Medical Center",
      address: "123 Medical Street, Healthcare District",
      city: "Mumbai",
      state: "Maharashtra", 
      zipCode: "400001",
        licenseNumber: generateLicenseNumber("HOS"),
      contactEmail: "contact@nexacare.com",
      website: "www.nexacare.com",
      establishedYear: 2010,
      totalBeds: 200,
      departments: JSON.stringify(["Emergency", "ICU", "Surgery", "Pediatrics", "Cardiology"]),
        services: JSON.stringify([
          "Emergency Care", "Surgery", "Diagnostics", "Pharmacy", 
          "Ambulance", "Blood Bank", "Radiology", "Laboratory"
        ]),
        operatingHours: JSON.stringify({
          "24x7": true,
          emergency: "Always Open",
          opd: "10:00 AM - 8:00 PM"
        }),
        emergencyServices: true,
        isActive: true,
    }).returning();
      
      console.log(`Created hospital: ${hospital.name}`);

    // Create 1 doctor
    const [doctor] = await db.insert(doctors).values({
      userId: createdUsers[0].id, // Doctor user
      hospitalId: hospital.id,
      specialty: "General Medicine",
      licenseNumber: generateLicenseNumber("DOC"),
      qualification: "MBBS, MD",
      experience: 10,
      consultationFee: "500.00",
      isAvailable: true,
      workingHours: JSON.stringify(workingHours),
      availableSlots: JSON.stringify(availableSlots),
      status: "active",
      languages: JSON.stringify(["English", "Hindi"]),
      awards: JSON.stringify(["Best Doctor 2023"]),
      bio: "Experienced general physician with 10 years of practice.",
    }).returning();
    
    console.log(`Created doctor: ${createdUsers[0].fullName}`);

    // Create 1 patient
    const [patient] = await db.insert(patients).values({
      userId: createdUsers[1].id, // Patient user
      dateOfBirth: new Date("1990-05-15"),
      gender: "Female",
      bloodGroup: "O+",
      address: "456 Patient Street, Residential Area",
      emergencyContact: "9876543213",
      emergencyContactName: "John Doe",
      medicalHistory: "No significant medical history",
      allergies: "None known",
      height: "165.0",
      weight: "60.0",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400002",
      emergencyRelation: "Spouse",
      currentMedications: JSON.stringify([]),
      chronicConditions: JSON.stringify([]),
      insuranceProvider: "HealthCare Plus",
      insuranceNumber: "HC123456789",
      occupation: "Software Engineer",
      maritalStatus: "Married",
    }).returning();
    
    console.log(`Created patient: ${createdUsers[1].fullName}`);

    // Create sample prescription
    const [prescription] = await db.insert(prescriptions).values({
      patientId: patient.id,
      doctorId: doctor.id,
      hospitalId: hospital.id,
      diagnosis: "Common Cold",
      medications: JSON.stringify([
        {
          name: "Paracetamol",
          dosage: "500",
          unit: "mg",
          frequency: "Three times daily",
          timing: "After meals",
          duration: "5 days",
          instructions: "Take with food to avoid stomach upset",
          quantity: 15
        },
        {
          name: "Vitamin C",
          dosage: "1000",
          unit: "mg", 
          frequency: "Once daily",
          timing: "Morning",
          duration: "7 days",
          instructions: "Take with breakfast",
          quantity: 7
        }
      ]),
      instructions: "Get plenty of rest and stay hydrated. Return if symptoms worsen.",
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        isActive: true,
    }).returning();
    
    console.log(`Created prescription: ID ${prescription.id}`);

    console.log("✅ Database seeding completed successfully!");
    console.log("\n📋 Demo Credentials:");
    console.log("Doctor: 9876543210 / password123");
    console.log("Patient: 9876543211 / password123");
    console.log("Hospital Admin: 9876543212 / password123");
    
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  } finally {
    await sql.end();
  }
}

export { seedDummyData };