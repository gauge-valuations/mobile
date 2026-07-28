import { API_BASE_URL } from "./config";
import { MOCK_DATA } from "./mockData";
import { parsePropertyReport, type PropertyReport } from "./types";

// Fetches a normalized PropertyReport from OUR backend.
// When no base URL is configured (pre-backend / offline), returns MOCK_DATA.
// When a base URL is set, failures and invalid payloads reject so the UI can
// show an error instead of silently serving hardcoded mock data.
export async function getPropertyReport(address: string): Promise<PropertyReport> {
  if (API_BASE_URL === undefined) {
    return MOCK_DATA;
  }

  const res = await fetch(
    `${API_BASE_URL}/api/property?address=${encodeURIComponent(address)}`
  );
  if (!res.ok) {
    throw new Error(`Property report request failed (${res.status})`);
  }
  return parsePropertyReport(await res.json());
}
