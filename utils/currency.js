export const CURRENCY_OPTIONS = [
  { code: "THB", label: "Thai Baht", symbol: "฿" },
  { code: "MMK", label: "Myanmar Kyat", symbol: "Ks" },
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "CNY", label: "Chinese Yuan", symbol: "¥" },
];

export const DEFAULT_CURRENCY_CODE = "THB";

export const buildCurrencyStorageKey = (userId) => {
  return `currency-preference:${userId || "guest"}`;
};

export const getCurrencyOption = (code) => {
  return CURRENCY_OPTIONS.find((option) => option.code === code) || null;
};

export const getCurrencyDisplayName = (code) => {
  const currency = getCurrencyOption(code) || getCurrencyOption(DEFAULT_CURRENCY_CODE);

  return `${currency.label} (${currency.code})`;
};

export const formatCurrencyAmount = (amount, code) => {
  const currency = getCurrencyOption(code) || getCurrencyOption(DEFAULT_CURRENCY_CODE);
  const numericAmount = Number(amount) || 0;

  return `${currency.symbol}${numericAmount.toFixed(2)}`;
};
