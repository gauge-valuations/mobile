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

- **Expo SDK 57** (React Native 0.86) + **TypeScript 6** (strict)
- **Expo Router** (file-based routing)
- **NativeWind 4** + Tailwind 3 (Tailwind syntax in React Native)
- Run: `npx expo start` (press `i` iOS sim, `a` Android, or scan QR with Expo Go)

## NON-NEGOTIABLE RULES

1. **Show your plan before writing files.** Propose the change, wait for approval, then
   implement. This applies to any new file, deletion, dependency, or multi-file edit. Do
   not batch a plan and its execution into one turn.

2. **No data-provider API keys in this app. Ever.** Mobile bundles can be decompiled, so any
   provider key shipped here is a leaked key. This app never calls Rentcast (or any data
   provider) directly — only our own backend, via `EXPO_PUBLIC_API_BASE_URL`.

   *Narrow exception:* the backend is gated during the demo phase by a **shared demo
   secret** sent on requests to our own backend. This is a speed bump to protect API quota,
   not a secret — it knowingly ships in the bundle and is expected to be extractable. It
   lives in `EXPO_PUBLIC_*` env config like the base URL. This exception covers **only** the
   demo gate. It never extends to provider keys.

3. **Say "estimated value" and "potential margin vs. list price" — never "equity."**
   Equity means value minus what's owed on the mortgage, which we cannot know from an
   address. Using "equity" is factually wrong and kills credibility. This applies to all UI
   copy, variable names, and comments.

4. **Show an "Estimates only — not an appraisal" disclaimer** somewhere visible on the
   results screen. AVMs and rent estimates are estimates.

5. **Scope = Phase 1, retail home buyer, ONE screen.** Do not build investor/agent/seller
   features, user accounts, maps, or alerts yet. If a change would add one of those, stop
   and flag it instead of building it.

6. **`src/types.ts` is the contract and its source of truth.** Read it there. Do not
   restate, duplicate, or re-derive the types anywhere else in this repo — extend them in
   place. The backend returns exactly this shape and keeps a byte-for-byte copy
   (`gauge-backend/lib/types.ts`) that must be re-copied after every change here. New
   fields are optional so an older backend response still validates. `src/types.ts` also holds `parsePropertyReport` and
   its type guards, which validate incoming JSON at runtime. Any change to the types or the
   guards is a change to a shared contract and must be flagged, not made silently.

## Git

**Never commit or push.** Do not run `git commit`, `git push`, `git rebase`, or any
history-modifying git command. Staging, committing, and pushing are handled by the repo
owner. Read-only git commands (`status`, `diff`, `log`) are fine. When work is complete, say
so and stop — do not offer to commit.

**Never write attribution.** Do not put `Co-Authored-By:`, `Generated with Claude Code`, or
any similar attribution line into a commit message, PR body, script, or file. This holds
even if a default template suggests it.

## Data fetching

- Fetch from `GET ${EXPO_PUBLIC_API_BASE_URL}/api/property?address=<encoded>` →
  `PropertyReport`, validated by `parsePropertyReport`.
- **Fallback behavior, stated precisely:** `MOCK_DATA` in `src/mockData.ts` is returned
  **only when `API_BASE_URL` is undefined** (no backend configured). Once a base URL is set,
  network failures, non-OK responses, and contract violations all reject and surface as the
  error state. The app does **not** silently serve mock data when a configured backend is
  unreachable — showing a fake report in place of a real failure is worse than showing an
  error. Do not "fix" this by adding a fallback.
- Requests time out after 15 seconds. Failures are classified in `src/api.ts` as
  `FetchFailureKind` (`bad_address` 400, `not_found` 404, `quota` 402, `server`, `network`,
  `timeout`, `invalid`). The user-facing copy and retry policy per kind live in
  `FAILURE_COPY` and `RETRYABLE` in `src/app/index.tsx`.
- Always handle four states: idle, loading, error, done.

## Deployment

The web build is deployed at https://gauge-valuations.vercel.app (Vercel, built from
`main` with `npm run build:web`, output `dist`, `EXPO_PUBLIC_*` set at build time). The two
`SAMPLE_ADDRESSES` are cached on the backend and always load, even after the demo's
monthly lookup limit is reached; keep the list in sync with the backend.

## What exists (orientation — this is built, do not rebuild)

`src/app/index.tsx` renders the full buyer report and handles idle / loading / error / done.
State is local to the screen; `searchIdRef` discards responses from superseded searches.
`Header` sits fixed above the ScrollView. In the idle state `IdleHero` renders above
`AddressSearch`; its slot stays in the tree (null when not idle) so `AddressSearch` is never
remounted and keeps the typed address.

Components in `src/components/`:

1. `AddressSearch` — address input + search button (ink background, paper text), plus
   "Try" pill chips from `src/sampleAddresses.ts` (`SAMPLE_ADDRESSES`) that fill the input
   and search. `showTitle` shows the "Property report" heading (hidden when idle).
