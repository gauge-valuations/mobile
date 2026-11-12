import type { PropsWithChildren } from "react";
import { ScrollViewStyleReset } from "expo-router/html";
import { THEME_STORAGE_KEY } from "@/theme/storageKey";

// Root HTML for the static web export. Runs only at build time (in Node), only for web,
// so it must not use browser globals. Native apps never see this file.

// Same values as the paper token (src/global.css, src/theme/tokens.ts).
const LIGHT_BG = "#faf8f5";
const DARK_BG = "#12110f";

// Newsreader 400, Geist 400/500, Geist Mono 400/500. display=swap shows the fallback
// stack from tailwind.config.js until each font arrives.
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&family=Geist:wght@400;500&family=Newsreader:opsz,wght@6..72,400&display=swap";

// Paints the whole window from the tokens before the bundle loads, so there is no
// white flash or bar. The variables come from src/global.css; the .dark class that
// selects the dark values is set by themeScript below.
const backgroundCss = `
html, body, #root { background-color: rgb(var(--color-paper)); color: rgb(var(--color-ink)); }
`;

// Keyboard focus ring for every button-like control (Search, Try chips, Show all, the
// theme toggle, Retry): 2px in the accent token. :focus-visible keeps it off for mouse
// and touch. The address input draws its own accent ring in AddressSearch.tsx.
const focusCss = `
html [role="button"]:focus-visible, html [role="link"]:focus-visible,
html button:focus-visible, html a:focus-visible {
  outline: 2px solid rgb(var(--color-accent));
  outline-offset: 2px;
}
`;

// Runs before first paint: applies the saved theme choice (or the device setting) so
// a reload shows the right theme at once. Mirrors ThemeProvider.tsx; storage access is
// guarded so blocked storage falls back to the device setting.
const themeScript = `(function () {
  var pref = "system";
  try { pref = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}) || "system"; } catch (e) {}
  var dark = pref === "dark" ||
    (pref !== "light" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  var root = document.documentElement;
  if (dark) root.classList.add("dark"); else root.classList.remove("dark");
  root.style.colorScheme = dark ? "dark" : "light";
  var metas = document.querySelectorAll('meta[name="theme-color"]');
  for (var i = 0; i < metas.length; i++) metas[i].setAttribute("content", dark ? "${DARK_BG}" : "${LIGHT_BG}");
  // Motion is on unless the device asks for reduced motion. Reveal items are only
  // hidden (until revealed) under this class; see motionCss.
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) root.classList.add("motion");
})();`;

// Subtle film grain for the landing page's forest band (class "grain"): grayscale SVG
// noise, blended over the band at low opacity and drawn under the band's content.
const GRAIN_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'>" +
  "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/>" +
  "<feColorMatrix type='saturate' values='0'/></filter>" +
  "<rect width='100%' height='100%' filter='url(%23n)'/></svg>";
const grainCss = `
.grain { position: relative; }
.grain::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.16;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,${GRAIN_SVG}");
  background-size: 180px 180px;
}
`;

