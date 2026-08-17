import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { buildQueryString, getPaginatedResult } from "../../api/apiHelpers";
import { mapSyncLog } from "../../api/mappers";

export const fetchSyncLogs = createAsyncThunk(
  "syncLogs/fetchSyncLogs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = buildQueryString({
        page: params.page || 1,
        limit: params.limit || 10,
        sortBy: params.sortBy || "createdAt",
        sortOrder: params.sortOrder || "desc",
      });
      const response = await axiosInstance.get(`/api/v1/logs${query}`);
      return getPaginatedResult(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to load activity logs" });
    }
  }
);

const syncLogsSlice = createSlice({
  name: "syncLogs",
  initialState: {
    items: [],
    pagination: null,
    loading: false,
    error: null,
    fetched: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSyncLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSyncLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.fetched = true;
        state.items = action.payload.items.map(mapSyncLog);
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSyncLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default syncLogsSlice.reducer;
