const leiFormatter = new Intl.NumberFormat("ro-RO", {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function formatPrice(value: number, currency: "RON" = "RON"): string {
  if (currency !== "RON") {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  }

  return `${leiFormatter.format(value)} lei`;
}
