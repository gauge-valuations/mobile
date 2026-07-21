import { useState } from "react";
import { ScrollView, View, Text, ActivityIndicator, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getPropertyReport } from "@/api";
import type { PropertyReport } from "@/types";
import { AddressSearch } from "@/components/AddressSearch";
import { PropertyFactsCard } from "@/components/PropertyFactsCard";
import { ValuationCard } from "@/components/ValuationCard";
import { CompsList } from "@/components/CompsList";
import { RentCard } from "@/components/RentCard";
import { MarketSnapshotStrip } from "@/components/MarketSnapshotStrip";
import { Disclaimer } from "@/components/Disclaimer";

type Status = "idle" | "loading" | "error" | "done";

// The one Phase 1 retail-buyer screen. Enter an address -> see the report.
export default function ResultsScreen() {
  const [status, setStatus] = useState<Status>("idle");
  const [report, setReport] = useState<PropertyReport | null>(null);
  const [lastAddress, setLastAddress] = useState("");

  async function search(address: string) {
    setLastAddress(address);
    setStatus("loading");
    try {
      const result = await getPropertyReport(address);
      setReport(result);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-black" edges={["top", "left", "right"]}>
      <ScrollView contentContainerClassName="p-4 gap-4" keyboardShouldPersistTaps="handled">
        <AddressSearch onSearch={search} loading={status === "loading"} />

        {status === "idle" ? (
          <View className="items-center py-16 px-6">
            <Text className="text-base text-center text-neutral-500 dark:text-neutral-400">
              Enter an address above to see property facts, an estimated value, comparable homes,
              a rent estimate, and market context.
            </Text>
          </View>
        ) : null}

        {status === "loading" ? (
          <View className="items-center py-16 gap-3">
            <ActivityIndicator />
            <Text className="text-sm text-neutral-500 dark:text-neutral-400">
              Fetching report…
            </Text>
          </View>
        ) : null}

        {status === "error" ? (
          <View className="items-center py-16 gap-3 px-6">
            <Text className="text-base text-center text-neutral-700 dark:text-neutral-300">
              Something went wrong fetching this report.
            </Text>
            <Pressable
              onPress={() => search(lastAddress)}
              className="rounded-xl bg-blue-600 px-5 py-3"
            >
              <Text className="text-base font-semibold text-white">Retry</Text>
            </Pressable>
          </View>
        ) : null}

        {status === "done" && report ? (
          <View className="gap-4">
            <PropertyFactsCard property={report.property} />
            <ValuationCard valuation={report.valuation} />
            <CompsList comps={report.comps} />
            <RentCard rent={report.rent} />
            <MarketSnapshotStrip market={report.market} />
            <Disclaimer />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
