import { View, Text } from "react-native";
import { Card } from "@/components/Card";
import { CompRow } from "@/components/CompRow";
import { RangeBar } from "@/components/RangeBar";
import { MarketStrip } from "@/components/MarketSnapshotStrip";
import { formatMoney, formatPricePerSqft } from "@/format";
import { useTokens } from "@/theme/tokens";
import { FeatureSection } from "./Section";
import { KeyIcon } from "./icons";
import { PRENTICE } from "./sampleReports";

// A close copy of the report's rent card, from the first sample report's numbers.
function RentMock() {
  const { rent } = PRENTICE;
  return (
    <Card>
      <Text className="font-mono-medium font-medium text-[11px] leading-4 uppercase tracking-widest text-muted">
        Rent estimate
      </Text>
      <View className="gap-1">
        <View className="flex-row items-baseline gap-1.5">
          <Text className="font-serif text-ink text-[32px] leading-[36px] tracking-[-0.64px]">
            {formatMoney(rent.monthly)}
          </Text>
          <Text className="font-sans text-sm text-muted">/ month</Text>
        </View>
        <Text className="font-mono text-sm text-muted">
          {formatPricePerSqft(rent.perSqftMonthly, { monthly: true })}
        </Text>
      </View>
      <RangeBar
        low={rent.rangeLow}
        high={rent.rangeHigh}
        estimate={rent.monthly}
        format={formatMoney}
        size="compact"
        accessibilityLabel={
          `Rent range ${formatMoney(rent.rangeLow)} to ${formatMoney(rent.rangeHigh)} per month. ` +
          `Estimate ${formatMoney(rent.monthly)} per month.`
        }
      />
      <View>
        <Text className="font-mono-medium font-medium text-[11px] leading-4 uppercase tracking-widest text-muted pb-1">
          Rent comps
        </Text>
        {rent.comps.map((comp, i) => (
          <CompRow key={comp.address} comp={comp} monthly first={i === 0} />
        ))}
      </View>
    </Card>
  );
}

// A simple phone outline holding the rent card and the market strip.
function PhoneMock() {
  return (
    <View className="self-center w-full max-w-[340px] rounded-[44px] border-[10px] border-night bg-paper overflow-hidden">
      <View className="items-center pt-2 pb-1">
        <View className="h-1.5 w-16 rounded-full bg-night" />
      </View>
      <View className="gap-3 px-3 pb-5 pt-2">
        <RentMock />
        <MarketStrip
          medianPrice={PRENTICE.market.medianPrice}
          daysOnMarket={PRENTICE.market.daysOnMarket}
          zip={PRENTICE.market.zip}
        />
      </View>
    </View>
  );
}

export function RentMarketSection() {
  const tokens = useTokens();
  return (
    <FeatureSection
      band="paper-deep"
      icon={<KeyIcon color={tokens.accent} />}
      headline="Rent and the market on the same screen."
      paragraph="A rent estimate with its own comparable rentals, plus the ZIP code's median price and average days on market, so you can judge the home as a place to live or as an investment."
      mock={<PhoneMock />}
      textSide="right"
    />
  );
}
