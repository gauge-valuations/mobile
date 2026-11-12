import { View, Text } from "react-native";
import type { Comp } from "@/types";
import { formatMoney, bedsBaths, formatDistance, formatPricePerSqft } from "@/format";
import { StatusBadge } from "./StatusBadge";

// `monthly` marks a rent comp, whose $/sqft is a monthly rate shown with cents.
export function CompRow({ comp, monthly = false }: { comp: Comp; monthly?: boolean }) {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-rule">
      <View className="flex-1 pr-3 gap-1">
        <Text className="font-sans-medium font-medium text-sm text-ink" numberOfLines={1}>
          {comp.address}
        </Text>
        <View className="flex-row items-center gap-2">
          <Text className="font-sans text-xs text-muted">
            {bedsBaths(comp.beds, comp.baths)} · {formatDistance(comp.distanceMiles)}
          </Text>
          <StatusBadge status={comp.status} />
        </View>
      </View>
      <View className="items-end">
        <Text className="font-mono-medium font-medium text-base text-ink">
          {formatMoney(comp.price)}
        </Text>
        {comp.pricePerSqft !== undefined ? (
          <Text className="font-mono text-xs text-muted">
            {formatPricePerSqft(comp.pricePerSqft, { monthly })}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
