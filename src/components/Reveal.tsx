import type { ReactNode } from "react";
import Animated, { useReducedMotion, type CSSAnimationKeyframes } from "react-native-reanimated";

// Fade in and rise 16px. Defined once: a stable keyframes object means re-renders
// (Show all, theme changes) never restart the animation.
const RISE: CSSAnimationKeyframes = {
  from: { opacity: 0, transform: [{ translateY: 16 }] },
  to: { opacity: 1, transform: [{ translateY: 0 }] },
};

const DURATION_MS = 350;
const STAGGER_MS = 80;

type RevealProps = {
  // Position in the report (0 = first section); sets the stagger delay.
  index: number;
  children: ReactNode;
};

// Reveals one report section when the report arrives. It plays once, on mount.
// The wrapper's own style has no opacity or transform: the "from" values apply only
// during the delay and the run (fill mode "backwards"), so at rest, or if the
// animation never runs, the section is fully visible. With reduced motion no
// animation is applied at all.
export function Reveal({ index, children }: RevealProps) {
  const reduceMotion = useReducedMotion();
  return (
    <Animated.View
      style={
        reduceMotion
          ? undefined
          : {
              animationName: RISE,
              animationDuration: `${DURATION_MS}ms`,
              animationDelay: `${index * STAGGER_MS}ms`,
              animationTimingFunction: "ease-out",
              animationFillMode: "backwards",
            }
      }
    >
      {children}
    </Animated.View>
  );
}
