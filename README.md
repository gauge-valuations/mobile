# Gauge Valuations (mobile and web client)

Gauge turns a US property address into a one-screen buyer report: property facts, an estimated value, comparable homes, a rent estimate and local market context. This repo is the client app. It is one Expo and React Native codebase that builds for iOS, Android and web. The web version is the one you can click today.

- Live web app: https://gauge-valuations.vercel.app
- Backend repo: https://github.com/gauge-valuations/backend

The two sample addresses under the search box always load. Try one first.

## What the screen shows

Before a search, the screen opens on a short intro: a serif headline, one line on what the report covers, the search box and the two sample addresses. A header with the Gauge mark stays at the top, with a theme toggle that cycles system, light and dark. The web version remembers the choice; the native apps keep it for the session.

While a report loads, grey placeholder blocks in the shape of the first cards stand in for it. They pulse gently. When the report arrives, its sections fade in and rise slightly, one after another. Both effects are skipped when the device asks for reduced motion.

For an address, the report shows:

- **Property facts.** Beds, baths, square footage, year built, lot size and last sale. Missing fields show "—".
- **Estimated value**, as a large headline number with price per square foot. Below it, a range bar shows the low and high ends of the value range, a marker for the estimate and, when the home is listed, a second marker for the list price. If the estimate rests on few comparable homes, the card says so.
- **Potential margin vs. list price.** This is the estimated value minus the list price, shown as a signed amount in a green or red pill. The client works it out and shows it only when the home has a list price. For a home with no active listing, the card shows "No current list price, so no potential margin." It is not value minus what is owed: the app cannot know that from an address.
- **Comparable homes**, with price, price per square foot, beds and baths, distance and status. Comp prices are asking prices. Off-market comps are inactive listings marked "Off market", and their price is the last asking price, not a sale price. Lists longer than 5 rows collapse behind a "Show all" toggle.
- **Rent estimate.** Monthly rent with rent per square foot, a range, and rent comps.
- **Market snapshot.** Median price, average days on market and ZIP.
- **Disclaimer.** "Estimates only — not an appraisal." It is shown on every report.

If a lookup fails, a tinted card takes the report's place with a short label and the message for that kind of failure (see the table under Architecture). Address problems and the demo limit use an amber tint; server, connection and timeout problems use a red one. A Retry button appears only where a second attempt could help.

