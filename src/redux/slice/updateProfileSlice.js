import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const updateProfile = createAsyncThunk(
  "updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/api/v1/user/profile", profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update profile");
    }
  }
);

const updateProfileSlice = createSlice({
  name: "updateProfile",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data || null;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default updateProfileSlice.reducer;