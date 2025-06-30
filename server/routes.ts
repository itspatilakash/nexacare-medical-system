import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcrypt";
import { storage } from ".";
import { 
  registrationSchema, 
  loginSchema, 
  otpVerificationSchema,
  insertHospitalSchema,
  insertDoctorSchema,
  insertPatientSchema,
  insertLabSchema,
  insertAppointmentSchema,
  insertPrescriptionSchema,
  insertLabReportSchema
} from "@shared/schema";
import { authenticateToken, authorizeRoles, generateToken, type AuthenticatedRequest } from "./middleware/auth";
import { seedDummyData } from "../scripts/seed-data";
import { db } from "./db";
import * as schema from "@shared/schema";
import { eq, and } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function to generate OTP (stub - in production use SMS service)
  function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Helper function to send SMS (stub)
  async function sendSMS(mobileNumber: string, message: string): Promise<void> {
    console.log(`SMS to ${mobileNumber}: ${message}`);
    // In production, integrate with SMS service like Twilio
  }

  // Registration endpoint - send OTP
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registrationSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByMobileNumber(validatedData.mobileNumber);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this mobile number" });
      }

      // Generate and store OTP
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await storage.createOtp({
        mobileNumber: validatedData.mobileNumber,
        otp,
        expiresAt,
        isUsed: false,
      });

      // Send OTP via SMS (stubbed)
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

  // OTP verification and user creation
  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const validatedData = otpVerificationSchema.parse(req.body);
      
      // Verify OTP
      const otpRecord = await storage.getValidOtp(validatedData.mobileNumber, validatedData.otp);
      if (!otpRecord) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      // Get role from registration data stored in session/temp storage
      // For now, we'll require role to be sent again
      const role = req.body.role || 'patient';

      // Create user
      const user = await storage.createUser({
        mobileNumber: validatedData.mobileNumber,
        password: hashedPassword,
        fullName: req.body.fullName || 'User',
        role: role,
        isVerified: true,
      });

      // Mark OTP as used
      await storage.markOtpAsUsed(otpRecord.id);

      // Generate JWT token
      const token = generateToken({
        id: user.id,
        mobileNumber: user.mobileNumber,
        role: user.role,
        fullName: user.fullName,
      });

      res.json({
        message: "Registration successful",
        token,
        user: {
          id: user.id,
          mobileNumber: user.mobileNumber,
          fullName: user.fullName,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(400).json({ message: "OTP verification failed" });
    }
  });

  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByMobileNumber(validatedData.mobileNumber);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = generateToken({
        id: user.id,
        mobileNumber: user.mobileNumber,
        role: user.role,
        fullName: user.fullName,
      });

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          mobileNumber: user.mobileNumber,
          fullName: user.fullName,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Login failed" });
    }
  });

  // Get current user profile
  app.get("/api/auth/me", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let profile = null;
      switch (user.role) {
        case 'hospital':
          profile = await storage.getHospitalByUserId(user.id);
          break;
        case 'doctor':
          profile = await storage.getDoctorByUserId(user.id);
          break;
        case 'patient':
          profile = await storage.getPatientByUserId(user.id);
          break;
        case 'lab':
          profile = await storage.getLabByUserId(user.id);
          break;
        case 'receptionist':
          profile = await storage.getReceptionistByUserId(user.id);
          break;
      }

      res.json({
        user: {
          id: user.id,
          mobileNumber: user.mobileNumber,
          fullName: user.fullName,
          role: user.role,
          isVerified: user.isVerified,
        },
        profile,
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Hospital profile endpoints
  app.post("/api/hospitals/profile", authenticateToken, authorizeRoles('hospital'), async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertHospitalSchema.parse(req.body);
      const hospital = await storage.createHospital({
        ...validatedData,
        userId: req.user!.id,
      });
      res.json(hospital);
    } catch (error) {
      console.error("Create hospital profile error:", error);
      res.status(400).json({ message: "Failed to create hospital profile" });
    }
  });

  app.put("/api/hospitals/profile", authenticateToken, authorizeRoles('hospital'), async (req: AuthenticatedRequest, res) => {
    try {
      const hospital = await storage.getHospitalByUserId(req.user!.id);
      if (!hospital) {
        return res.status(404).json({ message: "Hospital profile not found" });
      }

      const validatedData = insertHospitalSchema.partial().parse(req.body);
      const updated = await storage.updateHospital(hospital.id, validatedData);
      res.json(updated);
    } catch (error) {
      console.error("Update hospital profile error:", error);
      res.status(400).json({ message: "Failed to update hospital profile" });
    }
  });

  // Doctor profile endpoints
  app.post("/api/doctors/profile", authenticateToken, authorizeRoles('doctor'), async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertDoctorSchema.parse(req.body);
      const doctor = await storage.createDoctor({
        ...validatedData,
        userId: req.user!.id,
      });
      res.json(doctor);
    } catch (error) {
      console.error("Create doctor profile error:", error);
      res.status(400).json({ message: "Failed to create doctor profile" });
    }
  });

  // Get doctors by hospital
  app.get("/api/hospitals/:hospitalId/doctors", authenticateToken, async (req, res) => {
    try {
      const hospitalId = parseInt(req.params.hospitalId);
      const doctors = await storage.getDoctorsByHospitalId(hospitalId);
      res.json(doctors);
    } catch (error) {
      console.error("Get doctors error:", error);
      res.status(500).json({ message: "Failed to fetch doctors" });
    }
  });

  // Patient profile endpoints
  app.post("/api/patients/profile", authenticateToken, authorizeRoles('patient'), async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient({
        ...validatedData,
        userId: req.user!.id,
      });
      res.json(patient);
    } catch (error) {
      console.error("Create patient profile error:", error);
      res.status(400).json({ message: "Failed to create patient profile" });
    }
  });

  // Appointment endpoints
  app.post("/api/appointments", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // Get patient ID from user
      const patient = await storage.getPatientByUserId(req.user!.id);
      if (!patient) {
        return res.status(404).json({ message: "Patient profile not found" });
      }

      // Convert date string to Date object and prepare appointment data
      const appointmentData = {
        patientId: patient.id,
        doctorId: parseInt(req.body.doctorId),
        hospitalId: parseInt(req.body.hospitalId),
        appointmentDate: new Date(req.body.appointmentDate),
        appointmentTime: req.body.appointmentTime || req.body.timeSlot,
        timeSlot: req.body.timeSlot || req.body.appointmentTime,
        reason: req.body.reason,
        priority: req.body.priority || 'normal',
        symptoms: req.body.symptoms,
        status: 'pending',
        type: req.body.type || 'online',
        createdBy: req.user!.id,
      };

      const appointment = await storage.createAppointment(appointmentData);
      
      res.json({ 
        message: "Appointment request submitted successfully. Awaiting receptionist confirmation.", 
        appointment 
      });
    } catch (error) {
      console.error("Create appointment error:", error);
      res.status(400).json({ message: "Failed to create appointment" });
    }
  });

  app.get("/api/appointments/my", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      let appointments = [];
      
      switch (req.user!.role) {
        case 'patient':
          const patient = await storage.getPatientByUserId(req.user!.id);
          if (patient) {
            appointments = await storage.getAppointmentsByPatientId(patient.id);
          }
          break;
        case 'doctor':
          const doctor = await storage.getDoctorByUserId(req.user!.id);
          if (doctor) {
            appointments = await storage.getAppointmentsByDoctorId(doctor.id);
          }
          break;
        case 'hospital':
        case 'receptionist':
          const hospital = await storage.getHospitalByUserId(req.user!.id);
          if (hospital) {
            appointments = await storage.getAppointmentsByHospitalId(hospital.id);
          }
          break;
      }

      res.json(appointments);
    } catch (error) {
      console.error("Get appointments error:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.get("/api/appointments/today", authenticateToken, authorizeRoles('doctor'), async (req: AuthenticatedRequest, res) => {
    try {
      const doctor = await storage.getDoctorByUserId(req.user!.id);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }

      const appointments = await storage.getTodaysAppointments(doctor.id);
      res.json(appointments);
    } catch (error) {
      console.error("Get today's appointments error:", error);
      res.status(500).json({ message: "Failed to fetch today's appointments" });
    }
  });

  // Prescription endpoints
  app.post("/api/prescriptions", authenticateToken, authorizeRoles('doctor'), async (req: AuthenticatedRequest, res) => {
    try {
      const doctor = await storage.getDoctorByUserId(req.user!.id);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }

      const validatedData = insertPrescriptionSchema.parse(req.body);
      const prescription = await storage.createPrescription({
        ...validatedData,
        doctorId: doctor.id,
      });
      res.json(prescription);
    } catch (error) {
      console.error("Create prescription error:", error);
      res.status(400).json({ message: "Failed to create prescription" });
    }
  });

  app.get("/api/prescriptions/my", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      let prescriptions = [];
      
      switch (req.user!.role) {
        case 'patient':
          const patient = await storage.getPatientByUserId(req.user!.id);
          if (patient) {
            prescriptions = await storage.getPrescriptionsByPatientId(patient.id);
          }
          break;
        case 'doctor':
          const doctor = await storage.getDoctorByUserId(req.user!.id);
          if (doctor) {
            prescriptions = await storage.getPrescriptionsByDoctorId(doctor.id);
          }
          break;
      }

      res.json(prescriptions);
    } catch (error) {
      console.error("Get prescriptions error:", error);
      res.status(500).json({ message: "Failed to fetch prescriptions" });
    }
  });

  // Lab report endpoints
  app.post("/api/lab-reports", authenticateToken, authorizeRoles('lab'), async (req: AuthenticatedRequest, res) => {
    try {
      const lab = await storage.getLabByUserId(req.user!.id);
      if (!lab) {
        return res.status(404).json({ message: "Lab profile not found" });
      }

      const validatedData = insertLabReportSchema.parse(req.body);
      const labReport = await storage.createLabReport({
        ...validatedData,
        labId: lab.id,
      });
      res.json(labReport);
    } catch (error) {
      console.error("Create lab report error:", error);
      res.status(400).json({ message: "Failed to create lab report" });
    }
  });

  app.get("/api/lab-reports/my", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      let labReports = [];
      
      switch (req.user!.role) {
        case 'patient':
          const patient = await storage.getPatientByUserId(req.user!.id);
          if (patient) {
            labReports = await storage.getLabReportsByPatientId(patient.id);
          }
          break;
        case 'lab':
          const lab = await storage.getLabByUserId(req.user!.id);
          if (lab) {
            labReports = await storage.getLabReportsByLabId(lab.id);
          }
          break;
      }

      res.json(labReports);
    } catch (error) {
      console.error("Get lab reports error:", error);
      res.status(500).json({ message: "Failed to fetch lab reports" });
    }
  });

  // Dashboard stats endpoints
  // Get hospitals list
  app.get("/api/hospitals/list", async (req, res) => {
    try {
      const hospitals = await db.select({
        id: schema.hospitals.id,
        name: schema.hospitals.name,
        city: schema.hospitals.city,
        state: schema.hospitals.state,
        totalBeds: schema.hospitals.totalBeds,
        emergencyServices: schema.hospitals.emergencyServices,
      }).from(schema.hospitals)
      .where(eq(schema.hospitals.isActive, true));

      res.json(hospitals);
    } catch (error) {
      console.error("Get hospitals error:", error);
      res.status(500).json({ message: "Failed to fetch hospitals" });
    }
  });

  // Get doctors by hospital
  app.get("/api/doctors/by-hospital/:hospitalId", async (req, res) => {
    try {
      const hospitalId = parseInt(req.params.hospitalId);
      
      const doctors = await db.select({
        id: schema.doctors.id,
        specialty: schema.doctors.specialty,
        experience: schema.doctors.experience,
        consultationFee: schema.doctors.consultationFee,
        status: schema.doctors.status,
        isAvailable: schema.doctors.isAvailable,
        user: {
          id: schema.users.id,
          fullName: schema.users.fullName,
        },
      })
      .from(schema.doctors)
      .innerJoin(schema.users, eq(schema.doctors.userId, schema.users.id))
      .where(and(
        eq(schema.doctors.hospitalId, hospitalId),
        eq(schema.doctors.isAvailable, true)
      ));

      res.json(doctors);
    } catch (error) {
      console.error("Get doctors by hospital error:", error);
      res.status(500).json({ message: "Failed to fetch doctors" });
    }
  });

  // Get doctor availability (placeholder - returns default slots)
  app.get("/api/doctors/availability/:doctorId/:date", async (req, res) => {
    try {
      const doctorId = parseInt(req.params.doctorId);
      const date = req.params.date;
      
      // For now, return default available slots
      // In a real system, this would check existing appointments and doctor's schedule
      const availableSlots = [];
      for (let hour = 10; hour < 20; hour++) {
        if (hour === 13) continue; // Skip lunch
        
        availableSlots.push(`${hour.toString().padStart(2, '0')}:00-${hour.toString().padStart(2, '0')}:30`);
        if (hour !== 19) {
          availableSlots.push(`${hour.toString().padStart(2, '0')}:30-${(hour + 1).toString().padStart(2, '0')}:00`);
        }
      }

      res.json({ availableSlots });
    } catch (error) {
      console.error("Get doctor availability error:", error);
      res.status(500).json({ message: "Failed to fetch availability" });
    }
  });

  // Get pending appointments for receptionists
  app.get("/api/appointments/pending", authenticateToken, authorizeRoles('receptionist'), async (req: AuthenticatedRequest, res) => {
    try {
      const receptionist = await storage.getReceptionistByUserId(req.user!.id);
      if (!receptionist) {
        return res.status(404).json({ message: "Receptionist profile not found" });
      }

      const pendingAppointments = await db.select({
        id: schema.appointments.id,
        appointmentDate: schema.appointments.appointmentDate,
        timeSlot: schema.appointments.timeSlot,
        reason: schema.appointments.reason,
        priority: schema.appointments.priority,
        status: schema.appointments.status,
        patient: {
          id: schema.patients.id,
          user: {
            fullName: schema.users.fullName,
            mobileNumber: schema.users.mobileNumber,
          }
        },
        doctor: {
          id: schema.doctors.id,
          specialty: schema.doctors.specialty,
          user: {
            fullName: schema.users.fullName,
          }
        }
      })
      .from(schema.appointments)
      .innerJoin(schema.patients, eq(schema.appointments.patientId, schema.patients.id))
      .innerJoin(schema.doctors, eq(schema.appointments.doctorId, schema.doctors.id))
      .innerJoin(schema.users, eq(schema.patients.userId, schema.users.id))
      .where(and(
        eq(schema.appointments.hospitalId, receptionist.hospitalId),
        eq(schema.appointments.status, 'pending')
      ))
      .orderBy(schema.appointments.appointmentDate);

      res.json(pendingAppointments);
    } catch (error) {
      console.error("Get pending appointments error:", error);
      res.status(500).json({ message: "Failed to fetch pending appointments" });
    }
  });

  // Confirm appointment (receptionist)
  app.put("/api/appointments/:id/confirm", authenticateToken, authorizeRoles('receptionist'), async (req: AuthenticatedRequest, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const receptionist = await storage.getReceptionistByUserId(req.user!.id);
      
      if (!receptionist) {
        return res.status(404).json({ message: "Receptionist profile not found" });
      }

      const appointment = await storage.updateAppointmentStatus(appointmentId, 'confirmed');
      
      // Create notifications for patient and doctor
      // (This would be implemented with the notifications system)
      
      res.json({ message: "Appointment confirmed successfully", appointment });
    } catch (error) {
      console.error("Confirm appointment error:", error);
      res.status(500).json({ message: "Failed to confirm appointment" });
    }
  });

  app.get("/api/dashboard/stats", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const stats: any = {};

      switch (req.user!.role) {
        case 'hospital':
          const hospital = await storage.getHospitalByUserId(req.user!.id);
          if (hospital) {
            const doctors = await storage.getDoctorsByHospitalId(hospital.id);
            const patients = await storage.getPatientsByHospitalId(hospital.id);
            const appointments = await storage.getAppointmentsByHospitalId(hospital.id);
            
            stats.doctorsCount = doctors.length;
            stats.patientsCount = patients.length;
            stats.todayAppointments = appointments.filter(apt => {
              const today = new Date().toDateString();
              return new Date(apt.appointmentDate).toDateString() === today;
            }).length;
            stats.totalAppointments = appointments.length;
          }
          break;
          
        case 'doctor':
          const doctor = await storage.getDoctorByUserId(req.user!.id);
          if (doctor) {
            const appointments = await storage.getAppointmentsByDoctorId(doctor.id);
            const todayAppointments = await storage.getTodaysAppointments(doctor.id);
            const prescriptions = await storage.getPrescriptionsByDoctorId(doctor.id);
            
            stats.totalAppointments = appointments.length;
            stats.todayAppointments = todayAppointments.length;
            stats.totalPrescriptions = prescriptions.length;
            stats.totalPatients = new Set(appointments.map(apt => apt.patientId)).size;
          }
          break;
          
        case 'patient':
          const patient = await storage.getPatientByUserId(req.user!.id);
          if (patient) {
            const appointments = await storage.getAppointmentsByPatientId(patient.id);
            const prescriptions = await storage.getPrescriptionsByPatientId(patient.id);
            const labReports = await storage.getLabReportsByPatientId(patient.id);
            
            stats.upcomingAppointments = appointments.filter(apt => 
              new Date(apt.appointmentDate) > new Date() && apt.status === 'scheduled'
            ).length;
            stats.activePrescriptions = prescriptions.filter(p => p.isActive).length;
            stats.labReports = labReports.length;
          }
          break;
      }

      res.json(stats);
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  // Seed dummy data endpoint (development only)
  app.post("/api/seed-data", async (req, res) => {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({ message: "Seeding only allowed in development" });
    }
    
    try {
      console.log("Starting data seeding...");
      const result = await seedDummyData();
      
      // Get all user credentials for display
      const credentials = [];
      
      // Get hospital credentials
      for (const hospital of result.hospitals) {
        const user = await storage.getUser(hospital.userId);
        if (user) {
          credentials.push({
            type: "Hospital",
            name: hospital.name,
            mobile: user.mobileNumber,
            password: "password123"
          });
        }
      }
      
      // Get doctor credentials
      for (const doctor of result.doctors) {
        const user = await storage.getUser(doctor.userId);
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
      
      // Get patient credentials
      for (const patient of result.patients) {
        const user = await storage.getUser(patient.userId);
        if (user) {
          credentials.push({
            type: "Patient",
            name: user.fullName,
            mobile: user.mobileNumber,
            password: "password123"
          });
        }
      }
      
      // Get receptionist credentials
      for (const receptionist of result.receptionists) {
        const user = await storage.getUser(receptionist.userId);
        if (user) {
          credentials.push({
            type: "Receptionist",
            name: user.fullName,
            mobile: user.mobileNumber,
            password: "password123"
          });
        }
      }
      
      // Get lab credentials
      for (const lab of result.labs) {
        const user = await storage.getUser(lab.userId);
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
