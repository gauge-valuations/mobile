import { View, Text } from "react-native";
import { LogoMark } from "./LogoMark";
import { ThemeToggle } from "./ThemeToggle";

// Fixed bar above the scrolling content: logo mark and serif wordmark on the left,
// theme toggle on the right. Same centered column as the content (720px, 16px gutter).
export function Header() {
  return (
    <View className="border-b border-rule bg-paper">
      <View className="w-full max-w-[720px] self-center h-14 flex-row items-center justify-between px-4">
        <View className="flex-row items-center gap-2">
          <LogoMark />
          <Text accessibilityRole="header" className="font-serif text-2xl text-ink">
            Gauge
          </Text>
        </View>
        <ThemeToggle />
      </View>
    </View>
  );
}
