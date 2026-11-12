import { useColorScheme } from "nativewind";

// The design tokens as hex, for the few props that take a color value instead of a
// class (placeholderTextColor, ActivityIndicator, the web focus outline, the status
// bar, SVG fills). Components otherwise use the token classes from tailwind.config.js.
// Keep in sync with the CSS variables in src/global.css.
export const TOKENS = {
  light: {
    paper: "#faf8f5",
    paperDeep: "#f1ece6",
    card: "#ffffff",
    rule: "#e6dfd7",
    ink: "#111111",
    muted: "#5f5a55",
    accent: "#1f6f50",
    accentTint: "#dcefe5",
    onAccent: "#ffffff",
    loss: "#c81e1e",
    lossTint: "#fee2e2",
    wait: "#8f5c16",
    waitTint: "#fef3c7",
  },
  dark: {
    paper: "#12110f",
    paperDeep: "#1c1a18",
    card: "#1c1a18",
    rule: "#2a2724",
    ink: "#ededed",
    muted: "#8a8580",
    accent: "#4fb589",
    accentTint: "#163326",
    onAccent: "#12110f",
    loss: "#f87171",
    lossTint: "#3a1717",
    wait: "#fbbf25",
    waitTint: "#3a2a0c",
  },
} as const;

export type ResolvedScheme = keyof typeof TOKENS;
export type TokenSet = (typeof TOKENS)[ResolvedScheme];

// The token hex values for the theme currently in effect.
export function useTokens(): TokenSet {
  const { colorScheme } = useColorScheme();
  return TOKENS[colorScheme === "dark" ? "dark" : "light"];
}
