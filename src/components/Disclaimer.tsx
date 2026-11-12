import { Text } from "react-native";

// Required on the results screen: AVMs and rent estimates are estimates.
// See CLAUDE.md rule #4.
export function Disclaimer() {
  return (
    <Text className="font-sans text-xs text-center text-muted px-4">
      Estimates only — not an appraisal.
    </Text>
  );
}
