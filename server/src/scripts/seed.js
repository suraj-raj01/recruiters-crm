import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDatabase, isMongoConnected } from "../config/database.js";
import Candidate from "../models/Candidate.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import { createInitialState } from "../data/mockData.js";

dotenv.config();

await connectDatabase();

if (!isMongoConnected()) {
  console.error("Set MONGODB_URI in server/.env before running the seed script.");
  process.exit(1);
}

const { users, jobs, candidates } = createInitialState();

await Promise.all([User.deleteMany({}), Job.deleteMany({}), Candidate.deleteMany({})]);

const createdUsers = await Promise.all(
  users.map(async (user) =>
    User.create({
      name: user.name,
      email: user.email,
      passwordHash: await User.hashPassword(user.password),
      role: user.role,
      avatarColor: user.avatarColor
    })
  )
);

const jobMap = new Map();
for (const job of jobs) {
  const { id, ...payload } = job;
  const created = await Job.create(payload);
  jobMap.set(id, created);
}

for (const candidate of candidates) {
  const { id, jobId, ...payload } = candidate;
  await Candidate.create({
    ...payload,
    jobId: jobMap.get(jobId)?._id
  });
}

console.log(`Seeded ${createdUsers.length} user, ${jobs.length} jobs, and ${candidates.length} candidates.`);

await mongoose.disconnect();
