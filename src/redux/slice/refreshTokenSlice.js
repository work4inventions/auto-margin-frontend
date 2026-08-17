// src/redux/slices/refreshTokenSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// Async thunk for refresh token
export const refreshToken = createAsyncThunk(
  "refreshToken",
  async (refreshToken, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/v1/user/refresh-token", {
        refreshToken,
      });

      console.log('refresh-token',response);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Token refresh failed" },
      );
    }
  },
);

const initialState = {
  loading: false,
  error: null,
};

const refreshTokenSlice = createSlice({
  name: "refreshToken",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default refreshTokenSlice.reducer;
