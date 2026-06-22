import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    department: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Contract", "Internship", "Part-time"],
      default: "Full-time"
    },
    status: {
      type: String,
      enum: ["Open", "Paused", "Closed"],
      default: "Open"
    },
    hiringManager: {
      type: String,
      required: true,
      trim: true
    },
    salaryRange: {
      type: String,
      trim: true
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium"
    },
    skills: {
      type: [String],
      default: []
    },
    description: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
