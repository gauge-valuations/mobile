import { View, Text } from "react-native";
import { Card } from "@/components/Card";
import { LowConfidenceNote } from "@/components/LowConfidenceNote";
import { Disclaimer } from "@/components/Disclaimer";
import { useTokens } from "@/theme/tokens";
import { FeatureSection } from "./Section";
import { InfoIcon } from "./icons";

// The report's own low-confidence callout (shown when few comparable homes are usable)
// and its disclaimer (shown on every report), as they appear there.
function LimitsMock() {
  return (
    <View className="gap-4">
      <Card>
        <Text className="font-mono-medium font-medium text-[11px] leading-4 uppercase tracking-widest text-muted">
          When few comps are usable
        </Text>
        <LowConfidenceNote />
      </Card>
      <Card>
        <Text className="font-mono-medium font-medium text-[11px] leading-4 uppercase tracking-widest text-muted">
          On every report
        </Text>
        <Disclaimer />
      </Card>
    </View>
  );
}

export function LimitsSection() {
  const tokens = useTokens();
  return (
    <FeatureSection
      band="paper"
      icon={<InfoIcon color={tokens.accent} />}
      headline="Honest about what it can't know."
      paragraph="Texas doesn't disclose sale prices, so comps use asking prices. When too few similar homes are available, the report says so. And every number is an estimate, not an appraisal."
      mock={<LimitsMock />}
      textSide="right"
    />
  );
}
