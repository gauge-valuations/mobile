import type { ReactNode } from "react";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";

// Small line icons for the landing sections, drawn on a 24-unit grid. Decorative: the
// headline beside each one carries the meaning.
type IconProps = { color: string; size?: number };

function Frame({ size = 28, children }: { size?: number; children: ReactNode }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {children}
    </Svg>
  );
}

const STROKE = { strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round" } as const;

// Gauge arc with a needle.
export function GaugeIcon({ color, size }: IconProps) {
  return (
    <Frame size={size}>
      <Path d="M4 16a8 8 0 0 1 16 0" stroke={color} {...STROKE} />
      <Line x1={12} y1={16} x2={15.5} y2={11} stroke={color} {...STROKE} />
      <Circle cx={12} cy={16} r={1.5} fill={color} />
    </Frame>
  );
}

// Houses side by side: comparable homes.
export function HomesIcon({ color, size }: IconProps) {
  return (
    <Frame size={size}>
      <Path d="M2.5 12 7 8l4.5 4v7h-9z" stroke={color} {...STROKE} />
      <Path d="M12.5 12 17 8l4.5 4v7h-9z" stroke={color} {...STROKE} />
    </Frame>
  );
}

// Plus over minus: potential margin.
export function MarginIcon({ color, size }: IconProps) {
  return (
    <Frame size={size}>
      <Line x1={12} y1={4} x2={12} y2={12} stroke={color} {...STROKE} />
      <Line x1={8} y1={8} x2={16} y2={8} stroke={color} {...STROKE} />
      <Line x1={8} y1={17} x2={16} y2={17} stroke={color} {...STROKE} />
    </Frame>
  );
}

// A key: rent.
export function KeyIcon({ color, size }: IconProps) {
  return (
    <Frame size={size}>
      <Circle cx={8} cy={12} r={4} stroke={color} {...STROKE} />
      <Path d="M12 12h9M18 12v3M21 12v2" stroke={color} {...STROKE} />
    </Frame>
  );
}

// A receipt with a zigzag bottom: the method.
export function ReceiptIcon({ color, size }: IconProps) {
  return (
    <Frame size={size}>
      <Path d="M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5L6 21z" stroke={color} {...STROKE} />
      <Line x1={9} y1={8} x2={15} y2={8} stroke={color} {...STROKE} />
      <Line x1={9} y1={12} x2={15} y2={12} stroke={color} {...STROKE} />
    </Frame>
  );
}

// An info mark: honest limits.
export function InfoIcon({ color, size }: IconProps) {
  return (
    <Frame size={size}>
      <Circle cx={12} cy={12} r={9} stroke={color} {...STROKE} />
      <Line x1={12} y1={11} x2={12} y2={16.5} stroke={color} {...STROKE} />
      <Circle cx={12} cy={7.75} r={1.1} fill={color} />
    </Frame>
  );
}

// Stacked layers: the stack it is built on.
export function LayersIcon({ color, size }: IconProps) {
  return (
    <Frame size={size}>
      <Path d="M12 3 3 8l9 5 9-5z" stroke={color} {...STROKE} />
      <Path d="m3 12.5 9 5 9-5" stroke={color} {...STROKE} />
      <Path d="m3 17 9 5 9-5" stroke={color} {...STROKE} />
    </Frame>
  );
}

// A magnifier: look up a home.
export function SearchIcon({ color, size }: IconProps) {
  return (
    <Frame size={size}>
      <Circle cx={11} cy={11} r={6.5} stroke={color} {...STROKE} />
      <Line x1={16} y1={16} x2={20.5} y2={20.5} stroke={color} {...STROKE} />
    </Frame>
  );
}

// A check mark, for the small line under the hero buttons.
export function CheckIcon({ color, size = 16 }: IconProps) {
  return (
    <Frame size={size}>
      <Rect x={2.5} y={2.5} width={19} height={19} rx={9.5} stroke={color} {...STROKE} />
      <Path d="m8 12.5 2.75 2.75L16 9.5" stroke={color} {...STROKE} />
    </Frame>
  );
}