// Motion for the landing page, the header and the report's range bar. Timings measured
// on the reference site (CLAUDE.md "Motion"). Only opacity and transform animate, plus
// stroke-dashoffset for the hero arc and the header's background, border and blur.
// Reveal items (data-reveal-from) are hidden only under html.motion, and a CSS-only
// fallback shows them 1.5s after they enter the page unless JavaScript has taken them
// over (data-reveal-armed). src/motion/revealController.ts sets data-revealed.
const motionCss = `
:root { --ease-reveal: cubic-bezier(0.22, 1, 0.36, 1); --ease-ui: cubic-bezier(0.4, 0, 0.2, 1); }

[data-reveal-from] {
  transition-property: opacity, transform;
  transition-duration: 700ms;
  transition-timing-function: var(--ease-reveal);
}
[data-reveal-from="growx"] { transform-origin: left center; }
html.motion [data-reveal-from]:not([data-revealed]):not([data-reveal-from="draw"]) { opacity: 0; }
html.motion [data-reveal-from="y32"]:not([data-revealed]) { transform: translateY(32px); }
html.motion [data-reveal-from="y24"]:not([data-revealed]) { transform: translateY(24px); }
html.motion [data-reveal-from="y16"]:not([data-revealed]) { transform: translateY(16px); }
html.motion [data-reveal-from="y12"]:not([data-revealed]) { transform: translateY(12px); }
html.motion [data-reveal-from="y6"]:not([data-revealed]) { transform: translateY(6px); }
html.motion [data-reveal-from="x-10"]:not([data-revealed]) { transform: translateX(-10px); }
html.motion [data-reveal-from="scale"]:not([data-revealed]) { transform: scale(0.92); }
html.motion [data-reveal-from="tilt"]:not([data-revealed]) { transform: translateY(16px) rotate(-3deg); }
html.motion [data-reveal-from="growx"]:not([data-revealed]) { transform: scaleX(0); }

/* The hero arc draws itself; its needle and hub fade in near the end. */
[data-reveal-from="draw"] path {
  stroke-dasharray: 40;
  transition: stroke-dashoffset 1980ms var(--ease-reveal) var(--reveal-delay, 0ms);
}
[data-reveal-from="draw"] line, [data-reveal-from="draw"] circle {
  transition: opacity 600ms var(--ease-reveal) calc(var(--reveal-delay, 0ms) + 1200ms);
}
html.motion [data-reveal-from="draw"]:not([data-revealed]) path { stroke-dashoffset: 40; }
html.motion [data-reveal-from="draw"]:not([data-revealed]) line,
html.motion [data-reveal-from="draw"]:not([data-revealed]) circle { opacity: 0; }

/* Never invisible: without JavaScript taking over, show everything 1.5s in. */
html.motion [data-reveal-from]:not([data-revealed]):not([data-reveal-armed]) {
  animation: gauge-show 0s linear 1.5s forwards;
}
html.motion [data-reveal-from="draw"]:not([data-revealed]):not([data-reveal-armed]) path {
  animation: gauge-draw-show 0s linear 1.5s forwards;
}
html.motion [data-reveal-from="draw"]:not([data-revealed]):not([data-reveal-armed]) line,
html.motion [data-reveal-from="draw"]:not([data-revealed]):not([data-reveal-armed]) circle {
  animation: gauge-show 0s linear 1.5s forwards;
}
@keyframes gauge-show { to { opacity: 1; transform: none; } }
@keyframes gauge-draw-show { to { stroke-dashoffset: 0; } }

/* Status dot ring: grows to 7px beyond the 8px dot and fades, every 1.6s. */
html.motion .pulse-ring { animation: gauge-pulse 1.6s ease-in-out infinite; }
@keyframes gauge-pulse {
  0%, 100% { transform: scale(1); opacity: 0.45; }
  50% { transform: scale(2.75); opacity: 0; }
}

/* Hero shape: a slow drift, starting 1.6s after load. */
html.motion .drift { animation: gauge-drift 16s ease-in-out 1.6s infinite; }
@keyframes gauge-drift {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(-24px, 16px) rotate(-5deg); }
  50% { transform: translate(10px, 24px) rotate(2.5deg); }
  75% { transform: translate(24px, -12px) rotate(5deg); }
}

/* Header: background, border and blur change after 41px of scroll. */
[data-header] {
  transition: background-color 300ms var(--ease-ui), border-color 300ms var(--ease-ui),
    backdrop-filter 300ms var(--ease-ui), -webkit-backdrop-filter 300ms var(--ease-ui);
}
[data-header][data-scrolled="true"] {
  backdrop-filter: blur(12px) saturate(1.5);
  -webkit-backdrop-filter: blur(12px) saturate(1.5);
}

/* Hover (pointer devices only) and press. Cards lift 2px; the accent-tinted shadow sits
   on a layer whose opacity fades in. */
.lift, .press { transition: transform 150ms var(--ease-ui), opacity 150ms var(--ease-ui); }
.lift::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  box-shadow: 0 14px 30px -14px rgb(var(--color-accent) / 0.45);
  opacity: 0;
  transition: opacity 150ms var(--ease-ui);
}
@media (hover: hover) {
  .lift:hover { transform: translateY(-2px); }
  .lift:hover::after { opacity: 1; }
  .press:hover { opacity: 0.88; }
}
.press:active { transform: scale(0.98); }

/* Hero card glass (web): translucent card fill (82% light, 95% dark via --glass-alpha),
   backdrop blur, a 1px light border and a large soft accent-tinted shadow. Prefixed with
   "html" so it outranks the base view styles that load after this sheet. */
html .glass {
  background-color: rgb(var(--color-card) / var(--glass-alpha));
  border: 1px solid rgb(var(--color-ink) / 0.12);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  box-shadow: 0 24px 60px -20px rgb(var(--color-accent) / 0.45);
}

/* Landing mock panels: a visible border, a top highlight and a soft shadow, so mocks
   stand off the band. "panel" on paper bands, "panel-night" on night bands. */
html .panel {
  border-color: rgb(var(--color-ink) / 0.14);
  box-shadow: inset 0 1px 0 rgb(var(--color-ink) / 0.04), 0 20px 44px -24px rgb(var(--color-night) / 0.5);
}
html .panel-night {
  background-color: rgb(var(--color-on-night) / 0.04);
  border-color: rgb(var(--color-on-night) / 0.16);
  box-shadow: inset 0 1px 0 rgb(var(--color-on-night) / 0.06);
}

/* Reduced motion: everything in its final state, nothing moves. */
@media (prefers-reduced-motion: reduce) {
  [data-reveal-from], [data-reveal-from] *, [data-header], .lift, .lift::after, .press,
  .pulse-ring, .drift {
    transition: none !important;
    animation: none !important;
  }
}
`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        {/* <title> is set with expo-router/head in _layout.tsx, which also writes it
            into this file's static output. */}
        <meta
          name="description"
          content="Estimated value, comparable homes, rent estimate and market context for any US address."
        />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content={LIGHT_BG} />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content={DARK_BG} />
        {/* Gauge's mark as an SVG icon (public/favicon.svg). Browsers without SVG icon
            support use the PNG that app.json's web.favicon adds. */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTS_HREF} />
        {/* Keeps the root ScrollView doing the scrolling, as on native. */}
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: backgroundCss }} />
        <style dangerouslySetInnerHTML={{ __html: focusCss }} />
        <style dangerouslySetInnerHTML={{ __html: grainCss }} />
        <style dangerouslySetInnerHTML={{ __html: motionCss }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
