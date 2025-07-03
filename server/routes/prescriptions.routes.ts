// server/routes/prescriptions.routes.ts
import { Router } from "express";
import { z } from "zod";
import { authenticateToken, authorizeRoles } from "../middleware/auth";
import type { AuthenticatedRequest } from "../types";
import * as prescriptionService from "../services/prescription.service";
import { insertPrescriptionSchema } from "../../shared/schema"; // already defined

const router = Router();

// 1. Issue a new prescription (only doctor)
router.post(
  "/",
  authenticateToken,
  authorizeRoles("DOCTOR"),
  async (req: AuthenticatedRequest, res) => {
    try {
      const doctorId = req.user!.id;
      const parsed = insertPrescriptionSchema.parse(req.body);
      const result = await prescriptionService.issuePrescription({ ...parsed, doctorId });
      res.status(201).json(result);
    } catch (err) {
      console.error("Issue prescription error:", err);
      res.status(400).json({ error: "Invalid data or server error" });
    }
  }
);

// 2. Get prescriptions for logged-in patient
router.get(
  "/patient",
  authenticateToken,
  authorizeRoles("PATIENT"),
  async (req: AuthenticatedRequest, res) => {
    try {
      const prescriptions = await prescriptionService.getPrescriptionsForPatient(req.user!.id);
      res.json(prescriptions);
    } catch (err) {
      console.error("Fetch patient prescriptions failed:", err);
      res.status(500).json({ error: "Failed to fetch prescriptions" });
    }
  }
);

// 3. Get filtered prescriptions (hospital, date) for patient
router.get(
  "/patient/filters",
  authenticateToken,
  authorizeRoles("PATIENT"),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { hospitalId, from, to } = req.query;
      const result = await prescriptionService.getPrescriptionsByFilters({
        patientId: req.user!.id,
        hospitalId: hospitalId ? Number(hospitalId) : undefined,
        from: from ? new Date(from as string) : undefined,
        to: to ? new Date(to as string) : undefined,
      });
      res.json(result);
    } catch (err) {
      console.error("Filtered prescriptions error:", err);
      res.status(500).json({ error: "Filter failed" });
    }
  }
);

// 4. Update prescription by doctor
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("DOCTOR"),
  async (req: AuthenticatedRequest, res) => {
    try {
      const prescriptionId = Number(req.params.id);
      const updated = await prescriptionService.updatePrescription(
        req.user!.id,
        prescriptionId,
        req.body
      );
      if (!updated) return res.status(404).json({ message: "Prescription not found or unauthorized" });
      res.json(updated);
    } catch (err) {
      console.error("Update prescription error:", err);
      res.status(500).json({ error: "Failed to update" });
    }
  }
);

// 5. Delete prescription by doctor
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("DOCTOR"),
  async (req: AuthenticatedRequest, res) => {
    try {
      const prescriptionId = Number(req.params.id);
      const deleted = await prescriptionService.deletePrescription(req.user!.id, prescriptionId);
      if (deleted.length === 0) {
        return res.status(404).json({ message: "Prescription not found or unauthorized" });
      }
      res.json({ message: "Prescription deleted" });
    } catch (err) {
      console.error("Delete prescription error:", err);
      res.status(500).json({ error: "Failed to delete" });
    }
  }
);

export default router;
