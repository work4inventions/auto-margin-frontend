import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";
import { getApiPayload } from "../../api/apiHelpers";
import { mapCollectionVendor } from "../../api/mappers";
import { encodeCollectionId } from "../../utils/collectionRoutes";
import { toast } from "react-toastify";

const toastApplyResult = (applyResult, label = "Margin") => {
  if (!applyResult) {
    toast.success(`${label} saved`);
    return;
  }
  const { updatedVariants = 0, failedVariants = 0, skippedVariants = 0 } = applyResult;
  if (updatedVariants > 0) {
    toast.success(
      `${label} applied to ${updatedVariants} product${updatedVariants === 1 ? "" : "s"} in Shopify`
    );
  }
  if (skippedVariants > 0) {
    toast.warn(
      `${skippedVariants} variant${skippedVariants === 1 ? "" : "s"} skipped — no price from Shopify`
    );
  }
  if (failedVariants > 0) {
    toast.error(`${failedVariants} product update${failedVariants === 1 ? "" : "s"} failed`);
  }
  if (updatedVariants === 0 && skippedVariants === 0 && failedVariants === 0) {
    toast.info("No variants found for this vendor in the collection.");
  }
};

export const fetchCollectionVendors = createAsyncThunk(
  "collectionVendors/fetchCollectionVendors",
  async (arg, { rejectWithValue }) => {
    const collectionId = typeof arg === "string" ? arg : arg?.collectionId;
    const refresh = typeof arg === "object" && Boolean(arg?.refresh);
    try {
      const encoded = encodeCollectionId(collectionId);
      const response = await axiosInstance.get(`/api/v1/collections/${encoded}/vendors`, {
        timeout: refresh ? 120000 : 60000,
        params: refresh ? { refresh: "true" } : undefined,
      });
      return getApiPayload(response);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to load collection vendors" }
      );
    }
  }
);

export const setCollectionVendorMargin = createAsyncThunk(
  "collectionVendors/setCollectionVendorMargin",
  async ({ collectionId, vendorName, marginPercentage, productCount }, { rejectWithValue }) => {
    try {
      const encoded = encodeCollectionId(collectionId);
      const response = await axiosInstance.post(
        `/api/v1/collections/${encoded}/vendors/margin`,
        { vendorName, marginPercentage, productCount },
        { timeout: 30000 }
      );
      return { vendorName, marginPercentage, payload: getApiPayload(response) };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to apply collection vendor margin" }
      );
    }
  }
);

export const setCollectionVendorRoundUp = createAsyncThunk(
  "collectionVendors/setCollectionVendorRoundUp",
  async ({ collectionId, vendorName, roundUpTo99, productCount }, { rejectWithValue }) => {
    try {
      const encoded = encodeCollectionId(collectionId);
      const response = await axiosInstance.post(
        `/api/v1/collections/${encoded}/vendors/round-up`,
        { vendorName, roundUpTo99, productCount },
        { timeout: 30000 }
      );
      return { vendorName, roundUpTo99, payload: getApiPayload(response) };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to apply round up price rule" }
      );
    }
  }
);

export const setCollectionVendorRemoveCompareAt = createAsyncThunk(
  "collectionVendors/setCollectionVendorRemoveCompareAt",
  async ({ collectionId, vendorName, removeCompareAtPrice, productCount }, { rejectWithValue }) => {
    try {
      const encoded = encodeCollectionId(collectionId);
      const response = await axiosInstance.post(
        `/api/v1/collections/${encoded}/vendors/compare-at`,
        { vendorName, removeCompareAtPrice, productCount },
        { timeout: 30000 }
      );
      return { vendorName, removeCompareAtPrice, payload: getApiPayload(response) };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to apply compare-at price rule" }
      );
    }
  }
);

export const bulkSetCollectionVendorMargins = createAsyncThunk(
  "collectionVendors/bulkSetCollectionVendorMargins",
  async ({ collectionId, vendorNames, marginPercentage }, { rejectWithValue }) => {
    try {
      const encoded = encodeCollectionId(collectionId);
      const response = await axiosInstance.post(
        `/api/v1/collections/${encoded}/vendors/margin/bulk`,
        { vendorNames, marginPercentage },
        { timeout: 30000 }
      );
      return { marginPercentage, payload: getApiPayload(response) };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to bulk apply collection margins" }
      );
    }
  }
);

