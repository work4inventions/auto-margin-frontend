export const encodeCollectionId = (shopifyCollectionId) =>
  encodeURIComponent(shopifyCollectionId);

export const decodeCollectionId = (routeParam) =>
  decodeURIComponent(routeParam || "");

export const collectionDetailPath = (shopifyCollectionId) =>
  `/collections/${encodeCollectionId(shopifyCollectionId)}`;
