import { View } from "react-native";

// An 8px accent status dot with a ring that grows to 7px beyond it and fades, looping
// every 1.6s. The ring scales and fades (transform and opacity only); the "pulse-ring"
// animation is in +html.tsx and only runs when motion is on.
export function PulseDot() {
  return (
    <View className="h-2 w-2" aria-hidden>
      <View className="pulse-ring absolute inset-0 rounded-full bg-accent opacity-0" />
      <View className="h-2 w-2 rounded-full bg-accent" />
    </View>
  );
}
