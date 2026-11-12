import { View, Text } from "react-native";
import { Link } from "expo-router";
import { LogoMark } from "@/components/LogoMark";

const REPO_URL = "https://github.com/gauge-valuations/mobile";

// Small, muted footer: the mark, the disclaimer and a link to this repo.
export function Footer() {
  return (
    <View className="w-full border-t border-rule bg-paper">
      <View className="w-full max-w-[1280px] self-center px-5 pt-16 pb-10 lg:px-10 gap-6 md:flex-row md:items-center md:justify-between">
        <View className="flex-row items-center gap-2">
          <LogoMark size={24} />
          <Text className="font-serif text-xl text-ink">Gauge</Text>
        </View>
        <Text className="font-sans text-sm text-muted">Estimates only — not an appraisal.</Text>
        {/* Opens in a new tab; py-2.5 gives a 40px tap height. */}
        <Link
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start py-2.5 font-sans text-sm text-muted underline"
        >
          GitHub
        </Link>
      </View>
    </View>
  );
}
