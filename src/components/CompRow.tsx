import { View, Text } from "react-native";
import type { Comp } from "@/types";
import { formatMoney, bedsBaths, formatDistance, formatPricePerSqft } from "@/format";
import { StatusBadge } from "./StatusBadge";

// Only the fields the row displays, so the landing page can show sample rows without
// the full Comp. Any Comp fits.
export type CompRowData = Pick<
  Comp,
  "address" | "beds" | "baths" | "distanceMiles" | "status" | "price" | "pricePerSqft"
>;

type CompRowProps = {
  comp: CompRowData;
  // Marks a rent comp, whose $/sqft is a monthly rate shown with cents.
  monthly?: boolean;
  // The first row has no divider above it; every other row draws one, so there is
  // never a divider after the last visible row.
  first?: boolean;
};

export function CompRow({ comp, monthly = false, first = false }: CompRowProps) {
  return (
    <View
      className={`flex-row items-center justify-between gap-3 py-3 ${
        first ? "" : "border-t border-rule"
      }`}
    >
      <View className="flex-1 gap-1.5">
        <Text className="font-sans-medium font-medium text-sm text-ink" numberOfLines={1}>
          {comp.address}
        </Text>
        <View className="flex-row flex-wrap items-center gap-2">
          <Text className="font-sans text-xs text-muted">
            {bedsBaths(comp.beds, comp.baths)} · {formatDistance(comp.distanceMiles)}
          </Text>
          <StatusBadge status={comp.status} />
        </View>
      </View>
      {/* Price column never shrinks or wraps; the address column gives way instead. */}
      <View className="shrink-0 items-end gap-0.5">
        <Text className="font-mono-medium font-medium text-sm text-ink" numberOfLines={1}>
          {formatMoney(comp.price)}
        </Text>
        {comp.pricePerSqft !== undefined ? (
          <Text className="font-mono text-xs text-muted" numberOfLines={1}>
            {formatPricePerSqft(comp.pricePerSqft, { monthly })}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
