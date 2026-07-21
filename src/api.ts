import { API_BASE_URL } from "./config";
import { MOCK_DATA } from "./mockData";
import type { PropertyReport } from "./types";

// Fetches a normalized PropertyReport from OUR backend. Falls back to MOCK_DATA
// when no base URL is configured or the network call fails, so the UI always
// has something to render. See CLAUDE.md "Data fetching".
export async function getPropertyReport(address: string): Promise<PropertyReport> {
  if (API_BASE_URL === undefined) {
    return MOCK_DATA;
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/property?address=${encodeURIComponent(address)}`
    );
    if (!res.ok) {
      return MOCK_DATA;
    }
    return (await res.json()) as PropertyReport;
  } catch {
    return MOCK_DATA;
  }
}
