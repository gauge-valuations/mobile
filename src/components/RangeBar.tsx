import { useState } from "react";
import { View, Text, type LayoutChangeEvent } from "react-native";

type RangeBarProps = {
  low: number;
  high: number;
  estimate: number;
  // Second marker (ink), shown only when present. The rent bar never passes one.
  listPrice?: number;
  // Formats the low/high end labels: compact for value, whole dollars for rent.
  format: (amount: number) => string;
  // "regular": 6px track, 14px markers, legend. "compact": 4px track, 10px marker,
  // no legend.
  size?: "regular" | "compact";
  // The real values in words, since the bar itself is visual only.
  accessibilityLabel: string;
};

type Positions = { low: number; high: number; estimate: number; listPrice?: number };

const PAD_FRACTION = 0.08;
// Minimum space between the two end labels when they sit at the fill ends.
const LABEL_GAP = 8;

type LabelWidths = { row?: number; low?: number; high?: number };

function widthFrom(event: LayoutChangeEvent): number {
  return event.nativeEvent.layout.width;
}

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value));
}

// Maps each value to a 0-100 position on the track. The domain covers the range, the
// estimate and the list price, padded by 8% of the span on both sides so markers never
// touch the ends. A zero span (all values equal) puts everything at the middle.
export function rangePositions(
  low: number,
  high: number,
  estimate: number,
  listPrice?: number,
): Positions {
  const min = Math.min(low, estimate, listPrice ?? low);
  const max = Math.max(high, estimate, listPrice ?? high);
  const span = max - min;
  if (span <= 0) {
    return { low: 50, high: 50, estimate: 50, listPrice: listPrice === undefined ? undefined : 50 };
  }
  const start = min - span * PAD_FRACTION;
  const width = span * (1 + 2 * PAD_FRACTION);
  const at = (value: number) => clampPercent(((value - start) / width) * 100);
  return {
    low: at(low),
    high: at(high),
    estimate: at(estimate),
    listPrice: listPrice === undefined ? undefined : at(listPrice),
  };
}

function Marker({ left, height, className }: { left: number; height: number; className: string }) {
  // 3px wide, centered on its value.
  return (
    <View
      className={`absolute top-0 w-[3px] rounded-full ${className}`}
      style={{ left: `${left}%`, height, marginLeft: -1.5 }}
    />
  );
}

function LegendTick({ className, label }: { className: string; label: string }) {
  return (
    <View className="flex-row items-center gap-1.5">
      <View className={`h-2.5 w-[3px] rounded-full ${className}`} />
      <Text className="font-sans text-xs text-muted">{label}</Text>
    </View>
  );
}

// Horizontal value range: rule-colored track, accent-tint fill from low to high, an
// accent marker for the estimate and an ink marker for the list price. Built from
// plain Views with percentage positions so it renders the same on web and native.
// Markers carry no labels (they would collide); the legend explains them.
export function RangeBar({
  low,
  high,
  estimate,
  listPrice,
  format,
  size = "regular",
  accessibilityLabel,
}: RangeBarProps) {
  const pos = rangePositions(low, high, estimate, listPrice);
  const compact = size === "compact";
  const trackHeight = compact ? 4 : 6;
  const markerHeight = compact ? 10 : 14;
  const trackTop = (markerHeight - trackHeight) / 2;

  // End labels sit under the fill ends (low starts at the fill's left edge, high ends at
  // its right edge) when the fill is wide enough for both side by side. Otherwise, and
  // until the widths are measured, they fall back to the bar's outer edges. Either way
  // they stay inside the bar, so nothing overflows.
  const [widths, setWidths] = useState<LabelWidths>({});
  const measure = (key: keyof LabelWidths) => (event: LayoutChangeEvent) => {
    const width = widthFrom(event);
    setWidths((prev) => (prev[key] === width ? prev : { ...prev, [key]: width }));
  };
  const fillWidth =
    widths.row === undefined ? 0 : ((pos.high - pos.low) / 100) * widths.row;
  const anchored =
    widths.low !== undefined &&
    widths.high !== undefined &&
    fillWidth >= widths.low + widths.high + LABEL_GAP;

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      className="gap-1.5"
    >
      <View style={{ height: markerHeight }}>
        <View
          className="absolute left-0 right-0 rounded-full bg-rule"
          style={{ top: trackTop, height: trackHeight }}
        >
          <View
            className="absolute top-0 bottom-0 rounded-full bg-accent-tint"
            style={{ left: `${pos.low}%`, width: `${Math.max(0, pos.high - pos.low)}%` }}
          />
        </View>
        {pos.listPrice !== undefined ? (
          <Marker left={pos.listPrice} height={markerHeight} className="bg-ink" />
        ) : null}
        <Marker left={pos.estimate} height={markerHeight} className="bg-accent" />
      </View>
      <View className="h-4" onLayout={measure("row")}>
        <Text
          onLayout={measure("low")}
          className="absolute top-0 font-mono text-xs leading-4 text-muted"
          style={{ left: anchored ? `${pos.low}%` : 0 }}
        >
          {format(low)}
        </Text>
        <Text
          onLayout={measure("high")}
          className="absolute top-0 font-mono text-xs leading-4 text-muted"
          style={{ right: anchored ? `${100 - pos.high}%` : 0 }}
        >
          {format(high)}
        </Text>
      </View>
      {compact ? null : (
        <View className="flex-row flex-wrap gap-4 pt-0.5">
          <LegendTick className="bg-accent" label="Estimate" />
          {listPrice !== undefined ? <LegendTick className="bg-ink" label="List price" /> : null}
        </View>
      )}
    </View>
  );
}
