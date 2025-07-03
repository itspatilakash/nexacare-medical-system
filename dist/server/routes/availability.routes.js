import { Router } from "express";
const router = Router();
router.get("/:doctorId/:date", async (req, res) => {
    try {
        const doctorId = parseInt(req.params.doctorId);
        const date = req.params.date;
        const availableSlots = [];
        for (let hour = 10; hour < 20; hour++) {
            if (hour === 13)
                continue;
            availableSlots.push(`${hour.toString().padStart(2, "0")}:00-${hour.toString().padStart(2, "0")}:30`);
            if (hour !== 19) {
                availableSlots.push(`${hour.toString().padStart(2, "0")}:30-${(hour + 1).toString().padStart(2, "0")}:00`);
            }
        }
        res.json({ availableSlots });
    }
    catch (error) {
        console.error("Get doctor availability error:", error);
        res.status(500).json({ message: "Failed to fetch availability" });
    }
});
export default router;