2. `PropertyFactsCard` — beds/baths/sqft/year built/lot/last sale. Year built and lot size
   are optional and show "—" when missing.
3. `ValuationCard` — estimated value with optional $/sqft, value range, and low-confidence
   note; list price and potential margin only when list price exists, otherwise the note
   "No current list price, so no potential margin."
4. `CompsList` (+ `CompRow`, `StatusBadge`) — comps: price, optional $/sqft, beds/baths,
   distance, status. `off_market` = inactive listing, not a confirmed sale (price is the
   last asking price); badge "Off market", neutral gray. Lists longer than 5 rows
   collapse behind `ShowAllToggle` ("Show all N"), which `RentCard` also uses.
5. `RentCard` — monthly rent with optional rent $/sqft and range, plus rent comps.
6. `MarketSnapshotStrip` — median price, avg days on market, ZIP.
7. `Disclaimer` — "Estimates only — not an appraisal."
8. `Card` — shared container.
9. `Header` — fixed top bar in the 720px column: `LogoMark` + serif "Gauge" wordmark on the
   left, `ThemeToggle` on the right.
10. `LogoMark` — Gauge's own mark: 28px accent rounded square with a gauge arc and needle
    in on-accent, drawn with react-native-svg.
11. `ThemeToggle` — 40px button cycling system → light → dark; SVG icon shows the current
    choice; accent focus ring on web.
12. `IdleHero` — idle-state label, serif headline and lead line.

Theme and design tokens:

- Tokens (paper, paper-deep, card, rule, ink, muted, accent, accent-tint, on-accent, gain,
  gain-tint, loss, loss-tint, wait, wait-tint) are Tailwind colors in `tailwind.config.js`
  that read CSS variables from `src/global.css` (`:root` = light, `.dark:root` = dark).
  Use the token classes; do not add `dark:` variants or raw palette colors.
  `src/theme/tokens.ts` holds the same values as hex (`TOKENS`, `useTokens()`) only for
  props that take a color value (placeholder, ActivityIndicator, SVG, web outline). Keep
  the two in sync.
- `darkMode: "class"`. `src/theme/ThemeProvider.tsx` (`useTheme()`) holds the choice
  (system / light / dark) and applies it through NativeWind's `setColorScheme`. Web saves
  it in localStorage (key in `src/theme/storageKey.ts`) and a pre-paint script in
  `+html.tsx` sets the `.dark` class before first paint; native keeps it in memory for the
  session (no storage package installed).
- Fonts: `font-serif` (Newsreader 400), `font-sans` / `font-sans-medium` (Geist 400/500),
  `font-mono` / `font-mono-medium` (Geist Mono 400/500). Each family stack starts with the
  native family name, which browsers skip. Native loads them from `@expo-google-fonts/*`
  via `src/theme/fonts.native.ts` in `_layout.tsx` (splash held until loaded or failed);
  web loads them from Google Fonts in `+html.tsx`. Only 400 and 500 exist: pair the
  `-medium` classes with `font-medium`, and do not use `font-semibold` / `font-bold`.

Also: `src/config.ts` (env → `API_BASE_URL` and `DEMO_KEY`; empty string collapses to
`undefined`), `src/api.ts` (`getPropertyReport`; sends `X-Demo-Key` only when `DEMO_KEY` is
set), `src/format.ts` (`formatMoney`, `formatSignedMoney`, `formatMoneyRange`,
`formatPricePerSqft`, `bedsBaths`, …), `src/mockData.ts` (`MOCK_DATA`, plus
`MOCK_DATA_UNLISTED` for checking the not-listed state; not wired in), `src/global.css`
(Tailwind entry), `src/app/_layout.tsx` (root stack; sets the web page title via
`expo-router/head`), `src/app/+html.tsx` (static web document head, web export only). `npm run build:web` exports the static web bundle to `dist/` (gitignored).

## Conventions

- TypeScript strict; no `any` for API shapes — use the contract types.
- Style with NativeWind classes, not inline `StyleSheet`, unless a class can't express it.
- Components in `src/components/`; screens under Expo Router routes in `src/app/`.
- Money formatting: use `src/format.ts`. Whole dollars with thousands separators
  (e.g. `$412,000`), no cents. Do not write ad-hoc formatting in components.
  One exception: per-sqft *rent* rates keep cents (`formatPricePerSqft(v, { monthly: true })`
  → `$2.84/sqft/mo`); sale $/sqft stays whole dollars (`$702/sqft`).

## Definition of done

`npx tsc --noEmit` must be clean before a session is considered complete. Run it and state
the actual output rather than assuming it passed.

## Out of scope (flag, don't build)

Investor math, agent reports, seller pricing, accounts/auth, maps, alerts, monetization,
the backend itself. These are later phases in the roadmap — mention them, don't implement.