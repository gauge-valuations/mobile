import { View, Text } from "react-native";
import type { MarketSnapshot } from "@/types";
import { formatMoneyCompact, formatDaysOnMarket } from "@/format";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 items-center gap-1 px-2">
      {/* Line height ~1.1 (31px); letter spacing -0.02em in px. */}
      <Text className="font-serif text-ink text-[28px] leading-[31px] tracking-[-0.56px] text-center">
        {value}
      </Text>
      {/* Captions may wrap to two lines at phone width. */}
      <Text className="font-mono text-[11px] leading-4 uppercase tracking-wider text-muted text-center">
        {label}
      </Text>
    </View>
  );
}

// Three stats on paper-deep, separated by 1px rule dividers. No border.
export function MarketSnapshotStrip({ market }: { market: MarketSnapshot }) {
  return (
    <View className="flex-row rounded-[18px] bg-paper-deep py-5 px-2">
      {/* Compact with one million decimal ($585K, $1.3M): full dollars do not fit a
          third of a 360px screen. */}
      <Stat label="Median price" value={formatMoneyCompact(market.medianPrice, 1)} />
      <View className="w-px bg-rule" />
      <Stat label="Avg days on market" value={formatDaysOnMarket(market.avgDaysOnMarket)} />
      <View className="w-px bg-rule" />
      <Stat label="ZIP" value={market.zip} />
    </View>
  );
}
