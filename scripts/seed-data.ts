import bcrypt from "bcrypt";
import { db } from "../server/db";
import { storage } from "../server/storage";

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
    
    // Create 4 hospitals
    const hospitals = [];
    for (let i = 0; i < 4; i++) {
      const hospitalUser = await storage.createUser({
        mobileNumber: generateMobileNumber(),
        password: hashedPassword,
        fullName: hospitalNames[i],
        role: "hospital",
        isVerified: true,
      });

      const hospital = await storage.createHospital({
        userId: hospitalUser.id,
        name: hospitalNames[i],
        address: `${Math.floor(Math.random() * 999) + 1}, Medical Street`,
        city: getRandomItem(cities),
        state: getRandomItem(states),
        zipCode: (110000 + Math.floor(Math.random() * 90000)).toString(),
        licenseNumber: generateLicenseNumber("HOS"),
        contactEmail: `contact@${hospitalNames[i].toLowerCase().replace(/\s+/g, '')}.com`,
        website: `www.${hospitalNames[i].toLowerCase().replace(/\s+/g, '')}.com`,
        establishedYear: 1990 + Math.floor(Math.random() * 30),
        totalBeds: 100 + Math.floor(Math.random() * 400),
        departments: JSON.stringify(getRandomItems(departments, 6)),
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
      });
      
      hospitals.push(hospital);
      console.log(`Created hospital: ${hospital.name}`);
    }

    // Create 4 doctors for each hospital (16 total)
    const doctors = [];
    for (let hospitalIndex = 0; hospitalIndex < hospitals.length; hospitalIndex++) {
      const hospital = hospitals[hospitalIndex];
      
      for (let j = 0; j < 4; j++) {
        const doctorIndex = hospitalIndex * 4 + j;
        const doctorUser = await storage.createUser({
          mobileNumber: generateMobileNumber(),
          password: hashedPassword,
          fullName: doctorNames[doctorIndex],
          role: "doctor",
          isVerified: true,
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
          status: getRandomItem(['in', 'out']),
          languages: JSON.stringify(["English", "Hindi", getRandomItem(["Tamil", "Telugu", "Kannada", "Marathi"])]),
          awards: JSON.stringify([
            "Best Doctor Award 2020",
            "Excellence in Medical Service 2021",
            "Outstanding Healthcare Professional 2022"
          ]),
          bio: `Experienced ${getRandomItem(specialties)} specialist with over ${5 + Math.floor(Math.random() * 20)} years of practice. Committed to providing excellent patient care.`,
          isAvailable: true,
        });
        
        doctors.push(doctor);
        console.log(`Created doctor: ${doctorNames[doctorIndex]} at ${hospital.name}`);
      }
    }

    // Create 10 patients
    const patients = [];
    for (let i = 0; i < 10; i++) {
      const patientUser = await storage.createUser({
        mobileNumber: generateMobileNumber(),
        password: hashedPassword,
        fullName: patientNames[i],
        role: "patient",
        isVerified: true,
      });

      const birthYear = 1950 + Math.floor(Math.random() * 50);
      const patient = await storage.createPatient({
        userId: patientUser.id,
        dateOfBirth: new Date(`${birthYear}-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`),
        gender: getRandomItem(["Male", "Female"]),
        bloodGroup: getRandomItem(["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"]),
        height: (150 + Math.floor(Math.random() * 40)).toString(),
        weight: (50 + Math.floor(Math.random() * 50)).toString(),
        address: `${Math.floor(Math.random() * 999) + 1}, Residential Colony`,
        city: getRandomItem(cities),
        state: getRandomItem(states),
        zipCode: (110000 + Math.floor(Math.random() * 90000)).toString(),
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
        insuranceNumber: `INS${Math.floor(100000000 + Math.random() * 900000000)}`,
        occupation: getRandomItem(["Software Engineer", "Teacher", "Business", "Government Employee", "Student", "Retired"]),
        maritalStatus: getRandomItem(["Single", "Married", "Divorced", "Widowed"]),
      });
      
      patients.push(patient);
      console.log(`Created patient: ${patientNames[i]}`);
    }

    // Create 1 receptionist per hospital (4 total)
    const receptionists = [];
    for (let i = 0; i < hospitals.length; i++) {
      const receptionistUser = await storage.createUser({
        mobileNumber: generateMobileNumber(),
        password: hashedPassword,
        fullName: receptionistNames[i],
        role: "receptionist",
        isVerified: true,
      });

      const receptionist = await storage.createReceptionist({
        userId: receptionistUser.id,
        hospitalId: hospitals[i].id,
        employeeId: `EMP${Math.floor(1000 + Math.random() * 9000)}`,
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
          "manage_appointments", "view_patient_details", "confirm_bookings", 
          "cancel_appointments", "generate_reports"
        ]),
        dateOfJoining: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        isActive: true,
      });
      
      receptionists.push(receptionist);
      console.log(`Created receptionist: ${receptionistNames[i]} at ${hospitals[i].name}`);
    }

    // Create 2 labs for each hospital (8 total)
    const labs = [];
    for (let hospitalIndex = 0; hospitalIndex < hospitals.length; hospitalIndex++) {
      const hospital = hospitals[hospitalIndex];
      
      for (let j = 0; j < 2; j++) {
        const labIndex = hospitalIndex * 2 + j;
        const labUser = await storage.createUser({
          mobileNumber: generateMobileNumber(),
          password: hashedPassword,
          fullName: labNames[labIndex],
          role: "lab",
          isVerified: true,
        });

        const lab = await storage.createLab({
          userId: labUser.id,
          hospitalId: hospital.id,
          name: labNames[labIndex],
          address: `${Math.floor(Math.random() * 999) + 1}, Lab Complex`,
          city: hospital.city || getRandomItem(cities),
          state: hospital.state || getRandomItem(states),
          zipCode: (110000 + Math.floor(Math.random() * 90000)).toString(),
          licenseNumber: generateLicenseNumber("LAB"),
          contactEmail: `info@${labNames[labIndex].toLowerCase().replace(/\s+/g, '')}.com`,
          operatingHours: JSON.stringify({
            weekdays: "08:00 AM - 8:00 PM",
            saturday: "08:00 AM - 6:00 PM",
            sunday: "08:00 AM - 2:00 PM"
          }),
          specializations: JSON.stringify([
            "Clinical Pathology", "Blood Tests", "Urine Analysis", 
            "X-Ray", "ECG", "Ultrasound"
          ]),
          testCategories: JSON.stringify([
            "Blood Chemistry", "Hematology", "Immunology", 
            "Microbiology", "Radiology", "Cardiology"
          ]),
          equipment: JSON.stringify([
            "Digital X-Ray Machine", "Ultrasound Scanner", 
            "ECG Machine", "Automated Analyzer", "Microscopes"
          ]),
          accreditation: JSON.stringify([
            "NABL Certified", "ISO 15189:2012", "CAP Accredited"
          ]),
          isActive: true,
        });
        
        labs.push(lab);
        console.log(`Created lab: ${labNames[labIndex]} for ${hospital.name}`);
      }
    }

    return { hospitals, doctors, patients, receptionists, labs };
    
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  }
}

export { seedDummyData };