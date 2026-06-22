import { asyncHandler } from "../utils/asyncHandler.js";
import {
  addCandidateNote,
  createCandidate,
  getCandidate,
  listCandidates,
  moveCandidate,
  updateCandidate
} from "../data/store.js";

function requireFields(payload, fields) {
  const missing = fields.filter((field) => !payload[field]);

  if (missing.length) {
    const error = new Error(`Missing required fields: ${missing.join(", ")}.`);
    error.statusCode = 400;
    throw error;
  }
}

export const getCandidates = asyncHandler(async (req, res) => {
  const candidates = await listCandidates(req.query);
  res.json({ candidates });
});

export const getCandidateById = asyncHandler(async (req, res) => {
  const candidate = await getCandidate(req.params.id);

  if (!candidate) {
    return res.status(404).json({ message: "Candidate not found." });
  }

  res.json({ candidate });
});

export const postCandidate = asyncHandler(async (req, res) => {
  requireFields(req.body, ["name", "email", "headline", "jobId"]);
  const candidate = await createCandidate(req.body, req.user);
  res.status(201).json({ candidate });
});

export const patchCandidate = asyncHandler(async (req, res) => {
  const candidate = await updateCandidate(req.params.id, req.body);

  if (!candidate) {
    return res.status(404).json({ message: "Candidate not found." });
  }

  res.json({ candidate });
});

export const patchCandidateStage = asyncHandler(async (req, res) => {
  const candidate = await moveCandidate(req.params.id, req.body.stage);

  if (!candidate) {
    return res.status(404).json({ message: "Candidate not found." });
  }

  res.json({ candidate });
});

export const postCandidateNote = asyncHandler(async (req, res) => {
  if (!req.body.body) {
    return res.status(400).json({ message: "Note body is required." });
  }

  const candidate = await addCandidateNote(req.params.id, req.body.body, req.user);

  if (!candidate) {
    return res.status(404).json({ message: "Candidate not found." });
  }

  res.status(201).json({ candidate });
});
