import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { getApiPayload } from "../../api/apiHelpers";
import { mapMarginedVendor } from "../../api/mappers";

export const fetchDashboardSummary = createAsyncThunk(
  "dashboard/fetchDashboardSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/catalog/summary");
      return getApiPayload(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to load dashboard summary" });
    }
  }
);

export const fetchDashboardAnalytics = createAsyncThunk(
  "dashboard/fetchDashboardAnalytics",
  async (range = "month", { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/catalog/analytics", {
        params: { range },
      });
      return getApiPayload(response);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to load dashboard analytics" }
      );
    }
  }
);

export const fetchMarginedVendors = createAsyncThunk(
  "dashboard/fetchMarginedVendors",
  async ({ page = 1, limit = 10, search = "" } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/catalog/margined-vendors", {
        params: {
          page,
          limit,
          search: search || undefined,
        },
      });
      return getApiPayload(response);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to load vendors with margins" }
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    summary: null,
    analytics: {
      marginActivity: [],
      vendorPerformance: [],
      range: "month",
    },
    analyticsLoading: false,
    marginedVendors: [],
    marginedVendorsPagination: null,
    loading: false,
    marginedVendorsLoading: false,
    error: null,
    fetched: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.fetched = true;
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDashboardAnalytics.pending, (state) => {
        state.analyticsLoading = true;
      })
      .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.analytics = {
          marginActivity: action.payload?.marginActivity ?? [],
          vendorPerformance: action.payload?.vendorPerformance ?? [],
          range: action.payload?.range ?? "month",
        };
      })
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.analyticsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMarginedVendors.pending, (state) => {
        state.marginedVendorsLoading = true;
      })
      .addCase(fetchMarginedVendors.fulfilled, (state, action) => {
        state.marginedVendorsLoading = false;
        const rows = action.payload?.data ?? [];
        state.marginedVendors = rows.map(mapMarginedVendor);
        state.marginedVendorsPagination = action.payload?.pagination ?? null;
      })
      .addCase(fetchMarginedVendors.rejected, (state, action) => {
        state.marginedVendorsLoading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
