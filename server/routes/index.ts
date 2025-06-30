import { Express } from "express";
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";
import hospitalsRoutes from "./hospitals.routes";
import doctorsRoutes from "./doctors.routes";
import patientsRoutes from "./patients.routes";
import labsRoutes from "./labs.routes";
import receptionRoutes from "./reception.routes";
import appointmentsRoutes from "./appointments.routes";

export async function registerRoutes(app: Express) {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", usersRoutes);
  app.use("/api/hospitals", hospitalsRoutes);
  app.use("/api/doctors", doctorsRoutes);
  app.use("/api/patients", patientsRoutes);
  app.use("/api/labs", labsRoutes);
  app.use("/api/reception", receptionRoutes);
  app.use("/api/appointments", appointmentsRoutes);

  return app;
}
