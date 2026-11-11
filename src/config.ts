// API configuration. This app reads ONLY a base URL — never an API key.
// EXPO_PUBLIC_ vars are embedded in the shipped bundle, which is safe for a
// public URL but would be fatal for a secret. The Rentcast key lives in the
// backend, never here. See CLAUDE.md rule #2.

// Normalize before the falsy check, not after: a value of "/" or "   " must
// collapse to undefined (no backend configured) rather than to "", which would
// leave api.ts building a relative URL instead of failing cleanly.
//
// Trailing slashes are stripped because api.ts appends "/api/property". A base
// URL ending in "/" yields "//api/property", which is NOT merely a path with a
// spare separator — a URL parser reads a leading "//" as protocol-relative and
// takes the next segment as the HOST, so the request misses the route entirely.
//
// That 404 is why this matters more than it looks. api.ts maps 404 to
// "not_found", which the UI renders as "We don't have a report for that address
// yet." So one stray slash in an env var makes the app confidently report no
// data for EVERY address — a plausible answer rather than a visible error, and
// an easy way to spend a day blaming the data provider for a coverage gap that
// does not exist.
//
// Only the trailing slash is stripped. A trailing path segment is left alone:
// "https://api.example.com/v1" is a legitimate config for a backend mounted
// under /v1, and removing it would break a working setup.
const raw = process.env.EXPO_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, "");

export const API_BASE_URL: string | undefined = raw || undefined;

// Demo gate (CLAUDE.md rule #2, narrow exception). Sent as the X-Demo-Key header
// on requests to OUR backend. This value SHIPS IN THE BUNDLE and anyone can
// extract it: it is a speed bump to protect request quota, NOT a secret. It must
// never be a Rentcast or any other data-provider key. Same normalization as the
// base URL: trimmed, and blank collapses to undefined (no header sent).
const rawDemoKey = process.env.EXPO_PUBLIC_DEMO_KEY?.trim();

export const DEMO_KEY: string | undefined = rawDemoKey || undefined;
