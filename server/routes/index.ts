// server/routes/index.ts
import { Express, Router } from "express";

import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";
import hospitalsRoutes from "./hospitals.routes";
import doctorsRoutes from "./doctors.routes";
import patientsRoutes from "./patients.routes";
import labsRoutes from "./labs.routes";
import receptionRoutes from "./reception.routes";
import appointmentsRoutes from "./appointments.routes";
import availabilityRoutes from "./availability.routes";
import prescriptionsRoutes from "./prescriptions.routes";


const router = Router();

router.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

export default router;

export async function registerRoutes(app: Express) {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", usersRoutes);
  app.use("/api/hospitals", hospitalsRoutes);
  app.use("/api/doctors", doctorsRoutes);
  app.use("/api/patients", patientsRoutes);
  app.use("/api/labs", labsRoutes);
  app.use("/api/reception", receptionRoutes);
  app.use("/api/appointments", appointmentsRoutes);
  app.use("/api/doctors/availability", availabilityRoutes);
  app.use("/api/prescriptions", prescriptionsRoutes); 
  return app;
}