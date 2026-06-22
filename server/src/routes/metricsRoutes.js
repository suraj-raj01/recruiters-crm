import { Router } from "express";
import { getDashboardMetrics } from "../controllers/metricsController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/", getDashboardMetrics);

export default router;
