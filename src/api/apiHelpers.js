export const getApiPayload = (response) => response?.data?.data ?? response?.data ?? null;

export const getPaginatedResult = (response) => {
  const payload = getApiPayload(response);
  return {
    items: Array.isArray(payload?.data) ? payload.data : [],
    pagination: payload?.pagination ?? {
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      limit: 10,
      hasNextPage: false,
      hasPrevPage: false,
    },
  };
};

/** Shopify cursor pagination (collections / products). */
export const getCursorResult = (response) => {
  const payload = getApiPayload(response);
  return {
    items: Array.isArray(payload?.data) ? payload.data : [],
    pagination: payload?.pagination ?? {
      limit: 10,
      hasNextPage: false,
      hasPreviousPage: false,
      nextCursor: null,
    },
  };
};

export const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};
