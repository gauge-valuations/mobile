import { useEffect, useRef, useState } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { ScrollView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { ReportSkeleton } from "@/components/ReportSkeleton";
import { ErrorCard } from "@/components/ErrorCard";
import { Reveal } from "@/components/Reveal";
import { Header, HEADER_SCROLL_THRESHOLD } from "@/components/Header";
import { IdleHero } from "@/components/IdleHero";

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

// The one Phase 1 retail-buyer report screen, at /report. Enter an address -> see the
// report. /report?address=... runs that lookup on load, so links into a report work.
export default function ResultsScreen() {
  const [screen, setScreen] = useState<Screen>({ kind: "idle" });
  const [lastAddress, setLastAddress] = useState("");
  // Ignore responses from superseded searches so out-of-order fetches cannot overwrite newer results.
  const searchIdRef = useRef(0);
  const router = useRouter();
  const params = useLocalSearchParams<{ address?: string }>();
  const urlAddress = typeof params.address === "string" ? params.address.trim() : "";
  // The address most recently searched, so a URL change made by our own search (or a
  // re-render) does not run the same lookup twice.
  const lastSearchedRef = useRef<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setScrolled(e.nativeEvent.contentOffset.y > HEADER_SCROLL_THRESHOLD);

  useEffect(() => {
    if (urlAddress.length > 0 && urlAddress !== lastSearchedRef.current) {
      search(urlAddress);
    }
    // search is recreated each render; the URL address alone decides when to run.
  }, [urlAddress]);

  async function search(address: string) {
    const searchId = ++searchIdRef.current;
    lastSearchedRef.current = address;
    // Keep the address in the URL, so a refresh or a shared link reruns this lookup.
    if (address !== urlAddress) router.setParams({ address });
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
    <SafeAreaView className="flex-1 bg-paper" edges={["top", "left", "right"]}>
      <View className="flex-1">
      {/* First in the DOM so keyboard focus starts in the header; it overlays the top of
          the scrolling report and stays visible over a long report. */}
      <Header scrolled={scrolled} />
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        // 72px for the header that overlays the content, plus the usual 16px.
        contentContainerClassName="w-full max-w-[720px] self-center p-4 pt-[88px] gap-4"
        keyboardShouldPersistTaps="handled"
      >
        {/* The hero's slot stays in the tree (null when not idle) so AddressSearch keeps
            its position and is not remounted, which would clear the typed address. */}
        {screen.kind === "idle" ? <IdleHero /> : null}

        <AddressSearch
          initialValue={urlAddress}
          onSearch={search}
          loading={screen.kind === "loading"}
          showTitle={screen.kind !== "idle"}
        />

        {screen.kind === "loading" ? <ReportSkeleton /> : null}

        {screen.kind === "error" ? (
          <ErrorCard
            failure={screen.failure}
            message={FAILURE_COPY[screen.failure]}
            retryable={RETRYABLE[screen.failure]}
            onRetry={() => search(lastAddress)}
          />
        ) : null}

        {screen.kind === "done" ? (
          // Mounts once per arrival (loading -> done), so the reveal plays once per report.
          <View className="gap-4">
            <Reveal index={0}>
              <PropertyFactsCard property={screen.report.property} />
            </Reveal>
            <Reveal index={1}>
              <ValuationCard valuation={screen.report.valuation} />
            </Reveal>
            <Reveal index={2}>
              <CompsList comps={screen.report.comps} />
            </Reveal>
            <Reveal index={3}>
              <RentCard rent={screen.report.rent} />
            </Reveal>
            <Reveal index={4}>
              <MarketSnapshotStrip market={screen.report.market} />
            </Reveal>
            <Reveal index={5}>
              <Disclaimer />
            </Reveal>
          </View>
        ) : null}
      </ScrollView>
      </View>
    </SafeAreaView>
  );
}
