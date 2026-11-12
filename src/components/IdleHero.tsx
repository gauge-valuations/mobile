import { View, Text, Platform, type TextStyle } from "react-native";

// Web only: balance the headline's line lengths. Native has no equivalent.
const BALANCE: TextStyle | undefined =
  Platform.OS === "web" ? ({ textWrap: "balance" } as TextStyle) : undefined;

// The idle-state intro shown above the search box before any search. Line height and
// letter spacing are in px (about 1.05 and -0.02em) because native has no em units.
export function IdleHero() {
  return (
    <View className="gap-4 pt-8 md:pt-16">
      <Text className="font-mono text-xs uppercase tracking-widest text-muted">
        HOME VALUE, IN ONE SCREEN
      </Text>
      <Text
        role="heading"
        aria-level={1}
        className="font-serif text-ink text-[40px] leading-[42px] tracking-[-0.8px] md:text-[64px] md:leading-[67px] md:tracking-[-1.28px]"
        style={BALANCE}
      >
        What is this home worth, and what could you gain?
      </Text>
      <Text className="font-sans text-lg leading-7 md:text-xl md:leading-8 text-muted">
        Enter an address to see the estimated value, nearby comparable homes, rent and the
        market.
      </Text>
    </View>
  );
}
