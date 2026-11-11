import { Pressable, Text } from "react-native";

// How many rows a comp list shows before "Show all N".
export const COLLAPSED_ROW_COUNT = 5;

type ShowAllToggleProps = {
  total: number;
  expanded: boolean;
  onToggle: () => void;
};

// "Show all N" / "Show fewer" under a comp list. Renders nothing when every row
// already fits in the collapsed view.
export function ShowAllToggle({ total, expanded, onToggle }: ShowAllToggleProps) {
  if (total <= COLLAPSED_ROW_COUNT) return null;
  return (
    <Pressable onPress={onToggle} accessibilityRole="button" className="self-start pt-2">
      <Text className="text-sm font-semibold text-blue-600 dark:text-blue-400">
        {expanded ? "Show fewer" : `Show all ${total}`}
      </Text>
    </Pressable>
  );
}
