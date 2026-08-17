import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { buildQueryString, getCursorResult } from "../../api/apiHelpers";
import { mapCollection } from "../../api/mappers";
import { toast } from "react-toastify";

export const fetchCollections = createAsyncThunk(
  "collections/fetchCollections",
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = buildQueryString({
        after: params.after,
        limit: params.limit || 10,
        search: params.search,
      });
      const response = await axiosInstance.get(`/api/v1/collections${query}`, {
        timeout: 120000,
      });
      return getCursorResult(response);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to load collections" });
    }
  }
);

const collectionsSlice = createSlice({
  name: "collections",
  initialState: {
    items: [],
    pagination: null,
    loading: false,
    loadingMore: false,
    error: null,
    fetched: false,
  },
  reducers: {
    clearCollectionsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollections.pending, (state, action) => {
        if (action.meta.arg?.append) {
          state.loadingMore = true;
        } else {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.fetched = true;

        const mapped = action.payload.items.map(mapCollection);
        const append = Boolean(action.meta.arg?.append);

        if (append) {
          const seen = new Set(
            state.items.map((c) => c.shopifyCollectionId || c.id)
          );
          const next = mapped.filter((c) => {
            const id = c.shopifyCollectionId || c.id;
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
          });
          state.items = [...state.items, ...next];
        } else {
          state.items = mapped;
        }

        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload;
        if (!action.meta.arg?.append) {
          toast.error(action.payload?.message || "Failed to load collections from Shopify");
        }
      });
  },
});

export const { clearCollectionsError } = collectionsSlice.actions;
export default collectionsSlice.reducer;
