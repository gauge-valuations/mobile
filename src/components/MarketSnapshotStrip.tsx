import { View, Text } from "react-native";
import type { MarketSnapshot } from "@/types";
import { formatMoney, formatDaysOnMarket } from "@/format";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 items-center">
      <Text className="text-lg font-bold text-neutral-900 dark:text-white">{value}</Text>
      <Text className="text-xs text-neutral-500 dark:text-neutral-400 text-center">{label}</Text>
    </View>
  );
}

export function MarketSnapshotStrip({ market }: { market: MarketSnapshot }) {
  return (
    <View className="flex-row rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-4">
      <Stat label="Median price" value={formatMoney(market.medianPrice)} />
      <View className="w-px bg-neutral-300 dark:bg-neutral-700" />
      <Stat label="Avg days on market" value={formatDaysOnMarket(market.avgDaysOnMarket)} />
      <View className="w-px bg-neutral-300 dark:bg-neutral-700" />
      <Stat label="ZIP" value={market.zip} />
    </View>
  );
}
