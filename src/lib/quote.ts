export interface QuoteLine {
  item: string;
  size: string;
  qty: number;
  unit: number;
}

export interface QuoteTotals {
  lines: (QuoteLine & { total: number })[];
  subtotal: number;
  discount: number;
  total: number;
}

/** Totals are always computed from the lines, never typed in. */
export function priceQuote(lines: QuoteLine[], discountRate: number): QuoteTotals {
  const priced = lines.map((l) => ({ ...l, total: l.qty * l.unit }));
  const subtotal = priced.reduce((sum, l) => sum + l.total, 0);
  const discount = Math.round(subtotal * discountRate * 100) / 100;
  return { lines: priced, subtotal, discount, total: subtotal - discount };
}

export function money(value: number): string {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}
