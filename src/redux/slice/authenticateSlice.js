// src/redux/slices/authenticateSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// Async thunk for authentication
export const authenticateUser = createAsyncThunk(
  "authenticateUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/user/authenticate");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Authentication failed" },
      );
    }
  },
);

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const authenticateSlice = createSlice({
  name: "authenticate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data || null;
        state.error = null;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authenticateSlice.reducer;
