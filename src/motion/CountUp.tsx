import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useReducedMotion } from "react-native-reanimated";

type CountUpProps = {
  value: number;
  format: (n: number) => string;
  className: string;
  // Wait this long after mount before counting.
  delayMs?: number;
  durationMs?: number;
  // Start from this share of the value (0.8 = 80%).
  fromRatio?: number;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// A number that counts up to its value once, when mounted (or when the value changes,
// i.e. a new report). The final value is always in the layout: it reserves the width so
// nothing shifts, and it is what screen readers get. The counting digits are drawn on
// top and hidden from screen readers. With reduced motion it shows the value at once.
export function CountUp({
  value,
  format,
  className,
  delayMs = 0,
  durationMs = 1200,
  fromRatio = 0.8,
}: CountUpProps) {
  const reduceMotion = useReducedMotion();
  // null = not counting: show the final value.
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    if (reduceMotion) return;
    const from = value * fromRatio;
    let raf = 0;
    let start = 0;
    setShown(from);
    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / durationMs);
      if (p < 1) {
        setShown(from + (value - from) * easeOutCubic(p));
        raf = requestAnimationFrame(step);
      } else {
        setShown(null);
      }
    };
    const timer = setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, delayMs);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
    // Counts once per value; theme switches and other re-renders do not restart it.
  }, [value]);

  const counting = shown !== null;
  return (
    <View className="self-start">
      <Text className={className} style={counting ? { opacity: 0 } : undefined}>
        {format(value)}
      </Text>
      {counting ? (
        <Text aria-hidden className={`absolute left-0 top-0 ${className}`} numberOfLines={1}>
          {format(shown)}
        </Text>
      ) : null}
    </View>
  );
}
