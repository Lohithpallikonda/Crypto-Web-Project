const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

const PERCENTAGE_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

export const formatCurrency = (value: number, currency = "USD") => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    console.warn("currency format fallback", error);
    return CURRENCY_FORMATTER.format(value);
  }
};

export const formatNumber = (value: number) => {
  return NUMBER_FORMATTER.format(value);
};

export const formatPercent = (value?: number | null) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "-";
  }
  return PERCENTAGE_FORMATTER.format(value / 100);
};

export const formatDelta = (value?: number | null) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "-";
  }
  const formatted = formatPercent(value);
  return value > 0 ? `+${formatted}` : formatted;
};
