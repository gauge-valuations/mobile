import { View, Text } from "react-native";
import { Card } from "@/components/Card";
import { LowConfidenceNote } from "@/components/LowConfidenceNote";
import { Disclaimer } from "@/components/Disclaimer";
import { useTokens } from "@/theme/tokens";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { FeatureSection, MOCK_ROWS_DELAY } from "./Section";
import { InfoIcon } from "./icons";

// The report's own low-confidence callout (shown when few comparable homes are usable)
// and its disclaimer (shown on every report), as they appear there.
function LimitsMock() {
  return (
    <RevealGroup baseDelay={MOCK_ROWS_DELAY} className="gap-4">
      <Reveal trigger="scroll" from="y12" index={0} className="lift rounded-[18px]">
      <Card>
        <Text className="font-mono-medium font-medium text-[11px] leading-4 uppercase tracking-widest text-muted">
          When few comps are usable
        </Text>
        <LowConfidenceNote />
      </Card>
      </Reveal>
      <Reveal trigger="scroll" from="y12" index={1} className="lift rounded-[18px]">
      <Card>
        <Text className="font-mono-medium font-medium text-[11px] leading-4 uppercase tracking-widest text-muted">
          On every report
        </Text>
        <Disclaimer />
      </Card>
      </Reveal>
    </RevealGroup>
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
