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
[role="button"]:focus-visible, button:focus-visible, a:focus-visible {
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
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
