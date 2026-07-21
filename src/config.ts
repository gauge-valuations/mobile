// API configuration. This app reads ONLY a base URL — never an API key.
// EXPO_PUBLIC_ vars are embedded in the shipped bundle, which is safe for a
// public URL but would be fatal for a secret. The Rentcast key lives in the
// backend, never here. See CLAUDE.md rule #1.

export const API_BASE_URL: string | undefined =
  process.env.EXPO_PUBLIC_API_BASE_URL || undefined;
