# CLAUDE.md — realestate-mobile

Project memory for Claude Code. Read this before making changes.

> **Expo has changed.** Read the exact versioned docs at
> https://docs.expo.dev/versions/v57.0.0/ before writing any Expo/RN code — do not
> rely on memory of older SDKs.

## What this project is

The **mobile client** for a real estate comps & valuation app. A user enters an address and
sees property facts, an estimated value, comparable homes, a rent estimate, and market
context (median price, days on market). iOS + Android from one codebase.

This repo is **the mobile app only**. It is a *client* of a separate Next.js backend that
holds the data-provider API key and returns normalized JSON. That backend is a different
repo/session — do not build it here.

## Stack

- **Expo (React Native) + TypeScript**
- **Expo Router** (file-based routing)
- **NativeWind** (Tailwind syntax in React Native)
- Run: `npx expo start` (press `i` iOS sim, `a` Android, or scan QR with Expo Go)

## NON-NEGOTIABLE RULES

1. **No API keys in this app. Ever.** Mobile bundles can be decompiled, so any key shipped
   here is a leaked key. This app knows only a base URL, from `EXPO_PUBLIC_API_BASE_URL`.
   It never calls Rentcast (or any data provider) directly — only our own backend.

2. **Say "estimated value" and "potential margin vs. list price" — never "equity."**
   Equity means value minus what's owed on the mortgage, which we cannot know from an
   address. Using "equity" is factually wrong and kills credibility. This applies to all UI
   copy, variable names, and comments.

3. **Show an "Estimates only — not an appraisal" disclaimer** somewhere visible on the
   results screen. AVMs and rent estimates are estimates.

4. **Scope = Phase 1, retail home buyer, ONE screen.** Do not build investor/agent/seller
   features, user accounts, maps, or alerts yet. If a change would add one of those, stop
   and flag it instead of building it.

5. **The normalized data model is the contract.** Extend the shared types; never fork them.
   The backend returns exactly this shape.

## The data contract (shared with the backend)

```ts
type Property = {
  address: string; beds: number; baths: number; sqft: number;
  yearBuilt: number; lotSizeSqft: number; lastSalePrice?: number; lastSaleDate?: string;
};
type Valuation = {
  estimatedValue: number; listPrice?: number;
  potentialMargin?: number; // estimatedValue - listPrice, only when listPrice exists
};
type Comp = {
  address: string; beds: number; baths: number; sqft: number;
  price: number; status: "for_sale" | "sold" | "for_lease"; distanceMiles: number;
};
type RentEstimate = { monthlyRent: number; rentComps: Comp[] };
type MarketSnapshot = { zip: string; medianPrice: number; avgDaysOnMarket: number };
type PropertyReport = {
  property: Property; valuation: Valuation; comps: Comp[];
  rent: RentEstimate; market: MarketSnapshot;
};
```

## Data fetching

- Fetch from `GET ${EXPO_PUBLIC_API_BASE_URL}/api/property?address=<encoded>` → `PropertyReport`.
- Until the backend exists, use a local `MOCK_DATA: PropertyReport` fallback so the full UI
  renders offline. When the backend is unreachable, fall back to `MOCK_DATA`.
- Always handle three states: loading, no-data / partial-data, and error.

## The Phase 1 screen (build order)

1. Address input + search button at top.
2. Property Facts card (beds/baths/sqft/year built/lot/last sale).
3. Valuation card: estimated value + potential margin vs. list price (only if list price exists).
4. Comps list (~5): price, beds/baths, distance, status badge.
5. Rent Estimate card: monthly rent + a couple of rent comps.
6. Market Snapshot strip: median price + avg days on market.
7. "Estimates only — not an appraisal" disclaimer.

## Conventions

- TypeScript strict; no `any` for API shapes — use the contract types above.
- Style with NativeWind classes, not inline `StyleSheet`, unless a class can't express it.
- Keep components small and in a `components/` folder; screens under Expo Router routes.
- Money formatting: whole dollars with thousands separators (e.g. `$412,000`), no cents.

## Out of scope (flag, don't build)

Investor math, agent reports, seller pricing, accounts/auth, maps, alerts, monetization,
the backend itself. These are later phases in the roadmap — mention them, don't implement.
