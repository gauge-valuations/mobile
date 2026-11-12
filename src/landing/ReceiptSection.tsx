import { View, Text } from "react-native";
import { BAND } from "@/theme/tokens";
import { FeatureSection } from "./Section";
import { ReceiptIcon } from "./icons";

// The valuation method, step by step, as the README describes it ("How the valuation
// works"). Nothing here is from a specific report: it is the method, not a record.
const STEPS = [
  "Take each comparable home's price per square foot.",
  "Drop the outliers.",
  "Weight the rest by how similar the data provider scores each one to the home.",
  "Multiply the weighted median by the home's square footage.",
  "Fewer than three usable comps left: use the provider's own estimate and mark it low confidence.",
];

// A printed-receipt style card: mono type, dashed rules, a torn bottom edge.
function ReceiptMock() {
  return (
    <View className="self-center w-full max-w-[420px]">
      <View className="bg-card rounded-t-md px-6 pt-7 pb-6 gap-5">
        <View className="items-center gap-1">
          <Text className="font-mono-medium font-medium text-[11px] leading-4 uppercase tracking-widest text-muted">
            Method
          </Text>
          <Text className="font-serif text-2xl text-ink text-center">How the estimate is built</Text>
        </View>
        <View className="border-t border-dashed border-rule" />
        <View className="gap-4">
          {STEPS.map((step, i) => (
            <View key={step} className="flex-row gap-3">
              <Text className="font-mono-medium font-medium text-sm text-accent w-6">
                {String(i + 1).padStart(2, "0")}
              </Text>
              <Text className="flex-1 font-mono text-[13px] leading-5 text-ink">{step}</Text>
            </View>
          ))}
        </View>
        <View className="border-t border-dashed border-rule" />
        <Text className="font-mono text-xs leading-5 text-muted text-center">
          Estimates only — not an appraisal.
        </Text>
      </View>
      {/* Torn edge: a row of small card-colored triangles. */}
      <View className="flex-row overflow-hidden">
        {Array.from({ length: 16 }, (_, i) => (
          <View
            key={i}
            className="flex-1 h-2.5 border-t-[10px] border-t-card border-x-[8px] border-x-transparent"
          />
        ))}
      </View>
    </View>
  );
}

export function ReceiptSection() {
  return (
    <FeatureSection
      band="forest"
      icon={<ReceiptIcon color={BAND.onForest} />}
      headline="See how the number is built."
      paragraph="Gauge follows the same method every time: price per square foot for each comparable home, outliers dropped, the rest weighted by how similar the data provider scores them, then the weighted median applied to the home's square footage."
      mock={<ReceiptMock />}
      textSide="left"
    />
  );
}
