import { validationResult } from 'express-validator'
import * as jobService from '../services/job.services.js'
import employerModel from '../models/employer.model.js'
import jobModel from '../models/job.model.js'

export const createJob = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const job = await jobService.createJobService(req.user._id, req.body);
      res.status(201).json(job);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  

  export const getEmployerJobs = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const employerId = req.user._id;
        
        const employer = await employerModel.findOne({ userId: employerId }).populate("postedJobs");
        
        if (!employer) {
            return res.status(200).json([]);
        }
        
        res.status(200).json(employer.postedJobs || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateJob = async (req, res) => {
    try {
        console.log("Update Body:", req.body);

        const { jobId } = req.params;
        const job = await jobModel.findByIdAndUpdate(
            jobId,
            { $set: req.body }, 
            { new: true, runValidators: true }
        );

        if (!job) return res.status(404).json({ message: "Job not found" });

        res.status(200).json(job);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await jobModel.findByIdAndDelete(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });
        await employerModel.findByIdAndUpdate(job.employerId, {
            $pull: { postedJobs: job._id },
        });
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getApplicantsForJob = async (req, res) => {
    try {
      const { jobId } = req.params;
      
      const job = await jobModel.findById(jobId)
        .populate({
          path: "applications.seekerId",
          model: "seeker", 
          populate: {
            path: "userId",
            model: "user",
            select: "name email phone", 
          },
        });
  
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
  
      res.json(job.applications); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

export const updateApplicationStatus = async (req, res) => {
    try {
        const { jobId, seekerId } = req.params;
        const { status } = req.body; 

        const job = await jobModel.findOneAndUpdate(
            { _id: jobId, "applications.seekerId": seekerId },
            { $set: { "applications.$.status": status } },
            { new: true }
        ).populate("applications.seekerId", "name email");

        if (!job) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.status(200).json({ message: "Status updated", job });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
