import { useState } from "react";
import { Platform, Pressable, type ViewStyle } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";
import { useTheme, type ThemePreference } from "@/theme/ThemeProvider";
import { useTokens } from "@/theme/tokens";

const IS_WEB = Platform.OS === "web";

// Each tap moves to the next choice: system -> light -> dark -> system.
const NEXT: Record<ThemePreference, ThemePreference> = {
  system: "light",
  light: "dark",
  dark: "system",
};

const LABEL: Record<ThemePreference, string> = {
  system: "system",
  light: "light",
  dark: "dark",
};

const ICON_SIZE = 20;

// The icon shows the current choice: a half-filled circle for system, a sun for
// light, a crescent for dark. Drawn on a 24-unit grid.
function ThemeIcon({ preference, color }: { preference: ThemePreference; color: string }) {
  return (
    <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none">
      {preference === "system" ? (
        <>
          <Circle cx={12} cy={12} r={8} stroke={color} strokeWidth={1.75} />
          <Path d="M12 4a8 8 0 0 0 0 16Z" fill={color} />
        </>
      ) : null}
      {preference === "light" ? (
        <>
          <Circle cx={12} cy={12} r={4} stroke={color} strokeWidth={1.75} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <Line
                key={deg}
                x1={12 + Math.cos(rad) * 7}
                y1={12 + Math.sin(rad) * 7}
                x2={12 + Math.cos(rad) * 9.5}
                y2={12 + Math.sin(rad) * 9.5}
                stroke={color}
                strokeWidth={1.75}
                strokeLinecap="round"
              />
            );
          })}
        </>
      ) : null}
      {preference === "dark" ? (
        <Path
          d="M19.5 14.5A8 8 0 1 1 9.5 4.5a6.5 6.5 0 0 0 10 10Z"
          stroke={color}
          strokeWidth={1.75}
          strokeLinejoin="round"
        />
      ) : null}
    </Svg>
  );
}

// Theme choice button for the header: a 40px tap target with a visible accent focus
// ring on web (keyboard focus), labelled with the current choice and the next one.
export function ThemeToggle() {
  const { preference, setPreference } = useTheme();
  const tokens = useTokens();
  const [focused, setFocused] = useState(false);
  const next = NEXT[preference];

  const focusRing: ViewStyle | undefined =
    IS_WEB && focused
      ? ({ outlineStyle: "solid", outlineWidth: 2, outlineColor: tokens.accent, outlineOffset: 2 } as ViewStyle)
      : IS_WEB
        ? ({ outlineWidth: 0 } as ViewStyle)
        : undefined;

  return (
    <Pressable
      onPress={() => setPreference(next)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      accessibilityRole="button"
      accessibilityLabel={`Theme: ${LABEL[preference]}. Switch to ${LABEL[next]}.`}
      className="h-10 w-10 items-center justify-center rounded-lg active:bg-paper-deep"
      style={focusRing}
    >
      <ThemeIcon preference={preference} color={tokens.ink} />
    </Pressable>
  );
}
