import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/admin`;

const createAxiosConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

export const fetchAllJobs = createAsyncThunk(
  "admin/fetchAllJobs",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/getAllJobs`, createAxiosConfig(auth.token));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.response?.data?.message || "Failed to fetch jobs"
      );
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/getAllUsers`, createAxiosConfig(auth.token));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const fetchStatistics = createAsyncThunk(
  "admin/fetchStatistics",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/statistics`, createAxiosConfig(auth.token));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.response?.data?.message || "Failed to fetch statistics"
      );
    }
  }
);

export const removeJob = createAsyncThunk(
  "admin/removeJob",
  async (jobId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.delete(`${API_URL}/removeJob/${jobId}`, createAxiosConfig(auth.token));
      return { jobId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.response?.data?.message || "Failed to remove job"
      );
    }
  }
);

export const banUser = createAsyncThunk(
  "admin/banUser",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.patch(`${API_URL}/banUser/${userId}`, {}, createAxiosConfig(auth.token));
      return { userId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || error.response?.data?.message || "Failed to ban user"
      );
    }
  }
);

const initialState = {
  jobs: [],
  users: [],
  statistics: {
    totalJobs: 0,
    totalUsers: 0,
    totalApplications: 0,
  },
  loading: {
    jobs: false,
    users: false,
    statistics: false,
  },
  error: null,
  lastUpdated: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      const { type, value } = action.payload;
      state.loading[type] = value;
    },
  },
  extraReducers: (builder) => {
  
    builder
      .addCase(fetchAllJobs.pending, (state) => {
        state.loading.jobs = true;
        state.error = null;
      })
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.loading.jobs = false;
        state.jobs = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAllJobs.rejected, (state, action) => {
        state.loading.jobs = false;
        state.error = action.payload;
      });

 
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading.users = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading.users = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading.users = false;
        state.error = action.payload;
      });

   
    builder
      .addCase(fetchStatistics.pending, (state) => {
        state.loading.statistics = true;
        state.error = null;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.loading.statistics = false;
        state.statistics = action.payload;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.loading.statistics = false;
        state.error = action.payload;
      });

   
    builder
      .addCase(removeJob.pending, (state) => {
        state.error = null;
      })
      .addCase(removeJob.fulfilled, (state, action) => {
        const { jobId } = action.payload;
        state.jobs = state.jobs.filter(job => job._id !== jobId);
        state.statistics.totalJobs = Math.max(0, state.statistics.totalJobs - 1);
      })
      .addCase(removeJob.rejected, (state, action) => {
        state.error = action.payload;
      });

 
    builder
      .addCase(banUser.pending, (state) => {
        state.error = null;
      })
      .addCase(banUser.fulfilled, (state, action) => {
        const { userId } = action.payload;
        state.users = state.users.filter(user => user._id !== userId);
        state.statistics.totalUsers = Math.max(0, state.statistics.totalUsers - 1);
      })
      .addCase(banUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, setLoading } = adminSlice.actions;

export const selectJobs = (state) => state.admin.jobs;
export const selectUsers = (state) => state.admin.users;
export const selectStatistics = (state) => state.admin.statistics;
export const selectLoading = (state) => state.admin.loading;
export const selectError = (state) => state.admin.error;
export const selectLastUpdated = (state) => state.admin.lastUpdated;

export default adminSlice.reducer;