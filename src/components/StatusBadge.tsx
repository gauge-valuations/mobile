import { View, Text } from "react-native";
import type { Comp } from "@/types";

const LABELS: Record<Comp["status"], string> = {
  for_sale: "For sale",
  sold: "Sold",
  for_lease: "For lease",
  off_market: "Off market",
};

// Tailwind can't compute class names dynamically, so map status -> full classes.
// Sold is ink on paper-deep with a rule border: a real sale, but not colored like a
// gain. off_market is deliberately the quietest (muted, no border): it is not a
// sale, so it must not look like the "Sold" badge.
const STYLES: Record<Comp["status"], string> = {
  for_sale: "bg-accent-tint border border-accent-tint",
  sold: "bg-paper-deep border border-rule",
  for_lease: "bg-wait-tint border border-wait-tint",
  off_market: "bg-paper-deep border border-paper-deep",
};

const TEXT_STYLES: Record<Comp["status"], string> = {
  for_sale: "text-accent",
  sold: "text-ink",
  for_lease: "text-wait",
  off_market: "text-muted",
};

export function StatusBadge({ status }: { status: Comp["status"] }) {
  return (
    <View className={`rounded-full px-2 py-0.5 ${STYLES[status]}`}>
      <Text className={`font-sans-medium font-medium text-xs ${TEXT_STYLES[status]}`}>{LABELS[status]}</Text>
    </View>
  );
}
