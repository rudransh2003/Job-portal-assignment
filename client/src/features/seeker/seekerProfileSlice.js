import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = `${import.meta.env.VITE_SERVER_URL}/seeker/profile`;

const isProfileComplete = (profile) => {
    if (!profile) return false;
    
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
      if (err.response?.status === 404) {
        return null; 
      }
      return rejectWithValue(err.response?.data || { message: "Failed to fetch profile" });
    }
  }
);

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
    hasShownIncompleteAlert: false, 
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    markAlertAsShown: (state) => {
      state.hasShownIncompleteAlert = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => { 
        state.loading = false; 
        state.profile = action.payload;
        state.profileExists = action.payload !== null;
        const previouslyComplete = state.profileComplete;
        state.profileComplete = isProfileComplete(action.payload);
        state.error = null;
        
        if (state.profileComplete !== previouslyComplete) {
          state.hasShownIncompleteAlert = false;
        }
      })
      .addCase(fetchProfile.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload;
        state.profileExists = false;
        state.profileComplete = false;
      })
      
      .addCase(createProfile.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => { 
        state.loading = false; 
        state.profile = action.payload;
        state.profileExists = true;
        const previouslyComplete = state.profileComplete;
        state.profileComplete = isProfileComplete(action.payload);
        state.error = null;
        
        if (state.profileComplete || (previouslyComplete && !state.profileComplete)) {
          state.hasShownIncompleteAlert = false;
        }
      })
      .addCase(createProfile.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload;
      })
      
      .addCase(updateProfile.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => { 
        state.loading = false; 
        state.profile = action.payload;
        const previouslyComplete = state.profileComplete;
        state.profileComplete = isProfileComplete(action.payload);
        state.error = null;
        
        if (state.profileComplete || (previouslyComplete && !state.profileComplete)) {
          state.hasShownIncompleteAlert = false;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload;
      });
  },
});

export const { clearError, markAlertAsShown } = seekerProfileSlice.actions;
export default seekerProfileSlice.reducer;