import { View, Text } from "react-native";
import type { Comp } from "@/types";

const LABELS: Record<Comp["status"], string> = {
  for_sale: "For sale",
  sold: "Sold",
  for_lease: "For lease",
  off_market: "Off market",
};

// Tailwind can't compute class names dynamically, so map status -> full classes.
// Every chip has a 1px border so heights match. Sold is ink on paper-deep with a rule
// border: a real sale, but not colored like a gain. off_market is not a sale, so it is
// the quietest: muted text, no fill and a dashed border in muted at 50% opacity, which
// also keeps it visible in dark mode, where paper-deep and card are the same color.
const STYLES: Record<Comp["status"], string> = {
  for_sale: "bg-accent-tint border-accent-tint",
  sold: "bg-paper-deep border-rule",
  for_lease: "bg-wait-tint border-wait-tint",
  off_market: "bg-transparent border-muted/50 border-dashed",
};

const TEXT_STYLES: Record<Comp["status"], string> = {
  for_sale: "text-accent",
  sold: "text-ink",
  for_lease: "text-wait",
  off_market: "text-muted",
};

export function StatusBadge({ status }: { status: Comp["status"] }) {
  return (
    <View className={`rounded-full border px-2 py-0.5 ${STYLES[status]}`}>
      <Text className={`font-sans-medium font-medium text-xs leading-4 ${TEXT_STYLES[status]}`}>
        {LABELS[status]}
      </Text>
    </View>
  );
}
