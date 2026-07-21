import { Text } from "react-native";

// Required on the results screen: AVMs and rent estimates are estimates.
// See CLAUDE.md rule #3.
export function Disclaimer() {
  return (
    <Text className="text-xs text-center text-neutral-400 dark:text-neutral-500 px-4">
      Estimates only — not an appraisal.
    </Text>
  );
}
