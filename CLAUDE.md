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
Loading shows `ReportSkeleton`; errors show `ErrorCard`; a report's six sections are each
wrapped in `Reveal`. `Header` sits fixed above the ScrollView. In the idle state `IdleHero` renders above
`AddressSearch`; its slot stays in the tree (null when not idle) so `AddressSearch` is never
remounted and keeps the typed address.

Components in `src/components/`:

1. `AddressSearch` — address input + search button (ink background, paper text), plus
   "Try" pill chips from `src/sampleAddresses.ts` (`SAMPLE_ADDRESSES`) that fill the input
   and search. `showTitle` shows the "Property report" heading (hidden when idle).
2. `PropertyFactsCard` — label "PROPERTY FACTS", the address in serif 24px, then a
   two-column grid of mono 11px uppercase labels over sans-medium values (beds/baths/sqft/
   year built/lot/last sale). Year built and lot size are optional and show "—" when
   missing; last sale may wrap.
3. `ValuationCard` — the focal card. Reading order: "ESTIMATED VALUE" label, the value in
   serif (48px, 64px from `md`; line height 53/70px, letter spacing -0.02em in px),
   $/sqft in mono, `RangeBar` (only when both range ends exist), then the "List price" row
   and a potential-margin pill (gain colors when zero or positive, loss when negative; the
   sign is in the text). Without a list price: the note "No current list price, so no
   potential margin." and no pill. The margin is derived on the client when the backend
   omits it. Low confidence shows a wait-tint callout.
4. `CompsList` (+ `CompRow`, `StatusBadge`) — one card; rows divided by 1px rule top
   borders (`first` row has none, so nothing trails the last row). Address (one line,
   ellipsis) and "beds/baths · distance" + status chip on the left; price and $/sqft in
   mono on the right, never shrinking. Status chips all have a 1px border: for sale =
   accent on accent-tint, sold = ink on paper-deep with rule border, for lease = wait on
   wait-tint, off market = muted text, no fill, dashed border in muted at 50% opacity
   (`border-muted/50`). `off_market` = inactive
   listing, not a confirmed sale (price is the last asking price). Lists longer than 5 rows
   collapse behind `ShowAllToggle` ("Show all N" / "Show fewer", accent text with an SVG
   chevron, 40px min tap height), which `RentCard` also uses.
5. `RentCard` — "RENT ESTIMATE": monthly rent in serif 36px with "/ month", rent $/sqft in
   mono, the rent range as a compact `RangeBar` (whole-dollar end labels), and rent comps
   under a mono "RENT COMPS" label.
6. `MarketSnapshotStrip` — paper-deep strip (18px radius, no border), three stats split by
   rule dividers: median price (compact, e.g. $585K, so it fits a third of a 360px screen),
   avg days on market, ZIP, each in serif 28px over a mono 11px uppercase caption.
   The median uses `formatMoneyCompact(value, 1)` (e.g. $1.3M).
7. `Disclaimer` — "Estimates only — not an appraisal.", centered muted 12px under a 1px
   rule line.
8. `Card` — shared container: 18px radius, 1px rule border, card background, 20px
   padding, no shadow; `title` renders as a mono 11px uppercase muted label.
9. `Header` — fixed top bar in the 720px column: `LogoMark` + serif "Gauge" wordmark on the
   left, `ThemeToggle` on the right.
10. `LogoMark` — Gauge's own mark: 28px accent rounded square with a gauge arc and needle
    in on-accent, drawn with react-native-svg.
11. `ThemeToggle` — 40px button cycling system → light → dark; SVG icon shows the current
    choice; accent focus ring on web.
12. `IdleHero` — idle-state label, serif headline and lead line.
13. `RangeBar` — value or rent range built from plain Views with percentage positions
    (same on web and native): rule track, accent-tint fill from low to high, accent
    estimate marker, optional ink list-price marker, low/high end labels (format passed in:
    `formatMoneyCompact` for value, `formatMoney` for rent), and a legend in the regular
    size. The end labels sit under the fill ends (low starts at the fill's left edge, high
    ends at its right edge) when the measured fill width fits both labels plus an 8px gap;
    otherwise (narrow or zero-span fill, or before layout) they fall back to the bar's
    outer edges, so they never overflow. `rangePositions` sets the domain to cover low, high, the estimate and the list
    price, pads it by 8% of the span on each side, clamps to 0–100, and puts everything at
    50% when the span is zero. The bar is one `accessibilityRole="image"` element whose
    label states the real values.
14. `ReportSkeleton` (+ `SkeletonBlock`) — loading placeholder shaped like the facts,
    valuation and comps cards, built on the real `Card`. Blocks are `bg-muted/20` (visible on
    the card color in both themes) and pulse (opacity 1 → 0.5 → 1, 1.4s); static with reduced
    motion. One `role="progressbar"` labelled "Loading report", `aria-busy`.
15. `ErrorCard` — the error state, under the search. Tone per `FetchFailureKind`: wait-tint
    with a `border-wait/40` border for bad_address, not_found, quota; loss-tint with
    `border-loss/40` for server, network, timeout, invalid. A mono label in the tone color
    ("Check the address", "No data for this address", "Demo limit reached", "Server problem",
    "Connection problem", "Took too long", "Something went wrong") and the unchanged
    `FAILURE_COPY` message in ink form one `role="alert"`. Retry (only when `RETRYABLE`)
    matches the Search button.
16. `Reveal` — wraps one report section; fades it in and lifts it 16px on mount (see Motion).

Motion: the report reveal is 350ms ease-out, opacity 0 → 1 and a 16px rise, staggered 80ms
per section, once per arrival (it plays on mount, so Show all, theme changes and re-renders
do not replay it). Built with Reanimated CSS animations, fill mode "backwards" and no
opacity or transform on the wrapper's own style, so content at rest is always fully
visible. Both the reveal and the skeleton pulse are off with reduced motion
(`useReducedMotion`). No count-ups or bar animations.

Accessibility: on web, every button-like control gets a 2px accent `:focus-visible` ring
from the rule in `+html.tsx` (the address input draws its own). Tap targets are at least
40px tall (Try chips use a 40px tap area around the compact pill). Headings: the idle
headline, or "Property report" in the other states, is level 1; card titles are level 2;
the "Gauge" wordmark is not a heading.

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
`formatMoneyCompact` — thousands with at most one decimal, millions with up to
`maxMillionDecimals` (default 2, e.g. $2.41M), `formatPricePerSqft`, `bedsBaths`, …), `src/mockData.ts` (`MOCK_DATA`, plus
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