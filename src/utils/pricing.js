export const MARGIN_MIN = -200;
export const MARGIN_MAX = 500;

export const clampMargin = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(MARGIN_MAX, Math.max(MARGIN_MIN, parsed));
};

/**
 * Round up to the nearest whole-dollar price ending in 99 (e.g. 378 → 399, 100.50 → 199).
 */
export const roundUpTo99 = (value) => {
  const num = Number(value);
  if (Number.isNaN(num) || num <= 0) return 99;
  const hundreds = Math.floor(num / 100);
  const candidate = hundreds * 100 + 99;
  return num <= candidate ? candidate : (hundreds + 1) * 100 + 99;
};

/**
 * Margin preview: add or subtract % from stored original.
 * When round-up is enabled, final price ends at nearest $X99.00.
 */
export const calculatePriceWithMargin = (originalPrice, marginPercentage, roundUpEnabled = true) => {
  const base = Number(originalPrice) || 0;
  const margin = Number(marginPercentage) || 0;
  const withMargin = Math.max(0.01, base * (1 + margin / 100));
  if (roundUpEnabled === false) return withMargin;
  return roundUpTo99(withMargin);
};

export const formatMoney = (value, currency = "USD") => {
  const num = Number(value) || 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(num);
};
