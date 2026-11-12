import { Pressable, Text } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTokens } from "@/theme/tokens";

// How many rows a comp list shows before "Show all N".
export const COLLAPSED_ROW_COUNT = 5;

type ShowAllToggleProps = {
  total: number;
  expanded: boolean;
  onToggle: () => void;
};

// "Show all N" / "Show fewer" under a comp list: a quiet accent text button with a
// chevron (down when collapsed, up when expanded) and a 40px minimum tap height.
// Renders nothing when every row already fits in the collapsed view.
export function ShowAllToggle({ total, expanded, onToggle }: ShowAllToggleProps) {
  const tokens = useTokens();
  if (total <= COLLAPSED_ROW_COUNT) return null;
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      className="min-h-[40px] flex-row items-center gap-1.5 self-start py-2.5"
    >
      <Text className="font-sans-medium font-medium text-sm text-accent">
        {expanded ? "Show fewer" : `Show all ${total}`}
      </Text>
      <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
        <Path
          d={expanded ? "M2.5 7.5 6 4l3.5 3.5" : "M2.5 4.5 6 8l3.5-3.5"}
          stroke={tokens.accent}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Pressable>
  );
}
