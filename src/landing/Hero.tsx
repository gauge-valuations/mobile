import { View, Text, Platform, type TextStyle } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";
import { Card } from "@/components/Card";
import { RangeBar } from "@/components/RangeBar";
import { MarginPill } from "@/components/MarginPill";
import { formatMoney, formatMoneyCompact, formatPricePerSqft } from "@/format";
import { SAMPLE_ADDRESSES } from "@/sampleAddresses";
import { useTokens } from "@/theme/tokens";
import { PrimaryLinkButton, OutlineLinkButton } from "./buttons";
import { CheckIcon, GaugeIcon } from "./icons";
import { PRENTICE, SNAPSHOT_DATE } from "./sampleReports";

const BALANCE: TextStyle | undefined =
  Platform.OS === "web" ? ({ textWrap: "balance" } as TextStyle) : undefined;

// A large, soft version of the Gauge mark's arc and needle, behind the hero card.
function ArcShape() {
  const tokens = useTokens();
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 28 20"
      preserveAspectRatio="xMidYMin meet"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Path
        d="M3.5 17.5a10.5 10.5 0 0 1 21 0"
        stroke={tokens.accentTint}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />
      <Line
        x1={14}
        y1={17.5}
        x2={19.5}
        y2={10.5}
        stroke={tokens.accentTint}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Circle cx={14} cy={17.5} r={2.4} fill={tokens.accentTint} />
    </Svg>
  );
}

// The sample report card in the hero: real numbers from the first sample report.
function HeroCard() {
  const r = PRENTICE;
  return (
    <Card>
      <View className="gap-1.5">
        <View className="flex-row items-center gap-1.5">
          <View className="h-2 w-2 rounded-full bg-accent" />
          <Text className="font-mono text-[11px] leading-4 text-muted">
            Sample estimate · {SNAPSHOT_DATE}
          </Text>
        </View>
        <Text className="font-sans-medium font-medium text-sm text-ink" numberOfLines={1}>
          {r.address}
        </Text>
      </View>
      <View className="gap-1">
        <Text className="font-mono-medium font-medium text-[11px] leading-4 uppercase tracking-widest text-muted">
          Estimated value
        </Text>
        <Text className="font-serif text-ink text-[44px] leading-[48px] tracking-[-0.88px]">
          {formatMoney(r.estimatedValue)}
        </Text>
        <Text className="font-mono text-sm text-muted">{formatPricePerSqft(r.pricePerSqft)}</Text>
      </View>
      <RangeBar
        low={r.valueRangeLow}
        high={r.valueRangeHigh}
        estimate={r.estimatedValue}
        listPrice={r.listPrice}
        format={formatMoneyCompact}
        accessibilityLabel={
          `Value range ${formatMoney(r.valueRangeLow)} to ${formatMoney(r.valueRangeHigh)}. ` +
          `Estimate ${formatMoney(r.estimatedValue)}.` +
          (r.listPrice !== undefined ? ` List price ${formatMoney(r.listPrice)}.` : "")
        }
      />
      {r.listPrice !== undefined && r.potentialMargin !== undefined ? (
        <View className="gap-3">
          <View className="flex-row justify-between gap-3">
            <Text className="font-sans text-sm text-muted">List price</Text>
            <Text className="font-sans-medium font-medium text-sm text-ink">
              {formatMoney(r.listPrice)}
            </Text>
          </View>
          <MarginPill margin={r.potentialMargin} />
        </View>
      ) : null}
    </Card>
  );
}

export function Hero() {
  const tokens = useTokens();
  return (
    <View className="w-full bg-paper">
      <View className="w-full max-w-[1280px] self-center px-5 pt-16 pb-20 lg:px-10 lg:py-28">
        <View className="gap-14 lg:flex-row lg:items-center lg:gap-8">
          <View className="gap-6 lg:flex-[7]">
            <GaugeIcon color={tokens.accent} />
            <Text
              role="heading"
              aria-level={1}
              className="font-serif text-ink text-[40px] leading-[42px] tracking-[-0.8px] md:text-[60px] md:leading-[63px] md:tracking-[-1.2px] lg:text-[84px] lg:leading-[86px] lg:tracking-[-1.68px]"
              style={BALANCE}
            >
              Know what a home is worth before you make an offer.
            </Text>
            <Text className="font-sans text-lg leading-[29px] lg:text-xl lg:leading-[32px] text-muted max-w-[576px]">
              Enter an address and Gauge estimates its value from nearby comparable homes,
              shows how that compares with the list price, and adds rent and market context.
              One screen, no account.
            </Text>
            <View className="flex-row flex-wrap gap-3 pt-2">
              <PrimaryLinkButton href="/report" label="Try an address" />
              <OutlineLinkButton
                href={{ pathname: "/report", params: { address: SAMPLE_ADDRESSES[0] } }}
                label="See a sample report"
              />
            </View>
            <View className="flex-row items-center gap-2">
              <CheckIcon color={tokens.accent} />
              <Text className="font-sans text-sm text-muted">Estimates only — not an appraisal.</Text>
            </View>
          </View>
          <View className="lg:flex-[5] items-center justify-center">
            {/* The arc sits behind the card, larger than it, like a backdrop shape. */}
            <View className="absolute inset-x-0 -top-6 bottom-16 lg:-inset-x-8 lg:-top-16 lg:bottom-10">
              <ArcShape />
            </View>
            <View className="w-full max-w-[420px] pt-20 lg:pt-28">
              <HeroCard />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
