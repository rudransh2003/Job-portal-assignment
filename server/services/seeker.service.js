import seekerModel from "../models/seeker.model.js";

export const createProfileService = async (userId, profileData) => {
  const existingProfile = await seekerModel.findOne({ userId });
  if (existingProfile) {
    throw new Error("Profile already exists");
  }
  const profile = await seekerModel.create({
    userId,
    ...profileData,
  });

  return profile;
};