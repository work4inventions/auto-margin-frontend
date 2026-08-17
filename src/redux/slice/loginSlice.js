// src/redux/slices/loginSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

// Async thunk for user login
export const userLogin = createAsyncThunk(
  "userLogin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/v1/user/login",
        credentials,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Login failed" },
      );
    }
  },
);

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data || null;
        state.error = null;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default loginSlice.reducer;
