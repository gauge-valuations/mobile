import { View, Text } from "react-native";
import type { Comp } from "@/types";
import { formatMoney, bedsBaths, formatDistance, formatPricePerSqft } from "@/format";
import { StatusBadge } from "./StatusBadge";

// `monthly` marks a rent comp, whose $/sqft is a monthly rate shown with cents.
export function CompRow({ comp, monthly = false }: { comp: Comp; monthly?: boolean }) {
  return (
    <View className="flex-row items-center justify-between py-3 border-b border-neutral-100 dark:border-neutral-800">
      <View className="flex-1 pr-3 gap-1">
        <Text className="text-sm font-medium text-neutral-900 dark:text-white" numberOfLines={1}>
          {comp.address}
        </Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-xs text-neutral-500 dark:text-neutral-400">
            {bedsBaths(comp.beds, comp.baths)} · {formatDistance(comp.distanceMiles)}
          </Text>
          <StatusBadge status={comp.status} />
        </View>
      </View>
      <View className="items-end">
        <Text className="text-base font-semibold text-neutral-900 dark:text-white">
          {formatMoney(comp.price)}
        </Text>
        {comp.pricePerSqft !== undefined ? (
          <Text className="text-xs text-neutral-500 dark:text-neutral-400">
            {formatPricePerSqft(comp.pricePerSqft, { monthly })}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
