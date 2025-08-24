
import employerModel from '../models/employer.model.js'
import jobModel from '../models/job.model.js'
import { validationResult } from 'express-validator'
import * as employerService from '../services/employer.service.js'

export const createProfile = async(req, res) =>{
    console.log(req.body)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        const userId = req.user._id
        const profile = await employerService.createProfileService(userId, req.body)
        if(profile){
            res.status(201).json(profile);
        }else{
            res.status(500).send("Profile not created")
        }
    }catch(err){
        res.status(400).json({ error: err.message });
    }
}

export const getProfile = async(req, res) => {
    try{
        const userId = req.user._id;
        const profile = await employerModel.findOne({ userId }).populate("postedJobs");
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        res.status(200).json(profile);
    }catch(err){
        res.status(400).json({error: err.message})
    }
}

export const updateProfile = async (req, res) => {
    try {
      const userId = req.user._id;
      const updated = await employerModel.findOneAndUpdate(
        { userId },
        { $set: req.body },
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: "Profile not found" });
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };