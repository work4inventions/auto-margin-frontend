import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { normalizeProfile } from "../../utils/profile";
import { updateProfile } from "./updateProfileSlice";
import { authenticateUser } from "./authenticateSlice";
import { userLogin } from "./loginSlice";

export const getProfile = createAsyncThunk(
  "getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/user/profile");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to load profile");
    }
  },
);

const setProfileFromPayload = (state, payload) => {
  const normalized = normalizeProfile(payload?.data ?? payload);
  if (normalized) {
    state.data = normalized;
  }
};

const getProfileSlice = createSlice({
  name: "getProfile",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        setProfileFromPayload(state, action.payload);
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        setProfileFromPayload(state, action.payload);
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        setProfileFromPayload(state, action.payload);
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        const normalized = normalizeProfile(action.payload?.data ?? action.payload);
        if (normalized) {
          state.data = normalized;
        } else if (action.payload?.data) {
          state.data = {
            ...state.data,
            ...action.payload.data,
          };
        }
      });
  },
});

export default getProfileSlice.reducer;
