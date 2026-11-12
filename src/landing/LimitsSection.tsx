import { View, Text } from "react-native";
import { Card } from "@/components/Card";
import { LowConfidenceNote } from "@/components/LowConfidenceNote";
import { Disclaimer } from "@/components/Disclaimer";
import { useTokens } from "@/theme/tokens";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { FeatureSection, MOCK_ROWS_DELAY } from "./Section";
import { InfoIcon } from "./icons";

// The report's own low-confidence callout and disclaimer, drawn as the report draws
// them, each in a report-style card with a line saying when it appears. No estimate
// number: neither sample report is low confidence, so any number here would be invented.
function LimitsMock() {
  return (
    <RevealGroup baseDelay={MOCK_ROWS_DELAY} className="gap-4">
      <Reveal trigger="scroll" from="y12" index={0} className="lift rounded-[18px]">
        <Card className="panel">
          <Text className="font-mono-medium font-medium text-[11px] leading-4 uppercase tracking-widest text-muted">
            Estimated value
          </Text>
          <Text className="font-sans text-sm text-muted">
            Shown under the estimate when fewer than three usable comparable homes remain and
            the report falls back to the data provider's own estimate:
          </Text>
          <LowConfidenceNote />
        </Card>
      </Reveal>
      <Reveal trigger="scroll" from="y12" index={1} className="lift rounded-[18px]">
        <Card className="panel">
          <Text className="font-mono-medium font-medium text-[11px] leading-4 uppercase tracking-widest text-muted">
            On every report
          </Text>
          <Text className="font-sans text-sm text-muted">
            At the foot of every report, under the market snapshot:
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
