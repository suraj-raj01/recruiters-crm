import { asyncHandler } from "../utils/asyncHandler.js";
import { createJob, listJobById, listJobs, updateJob } from "../data/store.js";

function requireFields(payload, fields) {
  const missing = fields.filter((field) => !payload[field]);

  if (missing.length) {
    const error = new Error(`Missing required fields: ${missing.join(", ")}.`);
    error.statusCode = 400;
    throw error;
  }
}

export const getJobs = asyncHandler(async (req, res) => {
  const jobs = await listJobs();
  res.json({ jobs });
});

export const getJobById = asyncHandler(async (req, res) => {
  console.log(req.params.id,'id')
  const jobs = await listJobById(req.params.id);
  res.json({ jobs });
});

export const postJob = asyncHandler(async (req, res) => {
  requireFields(req.body, ["title", "department", "location", "hiringManager"]);
  const job = await createJob(req.body);
  res.status(201).json({ job });
});

export const patchJob = asyncHandler(async (req, res) => {
  const job = await updateJob(req.params.id, req.body);

  if (!job) {
    return res.status(404).json({ message: "Job not found." });
  }

  res.json({ job });
});