const collectionVendorsSlice = createSlice({
  name: "collectionVendors",
  initialState: {
    collection: null,
    items: [],
    loading: false,
    saving: false,
    cacheRefreshing: false,
    error: null,
  },
  reducers: {
    clearCollectionVendors: (state) => {
      state.collection = null;
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollectionVendors.pending, (state) => {
        if (state.items.length === 0) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchCollectionVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.cacheRefreshing = Boolean(action.payload?.cacheRefreshing);
        state.collection = action.payload?.collection ?? null;
        const vendors = action.payload?.vendors ?? [];
        state.items = vendors.map(mapCollectionVendor);
      })
      .addCase(fetchCollectionVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload?.message || "Failed to load collection vendors");
      })
      .addCase(setCollectionVendorMargin.pending, (state) => {
        state.saving = true;
      })
      .addCase(setCollectionVendorMargin.fulfilled, (state, action) => {
        state.saving = false;
        const { vendorName, marginPercentage } = action.meta.arg;
        state.items = state.items.map((v) =>
          v.name === vendorName
            ? {
                ...v,
                currentMargin: marginPercentage,
                status: marginPercentage !== 0 ? "Active" : "Inactive",
              }
            : v
        );

        const data = action.payload?.payload;
        if (data?.applyingInBackground) {
          const count = data?.vendor?.productCount ?? 0;
          toast.success(
            `Margin ${marginPercentage}% saved. Shopify prices updating for ${count} item${count === 1 ? "" : "s"} in the background.`
          );
        } else {
          toastApplyResult(data?.applyResult, "Collection margin");
        }
      })
      .addCase(setCollectionVendorMargin.rejected, (state, action) => {
        state.saving = false;
        toast.error(action.payload?.message || "Failed to apply margin");
      })
      .addCase(setCollectionVendorRoundUp.pending, (state) => {
        state.saving = true;
      })
      .addCase(setCollectionVendorRoundUp.fulfilled, (state, action) => {
        state.saving = false;
        const { vendorName, roundUpTo99 } = action.meta.arg;
        state.items = state.items.map((v) =>
          v.name === vendorName ? { ...v, roundUpTo99 } : v
        );

        const data = action.payload?.payload;
        const label = roundUpTo99 ? "Round up to $99" : "Standard pricing";
        if (data?.applyingInBackground) {
          const count = data?.vendor?.productCount ?? 0;
          toast.success(
            `${label} saved. Shopify prices updating for ${count} item${count === 1 ? "" : "s"} in the background.`
          );
        } else {
          toast.success(`${label} rule saved`);
        }
      })
      .addCase(setCollectionVendorRoundUp.rejected, (state, action) => {
        state.saving = false;
        toast.error(action.payload?.message || "Failed to apply round up rule");
      })
      .addCase(setCollectionVendorRemoveCompareAt.pending, (state) => {
        state.saving = true;
      })
      .addCase(setCollectionVendorRemoveCompareAt.fulfilled, (state, action) => {
        state.saving = false;
        const { vendorName, removeCompareAtPrice } = action.meta.arg;
        state.items = state.items.map((v) =>
          v.name === vendorName ? { ...v, removeCompareAtPrice } : v
        );

        const data = action.payload?.payload;
        const label = removeCompareAtPrice ? "Compare-at removal" : "Compare-at rule off";
        if (data?.applyingInBackground) {
          const count = data?.vendor?.productCount ?? 0;
          toast.success(
            `${label} saved. Shopify compare-at prices clearing for ${count} item${count === 1 ? "" : "s"} in the background.`
          );
        } else {
          toast.success(`${label} saved`);
        }
      })
      .addCase(setCollectionVendorRemoveCompareAt.rejected, (state, action) => {
        state.saving = false;
        toast.error(action.payload?.message || "Failed to apply compare-at rule");
      })
      .addCase(bulkSetCollectionVendorMargins.pending, (state) => {
        state.saving = true;
      })
      .addCase(bulkSetCollectionVendorMargins.fulfilled, (state, action) => {
        state.saving = false;
        const { marginPercentage } = action.meta.arg;
        state.items = state.items.map((v) => ({
          ...v,
          currentMargin: marginPercentage,
          status: marginPercentage !== 0 ? "Active" : "Inactive",
        }));
        const count = action.payload?.payload?.vendors?.length ?? 0;
        toast.success(
          `Margin ${marginPercentage}% saved for ${count} vendor${count === 1 ? "" : "s"}. Shopify updates running in background.`
        );
      })
      .addCase(bulkSetCollectionVendorMargins.rejected, (state, action) => {
        state.saving = false;
        toast.error(action.payload?.message || "Bulk margin apply failed");
      });
  },
});

export const { clearCollectionVendors } = collectionVendorsSlice.actions;
export default collectionVendorsSlice.reducer;
