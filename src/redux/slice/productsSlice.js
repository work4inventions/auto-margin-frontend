import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { buildQueryString, getApiPayload, getCursorResult } from "../../api/apiHelpers";
import { mapProduct } from "../../api/mappers";
import { toast } from "react-toastify";

export const fetchVendorNames = createAsyncThunk(
  "products/fetchVendorNames",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/v1/catalog/vendor-names");
      const payload = getApiPayload(response);
      return payload?.data ?? [];
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to load vendor names" });
    }
  }
);

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = buildQueryString({
        after: params.after,
        limit: params.limit || 10,
        search: params.search,
        vendor: params.vendor && params.vendor !== "all" ? params.vendor : undefined,
        collectionId: params.collectionId && params.collectionId !== "all" ? params.collectionId : undefined,
      });
      const response = await axiosInstance.get(`/api/v1/products${query}`, {
        timeout: 120000,
      });
      return getCursorResult(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to load products" });
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    vendorNames: [],
    pagination: null,
    loading: false,
    vendorNamesLoading: false,
    error: null,
    fetched: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.fetched = true;
        state.items = action.payload.items.map(mapProduct);
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload?.message || "Failed to load products");
      })
      .addCase(fetchVendorNames.pending, (state) => {
        state.vendorNamesLoading = true;
      })
      .addCase(fetchVendorNames.fulfilled, (state, action) => {
        state.vendorNamesLoading = false;
        state.vendorNames = action.payload ?? [];
      })
      .addCase(fetchVendorNames.rejected, (state) => {
        state.vendorNamesLoading = false;
      });
  },
});

export default productsSlice.reducer;
