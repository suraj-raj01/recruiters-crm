import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const timelineSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["created", "stage", "note", "update"],
      default: "update"
    },
    message: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    headline: {
      type: String,
      required: true,
      trim: true
    },
    source: {
      type: String,
      enum: ["LinkedIn", "Referral", "Naukri", "Indeed", "Portfolio", "Inbound", "Other","Apna","WorkIndia"],
      default: "LinkedIn"
    },
    stage: {
      type: String,
      enum: ["Applied", "Screen", "Interview", "Offer", "Hired", "Rejected"],
      default: "Applied"
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    owner: {
      type: String,
      default: "Priya Shah"
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job"
    },
    skills: {
      type: [String],
      default: []
    },
    salaryExpectation: {
      type: String,
      trim: true
    },
    noticePeriod: {
      type: String,
      trim: true
    },
    resumeUrl: {
      type: String,
      trim: true
    },
    nextStep: {
      type: String,
      default: "Recruiter follow-up"
    },
    nextStepDueDate: {
      type: Date
    },
    notes: {
      type: [noteSchema],
      default: []
    },
    timeline: {
      type: [timelineSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;
