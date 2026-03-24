import express from "express";
import { requireAuth } from "../middlewares/auth";
import { requireAdmin } from "../middlewares/roles";
import { getAdminRecent, getAdminStats, listAdminUsers } from "../controllers/admin.controller";

const router = express.Router();

router.get("/stats", requireAuth, requireAdmin, getAdminStats);
router.get("/recent", requireAuth, requireAdmin, getAdminRecent);
router.get("/users", requireAuth, requireAdmin, listAdminUsers);

export default router;
