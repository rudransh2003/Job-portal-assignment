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
            return res.status(200).json(null);
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
        const seekerId = req.user._id; 
        const seeker = await seekerModel.findOne({ userId: seekerId });

        if (!seeker) {
            const { keyword, location, jobType, minSalary, maxSalary } = req.query;
            let filters = {};

            if (keyword) {
                filters.$or = [
                    { title: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
                    { company: { $regex: keyword, $options: "i" } },
                ];
            }

            if (location) {
                filters.location = { $regex: location, $options: "i" };
            }

            if (jobType) {
                filters.jobType = jobType;
            }

            if (minSalary || maxSalary) {
                filters.salary = {};
                if (minSalary) filters.salary.$gte = Number(minSalary);
                if (maxSalary) filters.salary.$lte = Number(maxSalary);
            }

            const jobs = await jobModel.find(filters).sort({ createdAt: -1 });
            return res.status(200).json(jobs);
        }

        const appliedJobIds = seeker.appliedJobs.map((aj) => aj.jobId.toString());
        const savedJobIds = seeker.savedJobs.map((jobId) => jobId.toString());

        const excludedJobIds = [...appliedJobIds, ...savedJobIds];

        const { keyword, location, jobType, minSalary, maxSalary } = req.query;
        let filters = {};

        if (keyword) {
            filters.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { company: { $regex: keyword, $options: "i" } },
            ];
        }

        if (location) {
            filters.location = { $regex: location, $options: "i" };
        }

        if (jobType) {
            filters.jobType = jobType;
        }

        if (minSalary || maxSalary) {
            filters.salary = {};
            if (minSalary) filters.salary.$gte = Number(minSalary);
            if (maxSalary) filters.salary.$lte = Number(maxSalary);
        }

        filters._id = { $nin: excludedJobIds };

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

        const job = await jobModel.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found" });

        const seeker = await seekerModel.findOne({ userId: userId });
        if (!seeker) return res.status(404).json({ message: "Seeker profile not found" });

        const alreadyApplied = seeker.appliedJobs.some(
            (appliedJob) => appliedJob.jobId.toString() === jobId
        );
        
        if (alreadyApplied) {
            return res.status(400).json({ message: "Already applied to this job" });
        }

        seeker.appliedJobs.push({
            jobId: jobId,
            appliedAt: new Date()
        });

        seeker.savedJobs = seeker.savedJobs.filter(savedJobId => savedJobId.toString() !== jobId);

        await seeker.save();

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

        if (seeker.savedJobs.includes(jobId)) {
            return res.status(400).json({ message: "Job already saved" });
        }

        const alreadyApplied = seeker.appliedJobs.some(
            (appliedJob) => appliedJob.jobId.toString() === jobId
        );
        
        if (alreadyApplied) {
            return res.status(400).json({ message: "Cannot save job you've already applied to" });
        }

        seeker.savedJobs.push(jobId);
        await seeker.save();

        res.status(200).json({ message: "Job saved successfully", job });
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
            return res.status(200).json([]);
        }

        const appliedJobs = seeker.appliedJobs
            .filter(aj => aj.jobId)
            .map(aj => ({
                ...aj.jobId._doc, 
                appliedAt: aj.appliedAt,
            }));

        res.status(200).json(appliedJobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getSavedJobs = async (req, res) => {
    try {
        const seekerId = req.user._id;
        const seeker = await seekerModel.findOne({ userId: seekerId }).populate({
            path: "savedJobs",
            model: "job",
        });

        if (!seeker) {
            return res.status(200).json([]);
        }

        res.status(200).json(seeker.savedJobs);
    } catch (err) {
        console.error("Error fetching saved jobs:", err);
        res.status(500).json({ error: err.message });
    }
};

export const unsaveJob = async (req, res) => {
    try {
        const seekerId = req.user._id;
        const { jobId } = req.params;

        const seeker = await seekerModel.findOne({ userId: seekerId });
        if (!seeker) return res.status(404).json({ message: "Seeker profile not found" });

        seeker.savedJobs = seeker.savedJobs.filter(id => id.toString() !== jobId);
        await seeker.save();

        res.status(200).json({ message: "Job unsaved successfully" });
    } catch (err) {
        console.error("Error unsaving job:", err);
        res.status(500).json({ error: err.message });
    }
};