import { View, Text } from "react-native";
import { BAND } from "@/theme/tokens";
import { BandSection } from "./Section";
import { LayersIcon } from "./icons";

// Only pieces confirmed in this repo or its README, plus the cache the backend uses.
const TOOLS = [
  { kind: "Data", name: "Rentcast", text: "Property and listing data. Its key lives only on the backend." },
  { kind: "Backend", name: "Next.js on Vercel", text: "Holds the data key and runs the valuation engine." },
  { kind: "Cache", name: "Upstash", text: "Remembers recent lookups so repeat searches don't use up the monthly data limit." },
  { kind: "App", name: "Expo and React Native", text: "One codebase for web, iOS and Android." },
];

export function BuiltOnSection() {
  return (
    <BandSection band="night">
      <View className="gap-12">
        <View className="gap-5">
          <LayersIcon color={BAND.nightAccent} />
          <Text
            role="heading"
            aria-level={2}
            className="font-serif text-on-night text-[36px] leading-[38px] tracking-[-0.72px] lg:text-[60px] lg:leading-[63px] lg:tracking-[-1.2px]"
          >
            Built on tools you already trust.
          </Text>
        </View>
        <View className="rounded-[18px] border border-on-night/15 md:flex-row md:flex-wrap">
          {TOOLS.map((tool, i) => (
            <View
              key={tool.name}
              className={`gap-2 p-6 md:w-1/2 lg:w-1/4 border-on-night/15 ${
                i > 0 ? "border-t md:border-t-0" : ""
              } ${i % 2 === 1 ? "md:border-l" : ""} ${i >= 2 ? "md:border-t lg:border-t-0 lg:border-l" : ""}`}
            >
              <Text className="font-mono-medium font-medium text-[11px] leading-4 uppercase tracking-widest text-night-accent">
                {tool.kind}
              </Text>
              <Text className="font-serif text-2xl text-on-night">{tool.name}</Text>
              <Text className="font-sans text-sm leading-5 text-night-muted">{tool.text}</Text>
            </View>
          ))}
        </View>
      </View>
    </BandSection>
  );
}
