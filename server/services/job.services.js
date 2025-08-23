import jobModel from '../models/job.model.js'
import employerModel from '../models/employer.model.js'

export const createJobService = async(employerId, jobData) => {
    const employer = await employerModel.findOne({ userId: employerId });
    if (!employer) {
        return res.status(400).json({ message: "Employer profile not found" });
    }
    const job = await jobModel.create({
        employerId : employer._id,
        ...jobData
    })
    employer.postedJobs.push(job._id);
    await employer.save();
    return job
}