import type { FontSource } from "expo-font";

// Web: nothing to load here. The same families come from Google Fonts in
// src/app/+html.tsx. Native builds use fonts.native.ts instead, so the font files
// stay out of the web export.
export const APP_FONTS: Record<string, FontSource> = {};
