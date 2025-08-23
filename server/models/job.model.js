import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employer",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    salary: {
      type: Number,
    },

    experience: {
      type: String, 
    },

    skills: {
      type: [String],
      default: [],
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Remote"],
      required: true,
    },

    applications: [
      {
        seekerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "seeker",
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

    date_posted: {
      type: Date,
      default: Date.now,
    },

    expiry_date: {
      type: Date,
      required: true, 
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("job", jobSchema);

export default Job;