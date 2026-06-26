import { Router } from "express";
import { getJobs, patchJob, postJob, getJobById } from "../controllers/jobController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", postJob);
router.patch("/:id", patchJob);

export default router;
