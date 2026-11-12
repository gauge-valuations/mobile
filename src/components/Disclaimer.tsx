import { View, Text } from "react-native";

// Required on the results screen: AVMs and rent estimates are estimates.
// See CLAUDE.md rule #4.
export function Disclaimer() {
  return (
    <View className="border-t border-rule p-4">
      <Text className="font-sans text-xs text-center text-muted">
        Estimates only — not an appraisal.
      </Text>
    </View>
  );
}
