import { validationResult } from 'express-validator'
import * as jobService from '../services/job.services.js'
import employerModel from '../models/employer.model.js'
import jobModel from '../models/job.model.js'

export const createJob = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const employerId = req.user._id;
        const job = await jobService.createJobService(employerId, req.body)
        res.status(201).json(job);
    } catch (err) {
        res.status(400).json({ errors: err.message })
    }
}

export const getEmployerJobs = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const employerId = req.user._id;
        const employer = await employerModel.findOne({ userId: employerId }).populate("postedJobs");
        if (!employer) return res.status(404).json({ message: "Employer not found" });
        res.status(200).json(employer.postedJobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateJob = async (req, res) => {
    try {
        console.log("Update Body:", req.body);  // debug log

        const { jobId } = req.params;
        const job = await jobModel.findByIdAndUpdate(
            jobId,
            { $set: req.body }, // ensure overwrite only specific fields
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