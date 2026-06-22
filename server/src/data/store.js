import { randomUUID } from "node:crypto";
import { isMongoConnected } from "../config/database.js";
import Candidate from "../models/Candidate.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import { PIPELINE_STAGES, createInitialState } from "./mockData.js";

const memory = createInitialState();

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function splitTags(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (!value) {
    return [];
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function serializeJob(job) {
  if (!job) {
    return null;
  }

  const raw = typeof job.toObject === "function" ? job.toObject({ versionKey: false }) : job;
  const { _id, __v, ...rest } = raw;

  return {
    ...rest,
    id: raw.id || String(_id)
  };
}

function serializeCandidate(candidate) {
  if (!candidate) {
    return null;
  }

  const raw = typeof candidate.toObject === "function" ? candidate.toObject({ versionKey: false }) : candidate;
  const { _id, __v, jobId, ...rest } = raw;
  const populatedJob = jobId && typeof jobId === "object" && jobId.title ? serializeJob(jobId) : null;
  const normalizedJobId = populatedJob?.id || (jobId ? String(jobId) : null);
  const memoryJob = populatedJob || memory.jobs.find((job) => job.id === normalizedJobId) || null;

  return {
    ...rest,
    id: raw.id || String(_id),
    jobId: normalizedJobId,
    job: memoryJob ? clone(memoryJob) : null
  };
}

function publicUser(user) {
  if (!user) {
    return null;
  }

  const raw = typeof user.toObject === "function" ? user.toObject({ versionKey: false }) : user;
  const { _id, __v, password, passwordHash, ...rest } = raw;

  return {
    ...rest,
    id: raw.id || String(_id)
  };
}

export async function findUserByEmail(email) {
  if (isMongoConnected()) {
    return User.findOne({ email: String(email).toLowerCase() }).select("+passwordHash");
  }

  return memory.users.find((user) => user.email === String(email).toLowerCase()) || null;
}

export async function getUserById(id) {
  if (isMongoConnected()) {
    const user = await User.findById(id);
    return publicUser(user);
  }

  return publicUser(memory.users.find((user) => user.id === id));
}

export function toPublicUser(user) {
  return publicUser(user);
}

export async function listJobs() {
  if (isMongoConnected()) {
    const jobs = await Job.find().sort({ priority: 1, createdAt: -1 });
    return jobs.map(serializeJob);
  }

  return clone(memory.jobs);
}

export async function createJob(payload) {
  const data = {
    title: payload.title,
    department: payload.department,
    location: payload.location,
    employmentType: payload.employmentType || "Full-time",
    status: payload.status || "Open",
    hiringManager: payload.hiringManager,
    salaryRange: payload.salaryRange || "",
    priority: payload.priority || "Medium",
    skills: splitTags(payload.skills),
    description: payload.description || ""
  };

  if (isMongoConnected()) {
    const job = await Job.create(data);
    return serializeJob(job);
  }

  const job = {
    id: randomUUID(),
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  memory.jobs.unshift(job);
  return clone(job);
}

export async function updateJob(id, payload) {
  const updates = {
    ...payload,
    skills: payload.skills ? splitTags(payload.skills) : undefined
  };

  Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

  if (isMongoConnected()) {
    const job = await Job.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    return serializeJob(job);
  }

  const index = memory.jobs.findIndex((job) => job.id === id);
  if (index === -1) {
    return null;
  }

  memory.jobs[index] = {
    ...memory.jobs[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  return clone(memory.jobs[index]);
}

export async function listCandidates(filters = {}) {
  if (isMongoConnected()) {
    const query = {};

    if (filters.stage && filters.stage !== "All") {
      query.stage = filters.stage;
    }

    if (filters.jobId && filters.jobId !== "All") {
      query.jobId = filters.jobId;
    }

    if (filters.search) {
      query.$or = [
        { name: new RegExp(filters.search, "i") },
        { email: new RegExp(filters.search, "i") },
        { headline: new RegExp(filters.search, "i") },
        { skills: new RegExp(filters.search, "i") }
      ];
    }

    const candidates = await Candidate.find(query).populate("jobId").sort({ updatedAt: -1 });
    return candidates.map(serializeCandidate);
  }

  const search = String(filters.search || "").toLowerCase();
  const candidates = memory.candidates.filter((candidate) => {
    const matchesStage = !filters.stage || filters.stage === "All" || candidate.stage === filters.stage;
    const matchesJob = !filters.jobId || filters.jobId === "All" || candidate.jobId === filters.jobId;
    const haystack = [
      candidate.name,
      candidate.email,
      candidate.headline,
      candidate.location,
      candidate.source,
      candidate.skills.join(" ")
    ]
      .join(" ")
      .toLowerCase();

    return matchesStage && matchesJob && (!search || haystack.includes(search));
  });

  return clone(candidates.map((candidate) => serializeCandidate(candidate)));
}

export async function getCandidate(id) {
  if (isMongoConnected()) {
    const candidate = await Candidate.findById(id).populate("jobId");
    return serializeCandidate(candidate);
  }

  return serializeCandidate(memory.candidates.find((candidate) => candidate.id === id));
}

export async function createCandidate(payload, user) {
  const data = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone || "",
    location: payload.location || "",
    headline: payload.headline,
    source: payload.source || "LinkedIn",
    stage: payload.stage || "Applied",
    rating: Number(payload.rating || 3),
    owner: user?.name || "Priya Shah",
    jobId: payload.jobId || null,
    skills: splitTags(payload.skills),
    salaryExpectation: payload.salaryExpectation || "",
    noticePeriod: payload.noticePeriod || "",
    resumeUrl: payload.resumeUrl || "",
    nextStep: payload.nextStep || "Recruiter follow-up",
    nextStepDueDate: payload.nextStepDueDate || null,
    notes: [],
    timeline: [
      {
        type: "created",
        message: `Candidate added for ${payload.headline}.`
      }
    ]
  };

  if (isMongoConnected()) {
    const candidate = await Candidate.create(data);
    return getCandidate(candidate.id);
  }

  const candidate = {
    id: randomUUID(),
    ...data,
    timeline: data.timeline.map((item) => ({
      id: randomUUID(),
      ...item,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  memory.candidates.unshift(candidate);
  return serializeCandidate(candidate);
}

export async function updateCandidate(id, payload) {
  const updates = {
    ...payload,
    rating: payload.rating ? Number(payload.rating) : undefined,
    skills: payload.skills ? splitTags(payload.skills) : undefined
  };

  Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);

  if (isMongoConnected()) {
    const candidate = await Candidate.findByIdAndUpdate(
      id,
      {
        ...updates,
        $push: {
          timeline: {
            type: "update",
            message: "Candidate profile updated."
          }
        }
      },
      { new: true, runValidators: true }
    ).populate("jobId");

    return serializeCandidate(candidate);
  }

  const index = memory.candidates.findIndex((candidate) => candidate.id === id);
  if (index === -1) {
    return null;
  }

  memory.candidates[index] = {
    ...memory.candidates[index],
    ...updates,
    timeline: [
      {
        id: randomUUID(),
        type: "update",
        message: "Candidate profile updated.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      ...memory.candidates[index].timeline
    ],
    updatedAt: new Date().toISOString()
  };

  return serializeCandidate(memory.candidates[index]);
}

export async function moveCandidate(id, stage) {
  if (!PIPELINE_STAGES.includes(stage)) {
    const error = new Error("Invalid pipeline stage.");
    error.statusCode = 400;
    throw error;
  }

  if (isMongoConnected()) {
    const candidate = await Candidate.findByIdAndUpdate(
      id,
      {
        stage,
        $push: {
          timeline: {
            type: "stage",
            message: `Moved to ${stage}.`
          }
        }
      },
      { new: true, runValidators: true }
    ).populate("jobId");

    return serializeCandidate(candidate);
  }

  const index = memory.candidates.findIndex((candidate) => candidate.id === id);
  if (index === -1) {
    return null;
  }

  memory.candidates[index] = {
    ...memory.candidates[index],
    stage,
    timeline: [
      {
        id: randomUUID(),
        type: "stage",
        message: `Moved to ${stage}.`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      ...memory.candidates[index].timeline
    ],
    updatedAt: new Date().toISOString()
  };

  return serializeCandidate(memory.candidates[index]);
}

export async function addCandidateNote(id, body, user) {
  if (isMongoConnected()) {
    const candidate = await Candidate.findByIdAndUpdate(
      id,
      {
        $push: {
          notes: {
            body,
            author: user?.name || "Recruiter"
          },
          timeline: {
            type: "note",
            message: "Note added."
          }
        }
      },
      { new: true, runValidators: true }
    ).populate("jobId");

    return serializeCandidate(candidate);
  }

  const index = memory.candidates.findIndex((candidate) => candidate.id === id);
  if (index === -1) {
    return null;
  }

  memory.candidates[index] = {
    ...memory.candidates[index],
    notes: [
      {
        id: randomUUID(),
        body,
        author: user?.name || "Recruiter",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      ...memory.candidates[index].notes
    ],
    timeline: [
      {
        id: randomUUID(),
        type: "note",
        message: "Note added.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      ...memory.candidates[index].timeline
    ],
    updatedAt: new Date().toISOString()
  };

  return serializeCandidate(memory.candidates[index]);
}

export async function getMetrics() {
  const [jobs, candidates] = await Promise.all([listJobs(), listCandidates()]);
  const openJobs = jobs.filter((job) => job.status === "Open");
  const hired = candidates.filter((candidate) => candidate.stage === "Hired").length;
  const activeCandidates = candidates.filter((candidate) => !["Hired", "Rejected"].includes(candidate.stage));
  const stageCounts = PIPELINE_STAGES.map((stage) => ({
    stage,
    count: candidates.filter((candidate) => candidate.stage === stage).length
  }));
  const sourceCounts = candidates.reduce((acc, candidate) => {
    acc[candidate.source] = (acc[candidate.source] || 0) + 1;
    return acc;
  }, {});
  const dueSoon = activeCandidates
    .filter((candidate) => candidate.nextStepDueDate)
    .sort((a, b) => new Date(a.nextStepDueDate) - new Date(b.nextStepDueDate))
    .slice(0, 5);
  const recentActivity = candidates
    .flatMap((candidate) =>
      (candidate.timeline || []).map((event) => ({
        ...event,
        candidateId: candidate.id,
        candidateName: candidate.name
      }))
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  return {
    totalCandidates: candidates.length,
    activeCandidates: activeCandidates.length,
    openJobs: openJobs.length,
    hired,
    conversionRate: candidates.length ? Math.round((hired / candidates.length) * 100) : 0,
    averageRating: candidates.length
      ? Number((candidates.reduce((sum, candidate) => sum + Number(candidate.rating || 0), 0) / candidates.length).toFixed(1))
      : 0,
    stageCounts,
    sourceCounts,
    dueSoon,
    recentActivity
  };
}
