import type { PropsWithChildren } from "react";
import { ScrollViewStyleReset } from "expo-router/html";

// Root HTML for the static web export. Runs only at build time (in Node), only for web,
// so it must not use browser globals. Native apps never see this file.

// Matches the screen background in src/app/index.tsx (bg-neutral-50 / dark:bg-black).
const LIGHT_BG = "#fafafa";
const DARK_BG = "#000000";

// Paints the whole window before the bundle loads, so there is no white flash or bar
// in dark mode. Dark mode follows the device setting, like NativeWind's "media" mode.
const backgroundCss = `
:root { color-scheme: light dark; }
html, body, #root { background-color: ${LIGHT_BG}; }
@media (prefers-color-scheme: dark) {
  html, body, #root { background-color: ${DARK_BG}; }
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
        {/* Keeps the root ScrollView doing the scrolling, as on native. */}
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: backgroundCss }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
