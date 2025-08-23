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
        const userId = req.user.id;
        const profile = await seekerService.createProfileService(userId, req.body);
        res.status(201).json(profile);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const getProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const userId = req.user._id;
        console.log({ userId })
        const profile = await seekerModel.findOne({ userId }).populate("appliedJobs.jobId");
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.status(200).json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const userId = req.user._id
        const updatedProfile = await seekerModel.findOneAndUpdate(
            { userId },
            { $set: req.body }, 
            { new: true }
        )
        if (!updatedProfile) {
            return res.status(404).json({ message: "Profile not found" });
          }
        res.status(200).json(updatedProfile);
    } catch (err) {
        res.status(500).json({error : err.message})
    }   
}

export const viewJobs = async (req, res) => {
  try {
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

    // Query DB
    const jobs = await jobModel.find(filters).sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
