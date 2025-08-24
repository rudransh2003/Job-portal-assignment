import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = `${import.meta.env.VITE_SERVER_URL}/seeker`;

export const fetchJobs = createAsyncThunk(
  "seeker/fetchJobs",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const query = new URLSearchParams(filters).toString();

      const res = await axios.get(`${API_BASE}/view-jobs?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching jobs");
    }
  }
);

export const applyJob = createAsyncThunk(
  "seeker/applyJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/apply/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      return { jobId, data: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to apply job");
    }
  }
);

export const saveJob = createAsyncThunk(
  "seeker/saveJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/save/${jobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to save job");
    }
  }
);

export const fetchAppliedJobs = createAsyncThunk(
  "seeker/fetchAppliedJobs",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/applied-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Applied jobs response:", res.data); // Debug log
      return res.data;
    } catch (err) {
      console.error("Error fetching applied jobs:", err.response?.data);
      return rejectWithValue(err.response?.data || "Error fetching applied jobs");
    }
  }
);

const seekerJobSlice = createSlice({
  name: "seeker",
  initialState: {
    jobs: [],
    appliedJobs: [],
    savedJobs: [],
    loading: false,
    error: null,
    profileComplete: false,
  },
  reducers: {
    setProfileComplete: (state, action) => {
      state.profileComplete = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
        state.loading = false;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch jobs";
      })
      
      // Apply job cases
      .addCase(applyJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyJob.fulfilled, (state, action) => {
        state.loading = false;
        const jobId = action.payload.jobId;
        
        // Find the job in the current list
        const appliedJob = state.jobs.find(job => job._id === jobId);
        
        if (appliedJob) {
          // Add to applied jobs list with appliedAt timestamp
          const appliedJobWithStatus = {
            ...appliedJob,
            appliedAt: new Date().toISOString()
          };
          
          // Check if already in applied jobs to avoid duplicates
          const alreadyInApplied = state.appliedJobs.some(job => job._id === jobId);
          if (!alreadyInApplied) {
            state.appliedJobs.push(appliedJobWithStatus);
          }

          // Remove from available jobs list immediately
          state.jobs = state.jobs.filter(job => job._id !== jobId);
        }
      })
      .addCase(applyJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to apply to job";
      })
      
      // Fetch applied jobs cases
      .addCase(fetchAppliedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppliedJobs.fulfilled, (state, action) => {
        state.loading = false;
        // The controller returns an array of jobs with appliedAt field
        state.appliedJobs = action.payload;
        console.log("Applied jobs set to:", action.payload); // Debug log
      })
      .addCase(fetchAppliedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch applied jobs";
        console.error("Fetch applied jobs error:", action.payload);
      })
      
      // Save job cases
      .addCase(saveJob.pending, (state) => {
        state.error = null;
      })
      .addCase(saveJob.fulfilled, (state, action) => {
        // Add to saved jobs but keep in main jobs list
        state.savedJobs.push(action.payload);
      })
      .addCase(saveJob.rejected, (state, action) => {
        state.error = action.payload || "Failed to save job";
      });
  },
});

export const { setProfileComplete, clearError } = seekerJobSlice.actions;
export default seekerJobSlice.reducer;