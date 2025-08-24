import mongoose from "mongoose";

const seekerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true, 
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      company: { type: String },
      role: { type: String },
      description: { type: String },
      startDate: { type: Date },
      endDate: { type: Date }, 
    },
    experienceYears: {
      type: Number,
      default: 0,
    },
    education: [
      {
        degree: { type: String },
        institution: { type: String },
        startYear: { type: Number },
        endYear: { type: Number },
      },
    ],
    resumeUrl: {
      type: String, 
    },
    appliedJobs: [
      {
        jobId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "job",
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["applied", "under_review", "rejected", "accepted"],
          default: "applied",
        },
      },
    ],
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "job",
      },
    ]
  },
  { timestamps: true }
);

const Seeker = mongoose.model("seeker", seekerSchema);

export default Seeker;