  import mongoose from "mongoose";

  const employerSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true, 
      },

      companyName: {
        type: String,
        required: true,
        trim: true,
      },

      companyProfile: {
        type: String,
        trim: true,
      },

      companyWebsite: {
        type: String,
        trim: true,
      },

      location: {
        type: String,
        trim: true,
      },

      contactEmail: {
        type: String,
        trim: true,
        lowercase: true,
      },

      postedJobs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "job",
        },
      ],
    },
    { timestamps: true }
  );

  const Employer = mongoose.model("employer", employerSchema);

  export default Employer;