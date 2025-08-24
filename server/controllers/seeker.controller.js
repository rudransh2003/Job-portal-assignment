import seekerModel from '../models/seeker.model.js'
import jobModel from '../models/job.model.js'
import { validationResult } from 'express-validator'
import * as seekerService from "../services/seeker.service.js";

export const createProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {

        const userId = req.user._id || req.user.id;
        console.log('Creating profile for userId:', userId);
        const profile = await seekerService.createProfileService(userId, req.body);
        res.status(201).json(profile);
    } catch (err) {
        console.error('Error creating profile:', err);
        res.status(400).json({ error: err.message });
    }
};

export const getProfile = async (req, res) => {
    try {

        const userId = req.user._id || req.user.id;
        console.log('Fetching profile for userId:', userId);

        const profile = await seekerModel.findOne({ userId }).populate("appliedJobs.jobId");

        if (!profile) {
            console.log('No profile found for userId:', userId);
            return res.status(404).json({ message: "Profile not found" });
        }

        console.log('Profile found:', profile);
        res.status(200).json(profile);
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ error: err.message });
    }
};

export const updateProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {

        const userId = req.user._id || req.user.id;
        console.log('Updating profile for userId:', userId);

        const updatedProfile = await seekerModel.findOneAndUpdate(
            { userId },
            { $set: req.body },
            { new: true }
        );

        if (!updatedProfile) {
            console.log('No profile found to update for userId:', userId);
            return res.status(404).json({ message: "Profile not found" });
        }

        console.log('Profile updated:', updatedProfile);
        res.status(200).json(updatedProfile);
    } catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ error: err.message });
    }
};

export const viewJobs = async (req, res) => {
    try {
        const seekerId = req.user._id; // from JWT auth middleware
        const seeker = await seekerModel.findOne({ userId: seekerId });

        if (!seeker) {
            return res.status(404).json({ message: "Seeker profile not found" });
        }

        // Get all applied job IDs for this seeker
        const appliedJobIds = seeker.appliedJobs.map((aj) => aj.jobId.toString());

        const { keyword, location, jobType, minSalary, maxSalary } = req.query;
        let filters = {};

        // Keyword search (title, description, company)
        if (keyword) {
            filters.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { company: { $regex: keyword, $options: "i" } },
            ];
        }

        // Location filter
        if (location) {
            filters.location = { $regex: location, $options: "i" };
        }

        // Job Type filter
        if (jobType) {
            filters.jobType = jobType;
        }

        // Salary range filter
        if (minSalary || maxSalary) {
            filters.salary = {};
            if (minSalary) filters.salary.$gte = Number(minSalary);
            if (maxSalary) filters.salary.$lte = Number(maxSalary);
        }

        // Exclude applied jobs
        filters._id = { $nin: appliedJobIds };

        // Query DB
        const jobs = await jobModel.find(filters).sort({ createdAt: -1 });

        res.status(200).json(jobs);
    } catch (err) {
        console.error("Error fetching jobs:", err);
        res.status(500).json({ error: err.message });
    }
};

export const applyToJob = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { jobId } = req.params;

        // Check if job exists
        const job = await jobModel.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        // Find seeker profile
        const seeker = await seekerModel.findOne({ userId: userId });
        if (!seeker) return res.status(404).json({ message: "Seeker profile not found" });

        // Check if already applied
        const alreadyApplied = seeker.appliedJobs.some(
            (appliedJob) => appliedJob.jobId.toString() === jobId
        );
        
        if (alreadyApplied) {
            return res.status(400).json({ message: "Already applied to this job" });
        }

        // Add to seeker's applied jobs
        seeker.appliedJobs.push({
            jobId: jobId,
            appliedAt: new Date()
        });
        await seeker.save();

        // Also add to job's applications array (for employer to see)
        job.applications.push({ seekerId: seeker._id });
        await job.save();

        res.status(200).json({ message: "Job applied successfully" });

    } catch (err) {
        console.error("Error in applyToJob:", err);
        res.status(500).json({ error: err.message });
    }
};

export const saveJob = async (req, res) => {
    try {
        const seekerId = req.user._id;
        const { jobId } = req.params;

        const job = await jobModel.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        const seeker = await seekerModel.findOne({ userId: seekerId });
        if (!seeker) return res.status(404).json({ message: "Seeker profile not found" });

        // check if already saved
        if (seeker.savedJobs.includes(jobId)) {
            return res.status(400).json({ message: "Job already saved" });
        }

        seeker.savedJobs.push(jobId);
        await seeker.save();

        res.status(200).json({ message: "Job saved successfully", seeker });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const seekerId = req.user._id;
        const seeker = await seekerModel.findOne({ userId: seekerId }).populate({
            path: "appliedJobs.jobId",
            model: "job",
        });

        if (!seeker) {
            return res.status(404).json({ message: "Seeker profile not found" });
        }

        const appliedJobs = seeker.appliedJobs.map((aj) => ({
            ...aj.jobId._doc, // spread job fields
            appliedAt: aj.appliedAt,
        }));

        res.status(200).json(appliedJobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};