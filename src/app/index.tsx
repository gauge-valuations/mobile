import { useRef, useState } from "react";
import { ScrollView, View, Text, ActivityIndicator, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getPropertyReport, PropertyReportError, type FetchFailureKind } from "@/api";
import type { PropertyReport } from "@/types";
import { AddressSearch } from "@/components/AddressSearch";
import { PropertyFactsCard } from "@/components/PropertyFactsCard";
import { ValuationCard } from "@/components/ValuationCard";
import { CompsList } from "@/components/CompsList";
import { RentCard } from "@/components/RentCard";
import { MarketSnapshotStrip } from "@/components/MarketSnapshotStrip";
import { Disclaimer } from "@/components/Disclaimer";

// What the screen is showing. A discriminated union rather than a flat status plus
// parallel state, so "error with no reason" and "done with no report" are not
// representable.
type Screen =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; failure: FetchFailureKind }
  | { kind: "done"; report: PropertyReport };

// Keyed by FetchFailureKind so adding a kind fails to compile until its copy and
// retry policy are decided. Same pattern as StatusBadge.
const FAILURE_COPY: Record<FetchFailureKind, string> = {
  bad_address: "We couldn't make sense of that address. Check the street, city and ZIP, then try again.",
  not_found:
    "We couldn't find property data for that address. Check the street, city and ZIP, or tap one of the sample addresses above.",
  quota:
    "This demo has reached its monthly data limit, so new addresses can't be looked up right now. The two sample addresses above always work. Tap one to see a full report.",
  server: "We couldn't load this report right now. Please try again in a moment.",
  network: "We couldn't connect. Check your internet connection and try again.",
  timeout: "This is taking longer than usual. Please try again.",
  invalid: "Something went wrong loading this report. Try a different address or one of the samples above.",
};

// Retry only helps when the failure might not recur. A bad or unknown address and
// an exhausted quota will fail identically on a second tap; a contract violation is
// a backend bug that re-fetching cannot fix.
const RETRYABLE: Record<FetchFailureKind, boolean> = {
  bad_address: false,
  not_found: false,
  quota: false,
  server: true,
  network: true,
  timeout: true,
  invalid: false,
};

// The one Phase 1 retail-buyer screen. Enter an address -> see the report.
export default function ResultsScreen() {
  const [screen, setScreen] = useState<Screen>({ kind: "idle" });
  const [lastAddress, setLastAddress] = useState("");
  // Ignore responses from superseded searches so out-of-order fetches cannot overwrite newer results.
  const searchIdRef = useRef(0);

  async function search(address: string) {
    const searchId = ++searchIdRef.current;
    setLastAddress(address);
    setScreen({ kind: "loading" });
    try {
      const report = await getPropertyReport(address);
      if (searchId !== searchIdRef.current) return;
      setScreen({ kind: "done", report });
    } catch (error) {
      if (searchId !== searchIdRef.current) return;
      setScreen({
        kind: "error",
        failure: error instanceof PropertyReportError ? error.kind : "server",
      });
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-black" edges={["top", "left", "right"]}>
      <ScrollView contentContainerClassName="w-full max-w-[720px] self-center p-4 gap-4" keyboardShouldPersistTaps="handled">
        <AddressSearch onSearch={search} loading={screen.kind === "loading"} />

        {screen.kind === "idle" ? (
          <View className="items-center py-16 px-6">
            <Text className="text-base text-center text-neutral-500 dark:text-neutral-400">
              Enter an address above to see property facts, an estimated value, comparable homes,
              a rent estimate, and market context.
            </Text>
          </View>
        ) : null}

        {screen.kind === "loading" ? (
          <View className="items-center py-16 gap-3">
            <ActivityIndicator />
            <Text className="text-sm text-neutral-500 dark:text-neutral-400">
              Fetching report…
            </Text>
          </View>
        ) : null}

        {screen.kind === "error" ? (
          <View className="items-center py-16 gap-3 px-6">
            <Text className="text-base text-center text-neutral-700 dark:text-neutral-300">
              {FAILURE_COPY[screen.failure]}
            </Text>
            {RETRYABLE[screen.failure] ? (
              <Pressable
                onPress={() => search(lastAddress)}
                className="rounded-xl bg-blue-600 px-5 py-3"
              >
                <Text className="text-base font-semibold text-white">Retry</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {screen.kind === "done" ? (
          <View className="gap-4">
            <PropertyFactsCard property={screen.report.property} />
            <ValuationCard valuation={screen.report.valuation} />
            <CompsList comps={screen.report.comps} />
            <RentCard rent={screen.report.rent} />
            <MarketSnapshotStrip market={screen.report.market} />
            <Disclaimer />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
