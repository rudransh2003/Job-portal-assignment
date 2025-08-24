import jobModel from '../models/job.model.js'
import employerModel from '../models/employer.model.js'

export const createJobService = async (userId, jobData) => {
    const employer = await employerModel.findOne({ userId });
    if (!employer) {
      throw new Error("Employer profile not found"); // ❌ no res here, just throw
    }
  
    const job = await jobModel.create({
      employerId: employer._id,
      ...jobData,
    });
  
    employer.postedJobs.push(job._id);
    await employer.save();
  
    return job;
  };
  