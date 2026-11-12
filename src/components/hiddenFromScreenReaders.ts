import { Platform } from "react-native";

// Spread onto a decorative Svg to hide it from screen readers. Web gets aria-hidden on
// the <svg>; the native-only props would be passed to the DOM as unknown attributes
// there (a React warning), so they are used on iOS and Android only.
export const HIDDEN_FROM_SCREEN_READERS =
  Platform.OS === "web"
    ? { "aria-hidden": true }
    : { accessibilityElementsHidden: true, importantForAccessibility: "no-hide-descendants" as const };
