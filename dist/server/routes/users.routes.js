// server/routes/users.routes.ts
import { Router } from "express";
import { getUserByPhone, getUserById } from "../storage/users";
const router = Router();
router.get("/phone/:phone", async (req, res) => {
    try {
        const user = await getUserByPhone(req.params.phone);
        res.json({ user });
    }
    catch (err) {
        console.error("Get user by phone error:", err);
        res.status(500).json({ message: "Failed to fetch user by phone" });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const user = await getUserById(parseInt(req.params.id));
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.json({ user });
    }
    catch (err) {
        console.error("Get user by ID error:", err);
        res.status(500).json({ message: "Failed to fetch user by ID" });
    }
});
export default router;
