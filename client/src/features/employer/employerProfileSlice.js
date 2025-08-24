import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = `${import.meta.env.VITE_SERVER_URL}/employer/profile`;

const isProfileComplete = (profile) => {
    if (!profile) return false;
    
    const hasCompanyName = profile.companyName && profile.companyName.trim();
    
    return hasCompanyName; 
};

export const fetchEmployerProfile = createAsyncThunk(
  "employer/fetchProfile",
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

export const createEmployerProfile = createAsyncThunk(
  "employer/createProfile",
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

export const updateEmployerProfile = createAsyncThunk(
  "employer/updateProfile",
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

const employerProfileSlice = createSlice({
  name: "employerProfile",
  initialState: {
    profile: null,
    loading: false,
    error: null,
    profileExists: false,
    profileComplete: null, 
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployerProfile.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(fetchEmployerProfile.fulfilled, (state, action) => { 
        state.loading = false; 
        state.profile = action.payload;
        state.profileExists = action.payload !== null;
        state.profileComplete = action.payload !== null ? isProfileComplete(action.payload) : false;
        state.error = null; 
      })
      .addCase(fetchEmployerProfile.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload;
      })
      
      .addCase(createEmployerProfile.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(createEmployerProfile.fulfilled, (state, action) => { 
        state.loading = false; 
        state.profile = action.payload;
        state.profileExists = true;
        state.profileComplete = isProfileComplete(action.payload);
        state.error = null;
      })
      .addCase(createEmployerProfile.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload;
      })
      
      .addCase(updateEmployerProfile.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(updateEmployerProfile.fulfilled, (state, action) => { 
        state.loading = false; 
        state.profile = action.payload;
        state.profileComplete = isProfileComplete(action.payload);
        state.error = null;
      })
      .addCase(updateEmployerProfile.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload;
      });
  },
});

export const { clearError } = employerProfileSlice.actions;
export default employerProfileSlice.reducer;