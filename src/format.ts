// Prices in the user's locale. Small prices keep enough significant digits (0.00001234, not 0.00).
export function formatPrice(usd: number | undefined, locale = 'en-US', currency = 'USD'): string {
  if (usd === undefined || !Number.isFinite(usd)) return '–';
  const small = Math.abs(usd) > 0 && Math.abs(usd) < 1;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...(small ? { maximumSignificantDigits: 4 } : { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
  }).format(usd);
}

// "+2.10%" / "-0.42%": always signed, so the direction never depends on colour alone.
export function formatChange(pct: number | undefined, locale = 'en-US'): string {
  if (pct === undefined || !Number.isFinite(pct)) return '–';
  return new Intl.NumberFormat(locale, { style: 'percent', signDisplay: 'exceptZero', maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(pct / 100);
}
