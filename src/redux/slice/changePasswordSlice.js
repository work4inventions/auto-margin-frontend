import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const changePassword = createAsyncThunk(
  "changePassword",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/v1/user/change-password",
        payload,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to change password" },
      );
    }
  },
);

const initialState = {
  loading: false,
  error: null,
};

const changePasswordSlice = createSlice({
  name: "changePassword",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default changePasswordSlice.reducer;

