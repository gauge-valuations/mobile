import { API_BASE_URL } from "./config";
import { MOCK_DATA } from "./mockData";
import { parsePropertyReport, type PropertyReport } from "./types";

// What went wrong fetching a report. These kinds mirror the status codes OUR
// backend returns. The client never talks to a data provider directly, so it can
// only distinguish what the backend preserves — see the 0.B3 note about not
// collapsing 400 and 404 into a generic 500.
// Lives here rather than in types.ts: this is client transport, not the shared
// PropertyReport contract.
export type FetchFailureKind =
  | "bad_address" // 400 — the address could not be parsed or geolocated
  | "not_found" // 404 — the address parsed fine; we have no data for it
  | "quota" // 402 — our data-provider budget is exhausted. Operator problem.
  | "server" // 5xx — backend or upstream failure
  | "network" // the request never completed (offline, DNS, connection reset)
  | "invalid"; // 200, but the payload did not match the contract

export class PropertyReportError extends Error {
  readonly kind: FetchFailureKind;

  constructor(kind: FetchFailureKind, message: string) {
    super(message);
    this.name = "PropertyReportError";
    this.kind = kind;
  }
}

function kindForStatus(status: number): FetchFailureKind {
  if (status === 400) return "bad_address";
  if (status === 402) return "quota";
  if (status === 404) return "not_found";
  return "server";
}

// Fetches a normalized PropertyReport from OUR backend.
// When no base URL is configured (pre-backend / offline), returns MOCK_DATA.
// When a base URL is set, failures and invalid payloads reject so the UI can
// show an error instead of silently serving hardcoded mock data.
export async function getPropertyReport(address: string): Promise<PropertyReport> {
  if (API_BASE_URL === undefined) {
    return MOCK_DATA;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/api/property?address=${encodeURIComponent(address)}`);
  } catch {
    throw new PropertyReportError("network", "The request could not be completed");
  }

  if (!res.ok) {
    const kind = kindForStatus(res.status);
    if (kind === "quota") {
      console.error(
        "[getPropertyReport] Data provider quota exhausted (402). Reports will keep " +
          "failing until the quota resets or the plan is upgraded."
      );
    }
    throw new PropertyReportError(kind, `Request failed (${res.status})`);
  }

  try {
    return parsePropertyReport(await res.json());
  } catch (cause) {
    console.error(
      "[getPropertyReport] Response did not match the PropertyReport contract:",
      cause instanceof Error ? cause.message : cause
    );
    throw new PropertyReportError("invalid", "Response did not match the contract");
  }
}
