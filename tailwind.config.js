// Token colors read CSS variables from src/global.css, so a class like bg-paper is
// the same in light and dark; the variables carry the theme.
const token = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

// Each family is a stack whose first name is the native family registered by
// src/theme/fonts.native.ts (NativeWind keeps only the first name on native). Browsers
// do not know that name and skip to the Google Fonts family loaded in +html.tsx,
// then to the system fallbacks. On native each weight is its own family, so medium
// gets its own class; on web pair the -medium classes with font-medium for weight.
const SERIF = ['"Newsreader", Georgia, "Times New Roman", serif'];
const SANS = ['"Geist", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'];
const MONO = ['"Geist Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace'];

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Class, not media, so the theme toggle can override the device setting. The
  // .dark class is managed by src/theme/ThemeProvider.tsx (and the pre-paint script
  // in src/app/+html.tsx on web).
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/landing/**/*.{js,jsx,ts,tsx}",
    "./src/motion/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        paper: token("paper"),
        "paper-deep": token("paper-deep"),
        card: token("card"),
        rule: token("rule"),
        ink: token("ink"),
        muted: token("muted"),
        accent: token("accent"),
        "accent-tint": token("accent-tint"),
        "on-accent": token("on-accent"),
        gain: token("accent"),
        "gain-tint": token("accent-tint"),
        loss: token("loss"),
        "loss-tint": token("loss-tint"),
        wait: token("wait"),
        "wait-tint": token("wait-tint"),
        // Landing-page bands; fixed in both themes (see src/global.css).
        night: token("night"),
        "on-night": token("on-night"),
        "night-muted": token("night-muted"),
        "night-accent": token("night-accent"),
        "night-edge": token("night-edge"),
        forest: token("forest"),
        "on-forest": token("on-forest"),
      },
      fontFamily: {
        serif: ["Newsreader_400Regular", ...SERIF],
        sans: ["Geist_400Regular", ...SANS],
        "sans-medium": ["Geist_500Medium", ...SANS],
        mono: ["GeistMono_400Regular", ...MONO],
        "mono-medium": ["GeistMono_500Medium", ...MONO],
      },
    },
  },
  plugins: [],
};
