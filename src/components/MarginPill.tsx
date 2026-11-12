import { View, Text } from "react-native";
import { formatSignedMoney } from "@/format";

// Potential margin vs. list price as a pill: gain colors when zero or positive, loss
// colors when negative. The sign is in the text, not only in the color.
export function MarginPill({ margin }: { margin: number }) {
  const positive = margin >= 0;
  return (
    <View
      className={`self-start rounded-full border px-3 py-1.5 ${
        positive ? "bg-gain-tint border-gain-tint" : "bg-loss-tint border-loss-tint"
      }`}
    >
      <Text
        className={`font-sans-medium font-medium text-[13px] leading-[18px] ${
          positive ? "text-gain" : "text-loss"
        }`}
      >
        {formatSignedMoney(margin)} potential margin vs. list price
      </Text>
    </View>
  );
}
