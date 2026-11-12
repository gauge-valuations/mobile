import { createContext, useContext, useEffect, useRef, type ReactNode, type RefObject } from "react";
import { Platform, View, type ScrollView } from "react-native";
import Animated, { useReducedMotion, type CSSAnimationKeyframes } from "react-native-reanimated";
import { registerReveal, type RevealFrom } from "@/motion/revealController";

const IS_WEB = Platform.OS === "web";

// ---- Mount reveal (report sections; also what native uses) ----

// Fade in and rise 16px. Defined once: a stable keyframes object means re-renders
// (Show all, theme changes) never restart the animation.
const RISE: CSSAnimationKeyframes = {
  from: { opacity: 0, transform: [{ translateY: 16 }] },
  to: { opacity: 1, transform: [{ translateY: 0 }] },
};

const DURATION_MS = 350;
const STAGGER_MS = 80;

function MountReveal({ index, children }: { index: number; children: ReactNode }) {
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

// ---- Load and scroll reveals (web; landing page and the range bar) ----

// The element that actually scrolls (the landing page's ScrollView), used as the
// observer root so "75% down" is measured against it, not the window.
export const ScrollRootContext = createContext<RefObject<ScrollView | null> | null>(null);

// `anchor` is the element whose position triggers the group: its own container, or for
// a group nested in another group (rows inside a section's mock), the outer group's, so
// the rows follow the mock instead of waiting for their own position.
type GroupContext = { anchor: RefObject<View | null>; stagger: number; baseDelay: number };
const RevealGroupContext = createContext<GroupContext | null>(null);

function scrollNode(ref: RefObject<ScrollView | null> | null): Element | null {
  const sv = ref?.current as unknown as { getScrollableNode?: () => Element } | null;
  return sv?.getScrollableNode?.() ?? null;
}

type RevealOptions = {
  from: RevealFrom;
  mode: "load" | "scroll";
  delay?: number;
  duration?: number;
};

// Props that make any View a reveal item: a ref and the data attribute the CSS keys
// on. On native it returns nothing, so the View renders in its final state.
export function useRevealProps({ from, mode, delay, duration }: RevealOptions) {
  const ref = useRef<View>(null);
  const scrollRoot = useContext(ScrollRootContext);
  const group = useContext(RevealGroupContext);
  useEffect(() => {
    if (!IS_WEB || !ref.current) return;
    return registerReveal({
      el: ref.current as unknown as HTMLElement,
      from,
      delay,
      duration,
      mode,
      root: mode === "scroll" ? scrollNode(scrollRoot) : null,
      group: mode === "scroll" && group ? (group.anchor.current as unknown as HTMLElement | null) : null,
    });
    // Registered once per mount; later re-renders never re-trigger it.
  }, []);
  if (!IS_WEB) return {};
  return { ref, dataSet: { revealFrom: from } } as object;
}

type GroupProps = { children: ReactNode; className?: string; stagger?: number; baseDelay?: number };

// Reveals its Reveal children together when the group's top reaches 75% down the
// screen, each one `stagger` ms after the previous (by its index), after `baseDelay`.
export function RevealGroup({ children, className, stagger = 70, baseDelay = 0 }: GroupProps) {
  const ref = useRef<View>(null);
  const outer = useContext(RevealGroupContext);
  return (
    <RevealGroupContext.Provider value={{ anchor: outer?.anchor ?? ref, stagger, baseDelay }}>
      <View ref={ref} className={className}>
        {children}
      </View>
    </RevealGroupContext.Provider>
  );
}

type RevealProps = {
  children: ReactNode;
  // Position in its section or group; sets the stagger delay.
  index?: number;
  // "mount": the report's one-time reveal (Reanimated; also used on native).
  // "load": web, plays after `delay` once mounted (the hero).
  // "scroll": web, plays when it (or its RevealGroup) reaches 75% down the screen.
  trigger?: "mount" | "load" | "scroll";
  from?: RevealFrom;
  delay?: number;
  duration?: number;
  className?: string;
};

function WebReveal({ children, index = 0, trigger, from = "y16", delay, duration, className }: RevealProps) {
  const group = useContext(RevealGroupContext);
  const stagger = group?.stagger ?? 70;
  const props = useRevealProps({
    from,
    mode: trigger === "load" ? "load" : "scroll",
    delay: delay ?? (group?.baseDelay ?? 0) + index * stagger,
    duration,
  });
  return (
    <View {...props} className={className}>
      {children}
    </View>
  );
}

// One reveal system for the app. The report's sections use the default "mount"
// trigger; the landing page uses "load" and "scroll" on web. On native, load and
// scroll reveals render in their final state (the apps have no landing page).
export function Reveal(props: RevealProps) {
  const { trigger = "mount", index = 0, children, className } = props;
  if (trigger === "mount") return <MountReveal index={index}>{children}</MountReveal>;
  if (!IS_WEB) return <View className={className}>{children}</View>;
  return <WebReveal {...props} />;
}
