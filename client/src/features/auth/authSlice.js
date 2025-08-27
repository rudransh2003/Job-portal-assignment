import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { showToast } from "../../utils/toast";

const API_URL = `${import.meta.env.VITE_SERVER_URL}/auth`;

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/register`, formData);
      showToast.success("Registration successful! 🎉");
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      showToast.error(message); 
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/login`, formData);
      showToast.success("Login successful! ✅");
      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      showToast.error(message); 
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      showToast.success("Logged out successfully 👋");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        showToast.loading("Registering user...");
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
        showToast.dismiss();
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        showToast.dismiss();
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        showToast.loading("Logging in...");
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
        showToast.dismiss(); 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        showToast.dismiss();
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;