import { asyncHandler } from "../utils/asyncHandler.js";
import {
  addCandidateNote,
  createCandidate,
  deleteCandidates,
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
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
  const totalPages = Math.ceil(candidates.length / limit);
  res.json({ candidates, page, totalPages});
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

export const deleteCandidate = asyncHandler(async (req, res) => {
  const candidate = await deleteCandidates(req.params.id);
  if (!candidate) {
    return res.status(404).json({ message: "Candidate not found." });
  }
  res.json({ candidate });
});

export const patchCandidateStage = asyncHandler(async (req, res) => {
  console.log(req.params.id, req.body.stage,'data')
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
