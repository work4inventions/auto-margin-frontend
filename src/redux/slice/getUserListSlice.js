import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { addUser } from "./addUserSlice";

export const getUserList = createAsyncThunk(
  "getUserList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/user", {
        params,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users",
      );
    }
  },
);

const getUserListSlice = createSlice({
  name: "userList",
  initialState: {
    users: [],
    pagination: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        const newUser = action.payload?.data;
        if (!newUser) return;

        const isArray = Array.isArray(state.users);
        const isObjectWithData = state.users && typeof state.users === "object" && "data" in state.users;

        if (isObjectWithData) {
          const list = state.users.data ?? [];
          state.users.data = [newUser, ...list];
          if (state.users.pagination && typeof state.users.pagination.totalCount === "number") {
            state.users.pagination.totalCount += 1;
          }
        } else if (isArray) {
          state.users = [newUser, ...state.users];
        } else {
          state.users = [newUser];
        }
      });
  },
});

export default getUserListSlice.reducer;
