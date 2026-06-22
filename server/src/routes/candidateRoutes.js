import { Router } from "express";
import {
  getCandidateById,
  getCandidates,
  patchCandidate,
  patchCandidateStage,
  postCandidate,
  postCandidateNote
} from "../controllers/candidateController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);
router.get("/", getCandidates);
router.post("/", postCandidate);
router.get("/:id", getCandidateById);
router.patch("/:id", patchCandidate);
router.patch("/:id/stage", patchCandidateStage);
router.post("/:id/notes", postCandidateNote);

export default router;
