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
          },
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
          },
        }
      );
      return res.data.job;
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
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching applied jobs");
    }
  }
);

export const fetchSavedJobs = createAsyncThunk(
  "seeker/fetchSavedJobs",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/saved-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching saved jobs");
    }
  }
);

export const unsaveJob = createAsyncThunk(
  "seeker/unsaveJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/unsave/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return jobId;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to unsave job");
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

      .addCase(applyJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyJob.fulfilled, (state, action) => {
        state.loading = false;
        const jobId = action.payload.jobId;
      
        let appliedJob = state.jobs.find(job => job._id === jobId);
        
        if (!appliedJob) {
          appliedJob = state.savedJobs.find(job => job._id === jobId);
        }
      
        if (appliedJob) {
          const appliedJobWithStatus = {
            ...appliedJob,
            appliedAt: new Date().toISOString()
          };
      
          const alreadyInApplied = state.appliedJobs.some(job => job._id === jobId);
          if (!alreadyInApplied) {
            state.appliedJobs.push(appliedJobWithStatus);
          }
        }
      
        state.jobs = state.jobs.filter(job => job._id !== jobId);
        state.savedJobs = state.savedJobs.filter(job => job._id !== jobId);
      })      
      .addCase(applyJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to apply to job";
      })

      .addCase(fetchAppliedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppliedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedJobs = action.payload;
      })
      .addCase(fetchAppliedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch applied jobs";
      })

      .addCase(saveJob.pending, (state) => {
        state.error = null;
      })
      .addCase(saveJob.fulfilled, (state, action) => {
        const job = action.payload;
      
        const alreadyApplied = state.appliedJobs.some(j => j._id === job._id);
        if (alreadyApplied) return;
      
        const alreadySaved = state.savedJobs.some(j => j._id === job._id);
        if (!alreadySaved) {
          state.savedJobs.push(job);
        }

        state.jobs = state.jobs.filter(j => j._id !== job._id);
      })      
      .addCase(saveJob.rejected, (state, action) => {
        state.error = action.payload || "Failed to save job";
      })

      .addCase(fetchSavedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.savedJobs = action.payload;
      })
      .addCase(fetchSavedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch saved jobs";
      })

      .addCase(unsaveJob.fulfilled, (state, action) => {
        const jobId = action.payload;
        state.savedJobs = state.savedJobs.filter(job => job._id !== jobId);
      })
      .addCase(unsaveJob.rejected, (state, action) => {
        state.error = action.payload || "Failed to unsave job";
      });
  },
});

export const { setProfileComplete, clearError } = seekerJobSlice.actions;
export default seekerJobSlice.reducer;