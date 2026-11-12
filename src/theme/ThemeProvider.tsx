import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Platform } from "react-native";
import { useColorScheme } from "nativewind";
import { TOKENS, type ResolvedScheme } from "./tokens";
import { THEME_STORAGE_KEY } from "./storageKey";

// The user's theme choice. "system" follows the device setting.
export type ThemePreference = "system" | "light" | "dark";

const IS_WEB = Platform.OS === "web";

function isPreference(value: unknown): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark";
}

// Native has no storage package installed, so the choice lasts for the session only.
let memoryPreference: ThemePreference = "system";

// Storage can be missing or throw (private mode, blocked site data); the app must
// work with nothing saved, so every access is guarded and falls back to "system".
function readPreference(): ThemePreference {
  if (!IS_WEB) return memoryPreference;
  try {
    const stored = globalThis.localStorage?.getItem(THEME_STORAGE_KEY);
    return isPreference(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

function writePreference(preference: ThemePreference) {
  if (!IS_WEB) {
    memoryPreference = preference;
    return;
  }
  try {
    globalThis.localStorage?.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Not saved; the choice still applies until reload.
  }
}

// Web only: the parts of the document NativeWind does not manage, so the browser's
// own surfaces (scrollbars, form controls, the mobile address bar) match the theme.
function applyToDocument(resolved: ResolvedScheme) {
  const doc = globalThis.document;
  if (!doc) return;
  doc.documentElement.style.colorScheme = resolved;
  doc.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute("content", TOKENS[resolved].paper);
  });
}

type ThemeContextValue = {
  preference: ThemePreference;
  resolved: ResolvedScheme;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Holds the theme choice and applies it through NativeWind, so every token class
// (and useTokens) follows it. On web the .dark class on <html> carries the theme; on
// native NativeWind sets the app's Appearance.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { colorScheme, setColorScheme } = useColorScheme();
  // null until storage has been read. Reading in an effect, not during render, keeps
  // the first client render identical to the static web HTML; the pre-paint script
  // in +html.tsx has already set the right colors by then.
  const [preference, setPreferenceState] = useState<ThemePreference | null>(null);

  useEffect(() => {
    setPreferenceState(readPreference());
  }, []);

  useEffect(() => {
    if (preference === null) return;
    if (!IS_WEB) {
      setColorScheme(preference);
      return;
    }
    // On web NativeWind's "system" only removes the .dark class, so resolve the
    // device setting here and keep following it while the choice is "system".
    const query = globalThis.matchMedia?.("(prefers-color-scheme: dark)");
    const apply = () => {
      const resolved: ResolvedScheme =
        preference === "system" ? (query?.matches ? "dark" : "light") : preference;
      setColorScheme(resolved);
      applyToDocument(resolved);
    };
    apply();
    if (preference !== "system" || !query) return;
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [preference, setColorScheme]);

  function setPreference(next: ThemePreference) {
    writePreference(next);
    setPreferenceState(next);
  }

  const value: ThemeContextValue = {
    preference: preference ?? "system",
    resolved: colorScheme === "dark" ? "dark" : "light",
    setPreference,
  };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (value === null) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
