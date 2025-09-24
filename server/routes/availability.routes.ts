// server/routes/availability.routes.ts
import { Router } from "express";
import {
  isDoctorAvailable,
  updateDoctorAvailability,
  setDoctorStatus,
} from "../services/availability.service";

const router = Router();

// 1. Get hardcoded available slots for UI (can be replaced later with DB)
router.get("/:doctorId/:date", async (req, res) => {
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

// 2. Update doctor available slots (Hospital Admin)
router.put("/slots/:doctorId", async (req, res) => {
  try {
    const doctorId = parseInt(req.params.doctorId);
    const { slots } = req.body;
    const updated = await updateDoctorAvailability(doctorId, slots);
    res.json(updated);
  } catch (error) {
    console.error("Update slots error:", error);
    res.status(500).json({ message: "Failed to update slots" });
  }
});

// 3. Set doctor in/out status
router.put("/status/:doctorId", async (req, res) => {
  try {
    const doctorId = parseInt(req.params.doctorId);
    const { status } = req.body;
    if (!["in", "out"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const updated = await setDoctorStatus(doctorId, status as "in" | "out");
    res.json(updated);
  } catch (error) {
    console.error("Set doctor status error:", error);
    res.status(500).json({ message: "Failed to update doctor status" });
  }
});

export default router;
