// Web-only reveal engine for the landing page and the report's range bar.
//
// How an item reveals:
//  1. The static HTML renders every item visible. The pre-paint script in +html.tsx adds
//     the "motion" class to <html> (unless reduced motion is on); CSS then hides items
//     with a data-reveal-from attribute and gives them a CSS-only fallback that shows
//     them 1.5s after they enter the page, so slow or failed JavaScript never leaves text
//     invisible.
//  2. Once JavaScript runs, it "arms" items still hidden (data-reveal-armed cancels the
//     CSS fallback) and reveals them by setting data-revealed, either after a delay
//     ("load") or when they reach 75% down the scroll container ("scroll").
//  3. A twice-a-second check reveals any armed item that has been on screen for 1.5s
//     without its trigger firing.
// The state lives in DOM attributes that React never sets, so re-renders (theme switch,
// "Show all") never replay a reveal. CSS transitions do the animating (opacity and
// transform only; stroke-dashoffset for the hero arc), in src/app/+html.tsx.

export type RevealFrom =
  | "y32"
  | "y24"
  | "y16"
  | "y12"
  | "y6"
  | "x-10"
  | "scale"
  | "tilt"
  | "growx"
  | "fade"
  | "draw";

// Durations measured on the reference site; see CLAUDE.md "Motion".
export const DEFAULT_DURATION: Record<RevealFrom, number> = {
  y32: 800,
  y24: 700,
  y16: 700,
  y12: 700,
  y6: 700,
  "x-10": 500,
  scale: 900,
  tilt: 700,
  growx: 700,
  fade: 400,
  draw: 1980,
};

const SAFETY_MS = 1500;
const CHECK_EVERY_MS = 500;

type Item = {
  el: HTMLElement;
  from: RevealFrom;
  delay: number;
  duration: number;
  // Element whose position decides "on screen" (the item, or its group).
  anchor: HTMLElement;
  seenSince?: number;
};

const armed = new Map<HTMLElement, Item>();
// Group container -> its members, revealed together (each with its own delay).
const groups = new Map<HTMLElement, Set<HTMLElement>>();
let observer: IntersectionObserver | null = null;
let observerRoot: Element | null = null;
let checkTimer: ReturnType<typeof setInterval> | null = null;

const isBrowser = () => typeof document !== "undefined";

export function motionEnabled(): boolean {
  if (!isBrowser()) return false;
  const reduced = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  return !reduced && document.documentElement.classList.contains("motion");
}

// Already visible? (the CSS fallback fired before JavaScript arrived)
function alreadyShown(item: Item): boolean {
  const style = getComputedStyle(item.el);
  if (item.from === "draw") {
    const path = item.el.querySelector("path");
    return path ? parseFloat(getComputedStyle(path).strokeDashoffset) < 0.5 : true;
  }
  return parseFloat(style.opacity) > 0.99 && (style.transform === "none" || style.transform === "matrix(1, 0, 0, 1, 0, 0)");
}

function show(item: Item) {
  const { el, delay, duration } = item;
  el.style.transitionDelay = `${delay}ms`;
  el.style.transitionDuration = `${duration}ms`;
  // For the hero arc, whose path and needle time their own transitions from it.
  el.style.setProperty("--reveal-delay", `${delay}ms`);
  el.setAttribute("data-revealed", "");
  armed.delete(el);
  observer?.unobserve(item.anchor === el ? el : item.anchor);
}

function revealGroup(groupEl: HTMLElement) {
  const members = groups.get(groupEl);
  if (members) members.forEach((m) => {
    const item = armed.get(m);
    if (item) show(item);
  });
  groups.delete(groupEl);
  observer?.unobserve(groupEl);
}

function ensureObserver(root: Element | null) {
  if (observer && observerRoot === root) return;
  // A new scroll root (e.g. after navigating back to the landing page): re-observe.
  const pending = [...armed.values()];
  observer?.disconnect();
  observerRoot = root;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const target = entry.target as HTMLElement;
        if (groups.has(target)) revealGroup(target);
        else {
          const item = armed.get(target);
          if (item) show(item);
        }
      }
    },
    // Fire when the element's top reaches 75% of the way down the scroll container.
    { root, rootMargin: "0px 0px -25% 0px", threshold: 0 },
  );
  pending.forEach((item) => observer!.observe(item.anchor));
}

function ensureSafetyCheck() {
  if (checkTimer) return;
  checkTimer = setInterval(() => {
    if (armed.size === 0) {
      clearInterval(checkTimer!);
      checkTimer = null;
      return;
    }
    const now = performance.now();
    const view = observerRoot?.getBoundingClientRect() ?? { top: 0, bottom: globalThis.innerHeight };
    armed.forEach((item) => {
      const r = item.anchor.getBoundingClientRect();
      const onScreen = r.bottom > view.top && r.top < view.bottom && r.height > 0;
      if (!onScreen) {
        item.seenSince = undefined;
        return;
      }
      item.seenSince ??= now;
      if (now - item.seenSince >= SAFETY_MS) {
        if (groups.has(item.anchor)) revealGroup(item.anchor);
        else show(item);
      }
    });
  }, CHECK_EVERY_MS);
}

type Register = {
  el: HTMLElement;
  from: RevealFrom;
  delay?: number;
  duration?: number;
  mode: "load" | "scroll";
  root?: Element | null;
  group?: HTMLElement | null;
};

// Registers an item. Returns a cleanup for unmount.
export function registerReveal({ el, from, delay = 0, duration, mode, root = null, group = null }: Register): () => void {
  if (el.hasAttribute("data-revealed")) return () => {};
  const item: Item = { el, from, delay, duration: duration ?? DEFAULT_DURATION[from], anchor: group ?? el };
  if (!motionEnabled() || alreadyShown(item)) {
    el.setAttribute("data-revealed", "");
    return () => {};
  }
  el.setAttribute("data-reveal-armed", "");
  armed.set(el, item);
  ensureSafetyCheck();
  if (mode === "load") {
    // Two frames so the hidden state is painted before the transition starts.
    requestAnimationFrame(() => requestAnimationFrame(() => armed.has(el) && show(item)));
  } else {
    ensureObserver(root);
    if (group) {
      if (!groups.has(group)) {
        groups.set(group, new Set());
        observer!.observe(group);
      }
      groups.get(group)!.add(el);
    } else {
      observer!.observe(el);
    }
  }
  return () => {
    armed.delete(el);
    if (group) groups.get(group)?.delete(el);
    else observer?.unobserve(el);
  };
}
