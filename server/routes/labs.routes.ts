import { Router } from "express";
import { authenticateToken, authorizeRoles } from "@/middleware/auth";
import type { AuthenticatedRequest } from "@/types";

const router = Router();

router.get(
  "/me/reports",
  authenticateToken,
  authorizeRoles("LAB"),
  async (req: AuthenticatedRequest, res) => {
    const labId = req.user!.id;
    // fetch lab reports for this lab
    res.json([]); // Replace with real logic
  }
);

export default router;
