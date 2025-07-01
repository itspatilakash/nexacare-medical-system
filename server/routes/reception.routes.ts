import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth";
import type { AuthenticatedRequest } from "../types";

const router = Router();

router.get(
  "/walkins",
  authenticateToken,
  authorizeRoles("RECEPTIONIST"),
  async (req: AuthenticatedRequest, res) => {
    const receptionistId = req.user!.id;
    res.json([]); // Replace with real logic
  }
);

export default router;
