const formatDate = (value) => {
  if (!value) return "Never";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Never";
  return date.toLocaleString();
};

const variantSku = (shopifyVariantId) => {
  if (!shopifyVariantId) return "—";
  const parts = String(shopifyVariantId).split("/");
  return parts[parts.length - 1] || shopifyVariantId;
};

export const mapCollection = (row) => ({
  id: row.id || row.shopifyCollectionId,
  shopifyCollectionId: row.shopifyCollectionId || row.id,
  title: row.title,
  handle: row.handle,
  productCount: row.productCount ?? 0,
  image: row.image || null,
});

export const mapVendor = (row) => {
  const margin = Number(row.marginPercentage) || 0;
  return {
    id: row._id,
    name: row.vendorName,
    currentMargin: margin,
    productCount: row.totalProducts ?? 0,
    status: margin !== 0 ? "Active" : "Inactive",
    category: "General",
    averageRating: 4.5,
  };
};

export const mapMarginedVendor = (row) => {
  const margin = Number(row.marginPercentage) || 0;
  const applyStatus = row.applyStatus || "idle";
  let status = margin !== 0 ? "Active" : "Inactive";
  if (applyStatus === "running") status = "Applying";
  if (applyStatus === "failed") status = "Failed";

  return {
    id: `${row.shopifyCollectionId}::${row.vendorName}`,
    shopifyCollectionId: row.shopifyCollectionId,
    collectionTitle: row.collectionTitle || "—",
    vendorName: row.vendorName,
    marginPercentage: margin,
    productCount: row.productCount ?? 0,
    applyStatus,
    status,
    updatedAt: row.updatedAt,
  };
};

export const mapCollectionVendor = (row) => {
  const margin = Number(row.marginPercentage) || 0;
  return {
    id: row.vendorName,
    name: row.vendorName,
    currentMargin: margin,
    roundUpTo99: row.roundUpTo99 !== false,
    removeCompareAtPrice: row.removeCompareAtPrice === true,
    productCount: row.productCount ?? 0,
    status: margin !== 0 ? "Active" : "Inactive",
    category: "Collection",
    averageRating: null,
  };
};

export const mapProduct = (row) => {
  const margin = Number(row.currentMargin ?? row.appliedMargin) || 0;
  const originalPrice = row.originalPrice != null ? Number(row.originalPrice) : null;
  const currentPrice = row.currentPrice != null
    ? Number(row.currentPrice)
    : row.updatedPrice != null
      ? Number(row.updatedPrice)
      : originalPrice ?? 0;

  return {
    id: row.id || row.shopifyVariantId,
    shopifyProductId: row.shopifyProductId,
    shopifyVariantId: row.shopifyVariantId,
    title: row.title,
    sku: row.sku || variantSku(row.shopifyVariantId),
    vendor: row.vendor,
    collection: row.collection || "—",
    collectionId: row.collectionId || null,
    originalPrice,
    currentPrice,
    currentMargin: margin,
    stock: row.stock ?? 0,
    status: row.status || (margin !== 0 ? "Active" : "Baseline"),
    image: row.image || null,
  };
};

export const mapSyncLog = (row) => {
  let type = "shopify_sync";
  if (row.logType === "margin_update") {
    type = "margin_update";
  }
  return {
    id: row._id,
    type,
    message: row.message || "Catalog update",
    timestamp: formatDate(row.createdAt),
    user: "System",
  };
};