The numbers come from the backend's own valuation engine, not straight from the data provider. The backend recomputes the estimate from comparable homes. It takes each comp's price per square foot, drops outliers, and weights the rest by how similar the provider scores each comp to the home. It then multiplies the weighted median by the home's square footage. If fewer than three usable comps remain, it falls back to the provider's own estimate and marks it low confidence. The full method is in the [backend README](https://github.com/gauge-valuations/backend#how-the-valuation-works).

**Tech stack:** Expo (React Native), TypeScript, Expo Router, NativeWind, react-native-svg, react-native-reanimated.

## Architecture

```
+----------------------+        +---------------------------+        +----------+
|  This app            |  GET   |  Gauge backend API        |        |          |
|  iOS / Android / web | -----> |  (Next.js on Vercel)      | -----> | Rentcast |
|                      | <----- |  holds the provider key,  | <----- |          |
|                      |  JSON  |  caches, values, budgets  |        |          |
+----------------------+        +---------------------------+        +----------+
```

**No data-provider key in the app, ever.** Anyone can extract values from a mobile or web bundle. So the app knows only two things, both read from `EXPO_PUBLIC_*` variables in `src/config.ts`:

- the backend base URL;
- a public demo key, sent as the `X-Demo-Key` header. It is a speed bump against casual quota use, not a secret, and is expected to be extractable.

The Rentcast key lives only on the backend. The app calls one endpoint: `GET ${EXPO_PUBLIC_API_BASE_URL}/api/property?address=<encoded>`.

**A typed contract that outlives the data source.** `src/types.ts` defines the `PropertyReport` shape the backend must return. `parsePropertyReport` checks incoming JSON against it at runtime and rejects anything that does not match, rather than rendering bad numbers. Nothing in the client refers to Rentcast. Changing or adding data providers is a backend change, as long as the response keeps this shape. That is why the contract, not the provider integration, is the part designed to last. New fields are optional, so an older backend response still validates. The backend keeps a byte-for-byte copy of this file.

**Failures are classified, not swallowed.** `getPropertyReport` in `src/api.ts` maps each failure to one of seven kinds:

| Kind | Cause |
| --- | --- |
| `bad_address` | 400, the address could not be parsed |
| `not_found` | 404, no data for that address |
| `quota` | 402, the demo's monthly data limit is reached |
| `server` | any other non-OK status |
| `network` | the request never completed (offline, DNS, reset) |
| `timeout` | no answer within 15 seconds |
| `invalid` | 200, but the body did not match the contract |

Each kind has its own calm message on screen. Only the kinds that a second attempt could fix (`server`, `network`, `timeout`) offer a Retry button. Responses from a superseded search are discarded.

**Mock data only when no backend is configured.** If `EXPO_PUBLIC_API_BASE_URL` is unset, the app returns `MOCK_DATA` from `src/mockData.ts`, so UI work needs no backend. Once a base URL is set, the app never falls back to mock data. A failed request shows an error, not a fake report.

## Run it locally

Requires Node and npm. For a phone, install Expo Go. For simulators, install Xcode (iOS) or Android Studio.

```bash
npm install
cp .env.example .env
```

Set these in `.env`. Leave both blank to run on mock data.

- `EXPO_PUBLIC_API_BASE_URL`, the backend base URL
- `EXPO_PUBLIC_DEMO_KEY`, the demo gate value (optional; no header is sent when blank)

Start commands, from `package.json`:

```bash
npm start          # expo start: dev server, then press i / a or scan the QR code in Expo Go
npm run ios        # expo start --ios
npm run android    # expo start --android
npm run web        # expo start --web
npm run build:web  # expo export --platform web --output-dir dist (static web build in dist/)
```

**Deployment.** The live web app is a Vercel project built from this repo's `main` branch:

- build command: `npm run build:web`
- output directory: `dist`
- `EXPO_PUBLIC_API_BASE_URL` and `EXPO_PUBLIC_DEMO_KEY` set as build-time environment variables, because `EXPO_PUBLIC_*` values are inlined into the bundle at build time.

**Device testing.** Expo Go on a phone, or a simulator, must be able to reach the dev server's address from that device. Usually that means the same network, or a tunnel. The web build is the most reliably verified target.

## Status

**Built and live:**

- Web app deployed at https://gauge-valuations.vercel.app, connected to the live backend.
- The single buyer report screen, with an intro screen before the first search, placeholder blocks while loading, tinted error cards, and the report.
- Light and dark themes with a toggle (system, light, dark), remembered on the web.
- Property facts, estimated value with price per square foot, a value range bar and a low-confidence note.
- Potential margin vs. list price, worked out on the client when a list price exists.
- Comparable homes with off-market comps marked and a "Show all" toggle.
- Rent estimate with rent per square foot, range and rent comps.
- Market snapshot and the disclaimer.
- Runtime contract validation, classified errors with a 15 second timeout, and two sample addresses that always load.

**Known limits:**

- Comp prices are asking prices, not sale prices. Texas does not disclose sale prices, and off-market comps show their last asking price.
- The demo runs on a free-tier data plan with a monthly limit. Once that limit is reached, only the two sample addresses are guaranteed to load.
- Real data requires the backend. Without a base URL the app shows mock data.
- The iOS and Android builds share the same code but have not been verified against the live backend. The web version is the verified target.

**Planned, not built:**

- Reports for other personas: investors, agents and sellers.
- An ML valuation model and LLM-written summaries.
- User accounts.
- Maps.

## Project structure

```
src/
  app/
    _layout.tsx        root stack, page title
    +html.tsx          static web document head (web export only)
    index.tsx          the report screen and its four states
  components/          cards and rows (ValuationCard, CompsList, RentCard, ...)
  theme/               design tokens, theme choice (ThemeProvider) and native font loading
  api.ts               getPropertyReport: fetch, timeout, failure kinds
  types.ts             PropertyReport contract and parsePropertyReport
  config.ts            reads the EXPO_PUBLIC_* variables
  format.ts            money, range, per-square-foot and date formatting
  mockData.ts          used only when no base URL is set
  sampleAddresses.ts   the "Try:" addresses
  global.css           Tailwind entry
```

**Why NativeWind and Expo Router:**

- **NativeWind** lets the same Tailwind class names style the native and web builds. One set of components covers all three platforms without per-platform stylesheets.
- **Expo Router** gives file-based routes. It also produces the static web export that Vercel serves, so the web deploy is a plain build step with no separate web app.
