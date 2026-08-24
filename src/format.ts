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

// Static month table: formatting the date parts ourselves means never constructing
// a Date, so there is no UTC-to-local conversion that could shift the day. It also
// keeps output identical across devices and locales.
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Last-sale dates arrive as either "2019-06-14" or "2024-11-18T00:00:00.000Z".
// Both share a leading YYYY-MM-DD, which is all we read. Returns null when the
// string is not a date we recognize, so callers omit it instead of printing junk.
export function formatSaleDate(value: string): string | null {
  const match = /^(\d{4})-(\d{2})-\d{2}/.exec(value);
  if (match === null) return null;
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;
  return `${MONTHS[month - 1]} ${match[1]}`;
}

// Comp distance. Rentcast returns full float precision (0.0234); one decimal is
// as much as is meaningful for "how close is this comp". Anything that would
// round to zero reads as "< 0.1 mi" rather than implying no distance at all.
export function formatDistance(miles: number): string {
  const rounded = Math.round(miles * 10) / 10;
  return rounded === 0 ? "< 0.1 mi" : `${rounded.toFixed(1)} mi`;
}

// Market averages come back fractional (38.42). Days on market is a count of
// days; a fraction of a day is false precision to a buyer.
export function formatDaysOnMarket(days: number): string {
  return String(Math.round(days));
}
