import { View } from "react-native";
import Animated, { useReducedMotion, type CSSAnimationKeyframes } from "react-native-reanimated";

// Soft pulse, opacity 1 -> 0.5 -> 1. Defined once so re-renders never restart it.
const PULSE: CSSAnimationKeyframes = {
  "0%": { opacity: 1 },
  "50%": { opacity: 0.5 },
  "100%": { opacity: 1 },
};

type SkeletonBlockProps = {
  // Size and shape classes (e.g. "h-4 w-24 rounded-md"); the color is fixed here.
  className: string;
};

// One placeholder bar. Muted at 20% stays visible on the card color in both themes.
// With reduced motion the bar is static.
export function SkeletonBlock({ className }: SkeletonBlockProps) {
  const reduceMotion = useReducedMotion();
  return (
    <Animated.View
      style={
        reduceMotion
          ? undefined
          : {
              animationName: PULSE,
              animationDuration: "1400ms",
              animationIterationCount: "infinite",
              animationTimingFunction: "ease-in-out",
            }
      }
    >
      <View className={`bg-muted/20 ${className}`} />
    </Animated.View>
  );
}
