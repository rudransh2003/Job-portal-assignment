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

const seekerJobSlice = createSlice({
    name: "seeker",
    initialState: {
        jobs: [],
        loading: false,
        error: null,
        profileComplete: false,
    },
    reducers: {
        setProfileComplete: (state, action) => {
            state.profileComplete = action.payload;
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
            });
    },
});

export const { setProfileComplete } = seekerJobSlice.actions;
export default seekerJobSlice.reducer;