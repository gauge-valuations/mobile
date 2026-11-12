import Svg, { Circle, Line, Path, Rect } from "react-native-svg";
import { useTokens } from "@/theme/tokens";
import { HIDDEN_FROM_SCREEN_READERS } from "./hiddenFromScreenReaders";

// Gauge's own mark: an accent rounded square with a gauge arc (a semicircle) and a
// small needle drawn in the on-accent color. Decorative; the wordmark beside it
// carries the name.
export function LogoMark({ size = 28 }: { size?: number }) {
  const tokens = useTokens();
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" {...HIDDEN_FROM_SCREEN_READERS}>
      <Rect x={0} y={0} width={28} height={28} rx={8} fill={tokens.accent} />
      <Path
        d="M7 18a7 7 0 0 1 14 0"
        stroke={tokens.onAccent}
        strokeWidth={2.25}
        strokeLinecap="round"
        fill="none"
      />
      <Line
        x1={14}
        y1={18}
        x2={17.6}
        y2={13.4}
        stroke={tokens.onAccent}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Circle cx={14} cy={18} r={1.75} fill={tokens.onAccent} />
    </Svg>
  );
}
