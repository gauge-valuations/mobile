import { View, Text } from "react-native";
import type { Comp } from "@/types";

const LABELS: Record<Comp["status"], string> = {
  for_sale: "For sale",
  sold: "Sold",
  for_lease: "For lease",
};

// Tailwind can't compute class names dynamically, so map status -> full classes.
const STYLES: Record<Comp["status"], string> = {
  for_sale: "bg-blue-100 dark:bg-blue-950",
  sold: "bg-green-100 dark:bg-green-950",
  for_lease: "bg-amber-100 dark:bg-amber-950",
};

const TEXT_STYLES: Record<Comp["status"], string> = {
  for_sale: "text-blue-700 dark:text-blue-300",
  sold: "text-green-700 dark:text-green-300",
  for_lease: "text-amber-700 dark:text-amber-300",
};

export function StatusBadge({ status }: { status: Comp["status"] }) {
  return (
    <View className={`rounded-full px-2 py-0.5 ${STYLES[status]}`}>
      <Text className={`text-xs font-medium ${TEXT_STYLES[status]}`}>{LABELS[status]}</Text>
    </View>
  );
}
