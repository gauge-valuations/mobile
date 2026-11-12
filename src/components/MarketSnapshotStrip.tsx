import { View, Text } from "react-native";
import type { MarketSnapshot } from "@/types";
import { formatMoney, formatDaysOnMarket } from "@/format";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 items-center">
      <Text className="font-mono-medium font-medium text-lg text-ink">{value}</Text>
      <Text className="font-sans text-xs text-muted text-center">{label}</Text>
    </View>
  );
}

export function MarketSnapshotStrip({ market }: { market: MarketSnapshot }) {
  return (
    <View className="flex-row rounded-2xl bg-paper-deep p-4">
      <Stat label="Median price" value={formatMoney(market.medianPrice)} />
      <View className="w-px bg-rule" />
      <Stat label="Avg days on market" value={formatDaysOnMarket(market.avgDaysOnMarket)} />
      <View className="w-px bg-rule" />
      <Stat label="ZIP" value={market.zip} />
    </View>
  );
}
