// Money formatting: whole dollars with thousands separators, no cents (e.g. $412,000).
// See CLAUDE.md "Conventions".
export function formatMoney(amount: number): string {
  return `$${Math.round(amount).toLocaleString("en-US")}`;
}

// Signed money, for potential margin vs. list price (e.g. +$26,000 / -$5,000).
export function formatSignedMoney(amount: number): string {
  const sign = amount >= 0 ? "+" : "-";
  return `${sign}${formatMoney(Math.abs(amount))}`;
}

// Beds/baths compact label, e.g. "4 bd · 2.5 ba".
export function bedsBaths(beds: number, baths: number): string {
  return `${beds} bd · ${baths} ba`;
}
