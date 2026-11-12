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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTS_HREF} />
        {/* Keeps the root ScrollView doing the scrolling, as on native. */}
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: backgroundCss }} />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
