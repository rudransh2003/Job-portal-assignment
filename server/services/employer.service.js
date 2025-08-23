import employerModel from '../models/employer.model.js'

export const createProfileService = async (
    userId, profileData
) => {
    const existingProfile = await employerModel.findOne({ userId });
    if (existingProfile) {
        throw new Error("Profile already exists");
    }
    const profile = await employerModel.create({
        userId,
        ...profileData,
      });
    
      return profile;
}