import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = `${import.meta.env.VITE_SERVER_URL}/employer`;

export const fetchEmployerJobs = createAsyncThunk(
  "employerJobs/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/my-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to fetch jobs" });
    }
  }
);

export const createJob = createAsyncThunk(
  "employerJobs/createJob",
  async (jobData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API}/create-job`, jobData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to create job" });
    }
  }
);

export const updateJob = createAsyncThunk(
  "employerJobs/updateJob",
  async ({ jobId, jobData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`${API}/update-job/${jobId}`, jobData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to update job" });
    }
  }
);


export const deleteJob = createAsyncThunk(
  "employerJobs/deleteJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${API}/delete-job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { jobId, message: res.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to delete job" });
    }
  }
);

export const fetchApplicantsForJob = createAsyncThunk(
  "employerJobs/fetchApplicantsForJob",
  async (jobId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/${jobId}/applicants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to fetch applicants" });
    }
  }
);

export const updateApplicantStatus = createAsyncThunk(
  "employerJobs/updateApplicantStatus",
  async ({ jobId, seekerId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API}/${jobId}/applicants/${seekerId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to update status" });
    }
  }
);

const employerJobsSlice = createSlice({
  name: "employerJobs",
  initialState: {
    jobs: [],
    loading: false,
    error: null,
    selectedJob: null,
    applicants: [], 
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload;
    },
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployerJobs.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(fetchEmployerJobs.fulfilled, (state, action) => { 
        state.loading = false; 
        state.jobs = action.payload;
        state.error = null;
      })
      .addCase(fetchEmployerJobs.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload;
      })
      
      .addCase(createJob.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => { 
        state.loading = false; 
        state.jobs.push(action.payload);
        state.error = null;
      })
      .addCase(createJob.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload;
      })
      
      .addCase(updateJob.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => { 
        state.loading = false; 
        const index = state.jobs.findIndex(job => job._id === action.payload._id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateJob.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload;
      })
      
      .addCase(deleteJob.pending, (state) => { 
        state.loading = true; 
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => { 
        state.loading = false; 
        state.jobs = state.jobs.filter(job => job._id !== action.payload.jobId);
        state.error = null;
      })
      .addCase(deleteJob.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload;
      })
      .addCase(fetchApplicantsForJob.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.applicants = [];
      })
      .addCase(fetchApplicantsForJob.fulfilled, (state, action) => {
        state.loading = false;
        state.applicants = action.payload; 
      })
      .addCase(fetchApplicantsForJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    
      .addCase(updateApplicantStatus.fulfilled, (state, action) => {
        const updatedJob = action.payload.job;
        if (state.selectedJob && state.selectedJob._id === updatedJob._id) {
          state.applicants = updatedJob.applications;
        }
      })
      .addCase(updateApplicantStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, setSelectedJob, clearSelectedJob } = employerJobsSlice.actions;
export default employerJobsSlice.reducer;