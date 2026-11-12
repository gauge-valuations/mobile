import { View, Text } from "react-native";

// Shown on the valuation card when the estimate rests on few comparable homes.
export function LowConfidenceNote() {
  return (
    <View className="rounded-[10px] bg-wait-tint p-3">
      <Text className="font-sans text-sm text-wait">Low confidence: few comparable homes.</Text>
    </View>
  );
}
