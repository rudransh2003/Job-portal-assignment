import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = `${import.meta.env.VITE_SERVER_URL}/seeker/profile`;

// Helper function to check if profile is complete
const isProfileComplete = (profile) => {
    if (!profile) return false;
    
    // Check if essential fields are filled
    const hasSkills = profile.skills && profile.skills.length > 0;
    const hasExperience = profile.experience && profile.experience.company && profile.experience.role;
    const hasExperienceYears = profile.experienceYears !== undefined && profile.experienceYears >= 0;
    
    return hasSkills && hasExperience && hasExperienceYears;
};

export const fetchProfile = createAsyncThunk(
  "seeker/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      // Handle 404 specifically - profile doesn't exist yet
      if (err.response?.status === 404) {
        return null; // Return null instead of rejecting for 404
      }
      return rejectWithValue(err.response?.data || { message: "Failed to fetch profile" });
    }
  }
);

// Create profile
export const createProfile = createAsyncThunk(
  "seeker/createProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API}`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to create profile" });
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  "seeker/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${API}`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to update profile" });
    }
  }
);

const seekerProfileSlice = createSlice({
  name: "seekerProfile",
  initialState: {
    profile: null,
    loading: false,
    error: null,
    profileExists: false,
    profileComplete: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => { 
        state.loading = false; 
        state.profile = action.payload;
        state.profileExists = action.payload !== null;
        state.profileComplete = isProfileComplete(action.payload);
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload;
        state.profileExists = false;
        state.profileComplete = false;
      })
      
      // Create profile
      .addCase(createProfile.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => { 
        state.loading = false; 
        state.profile = action.payload;
        state.profileExists = true;
        state.profileComplete = isProfileComplete(action.payload);
        state.error = null;
      })
      .addCase(createProfile.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload;
      })
      
      // Update profile
      .addCase(updateProfile.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => { 
        state.loading = false; 
        state.profile = action.payload;
        state.profileComplete = isProfileComplete(action.payload);
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload;
      });
  },
});

export const { clearError } = seekerProfileSlice.actions;
export default seekerProfileSlice.reducer;