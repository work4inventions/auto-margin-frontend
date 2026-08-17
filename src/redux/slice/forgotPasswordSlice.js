import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const requestForgotPasswordOtp = createAsyncThunk(
  "requestForgotPasswordOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/v1/user/forgot-password/request",
        payload,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to send OTP" },
      );
    }
  },
);

export const verifyForgotPasswordOtp = createAsyncThunk(
  "verifyForgotPasswordOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/v1/user/forgot-password/verify-otp",
        payload,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to verify OTP" },
      );
    }
  },
);

export const resetForgotPassword = createAsyncThunk(
  "resetForgotPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/v1/user/forgot-password/reset",
        payload,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to reset password" },
      );
    }
  },
);

const initialState = {
  loading: false,
  error: null,
  token: null,
};

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    clearForgotPasswordState: (state) => {
      state.loading = false;
      state.error = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Request OTP
      .addCase(requestForgotPasswordOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestForgotPasswordOtp.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(requestForgotPasswordOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify OTP
      .addCase(verifyForgotPasswordOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyForgotPasswordOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const tokenFromResponse =
          action.payload?.data?.resetToken || null;
        state.token = tokenFromResponse;
      })
      .addCase(verifyForgotPasswordOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reset password
      .addCase(resetForgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetForgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetForgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearForgotPasswordState } = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;

