# Gauge Valuations

A mobile app that turns a property address into an estimated value, comparable homes, a rent estimate, and local market context.

## What it does

A retail home buyer enters an address and gets a single-screen report:

- **Property facts** — beds, baths, sqft, year built, lot size, last sale.
- **Valuation** — an estimated value, and a potential margin vs. the list price when a list price is known. (This is an estimated value, not an appraisal, and not equity — the app cannot know what is owed on a property.)
- **Comparable homes** — a short list of nearby comps with price, beds/baths, distance, and status (for sale / sold / for lease).
- **Rent estimate** — an estimated monthly rent plus rent comps.
- **Market snapshot** — median price and average days on market for the ZIP.

The screen always shows an "Estimates only — not an appraisal" disclaimer, because AVM and rent numbers are estimates.

This is the **mobile client only**. It is a client of a separate backend (see Architecture) and does not contain that backend.

## Tech stack

Versions are from `package.json`.

- **Expo** `~57.0.7` (SDK 57) with **Expo Router** `~57.0.7` (file-based routing)
- **React Native** `0.86.0` / **React** `19.2.3`
- **TypeScript** `~6.0.3` (strict)
- **NativeWind** `^4.2.6` + **Tailwind CSS** `^3.4.19` for styling (Tailwind classes in React Native)
- **react-native-reanimated** `4.5.0`, **react-native-gesture-handler**, **react-native-safe-area-context**, **react-native-screens**
- **react-native-web** `~0.21.0` for the web target

## Architecture

**Client / backend split.** The app never talks to a data provider directly. It knows exactly one thing about the network: a base URL, read from `EXPO_PUBLIC_API_BASE_URL`. All data comes from a backend proxy at `GET ${API_BASE_URL}/api/property?address=<encoded>`, which is expected to hold the data-provider API key server-side and return normalized JSON. **That backend is not part of this repo** — there is no server, proxy, or API route in this codebase. It is referenced as an external service.

This split is deliberate: `EXPO_PUBLIC_` variables are embedded in the shipped bundle, which is fine for a public URL but would leak any secret. So the key stays on the backend, never in the app. See `src/config.ts`.

**Normalized, provider-agnostic contract.** The app is typed entirely against a `PropertyReport` shape defined in `src/types.ts` (`Property`, `Valuation`, `Comp`, `RentEstimate`, `MarketSnapshot`). Nothing in the client references a specific data provider — swapping providers is a backend concern as long as the response matches this contract. Incoming JSON is validated at runtime by `parsePropertyReport`, which throws if the payload does not match the contract.

**Data fetching (`src/api.ts`).** `getPropertyReport(address)` behaves in one of two ways:

- **No base URL set** (the default, since `.env.example` ships blank): returns local `MOCK_DATA` from `src/mockData.ts`, so the full UI renders offline with no backend.
- **Base URL set**: fetches from the backend, throws on a non-OK response, and validates the body against the contract. Failures surface as an error state in the UI rather than silently falling back to mock data.

Because no backend URL is configured out of the box, **the app currently runs entirely on stubbed mock data.** The live path is implemented but has not been exercised against a real backend in this repo.

**App structure.**

```
src/
  app/          # Expo Router routes
    _layout.tsx # root stack + global.css
    index.tsx   # the single results screen (idle / loading / error / done states)
  components/    # UI cards and rows (NativeWind-styled)
  api.ts         # getPropertyReport(address)
  types.ts       # PropertyReport contract + runtime validation
  mockData.ts    # MOCK_DATA fallback
  config.ts      # API_BASE_URL from env
  format.ts      # money / label formatting
  global.css     # Tailwind entry
```

## Setup

Requires Node and the Expo tooling (installed via `npx`). For a device, install **Expo Go**; for simulators, install Xcode (iOS) and/or Android Studio.

```bash
npm install
```

Environment variables are optional. Copy the example if you want to point at a backend:

```bash
cp .env.example .env
```

`.env` variables (see `.env.example`):

| Variable | Required | Description |
| --- | --- | --- |
| `EXPO_PUBLIC_API_BASE_URL` | No | Base URL of the backend proxy (e.g. `https://api.example.com`). Leave blank to run on mock data. **Never put a provider API key here** — this value is embedded in the bundle. |

## Run

Scripts are from `package.json`:

```bash
npm start        # start the Expo dev server (press i / a, or scan the QR in Expo Go)
npm run ios      # start and open the iOS simulator
npm run android  # start and open the Android emulator
npm run web      # start the web target
npm run lint     # expo lint
```

## Project status

**Early / Phase 1.** One screen, working end-to-end on mock data; the backend-fetch path is implemented and payload-validated but not yet connected to a real backend (none exists in this repo). Planned but not built: investor/agent/seller features, accounts, maps, and alerts.
