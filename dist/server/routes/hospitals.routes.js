// server/routes/hospitals.routes.ts
import { Router } from "express";
import { createHospital, getAllHospitals } from "../storage/hospitals";
import { insertHospitalSchema } from "../../shared/schema";
const router = Router();
router.get("/", async (req, res) => {
    try {
        const hospitals = await getAllHospitals();
        res.json({ hospitals });
    }
    catch (err) {
        console.error("Fetch hospitals error:", err);
        res.status(500).json({ message: "Failed to fetch hospitals" });
    }
});
router.post("/", async (req, res) => {
    try {
        const data = insertHospitalSchema.parse(req.body);
        const hospital = await createHospital(data);
        res.status(201).json({ hospital });
    }
    catch (err) {
        console.error("Register hospital error:", err);
        res.status(400).json({ message: "Invalid data", error: err });
    }
});
export default router;
