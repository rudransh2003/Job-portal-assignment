import userModel from "../models/user.model.js";
import seekerModel from "../models/seeker.model.js";
import employerModel from "../models/employer.model.js";
import jobModel from "../models/job.model.js";

// Middleware to check if user is super admin
export const requireSuperAdmin = async (req, res, next) => {
    try {
        const userId = req.user.id; // from JWT middleware
        const user = await userModel.findById(userId);
        
        if (!user || user.role !== 'admin' || !user.isSuperAdmin) {
            return res.status(403).json({ 
                error: "Access denied. Super admin privileges required." 
            });
        }
        
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- Manage Users ---
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}, "-password");
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const banUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Prevent banning the super admin
        if (user.isSuperAdmin) {
            return res.status(403).json({ error: "Cannot ban the super admin" });
        }

        // Delete user from db
        await userModel.findByIdAndDelete(userId);

        // Also delete seeker/employer profile if exists
        await seekerModel.deleteOne({ userId });
        await employerModel.deleteOne({ userId });

        res.status(200).json({ message: "User banned and deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- Manage Jobs ---
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await jobModel.find({})
            .populate({
                path: 'employerId', // 1. Populate the employer document
                populate: {
                    path: 'userId', // 2. From the employer, populate the user document
                    select: 'name email' // 3. Select only the name and email from the user
                }
            });
            
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const removeJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await jobModel.findById(jobId);
        if (!job) return res.status(404).json({ error: "Job not found" });

        await jobModel.findByIdAndDelete(jobId);
        res.status(200).json({ message: "Job removed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- View Statistics ---
export const getStatistics = async (req, res) => {
    try {
        const totalJobs = await jobModel.countDocuments({});
        const totalApplications = await seekerModel.aggregate([
            { $unwind: "$appliedJobs" },
            { $count: "totalApplications" }
        ]);
        const totalUsers = await userModel.countDocuments({});

        res.status(200).json({
            totalJobs,
            totalApplications: totalApplications[0]?.totalApplications || 0,
            totalUsers
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};