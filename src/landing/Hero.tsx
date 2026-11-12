import { View, Text } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";
import { HIDDEN_FROM_SCREEN_READERS } from "@/components/hiddenFromScreenReaders";
import { Card } from "@/components/Card";
import { RangeBar } from "@/components/RangeBar";
import { MarginPill } from "@/components/MarginPill";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/motion/CountUp";
import { PulseDot } from "@/motion/PulseDot";
import { formatMoney, formatMoneyCompact, formatPricePerSqft } from "@/format";
import { SAMPLE_ADDRESSES } from "@/sampleAddresses";
import { useTokens } from "@/theme/tokens";
import { PrimaryLinkButton, OutlineLinkButton } from "./buttons";
import { CheckIcon, GaugeIcon } from "./icons";
import { PRENTICE, SNAPSHOT_DATE } from "./sampleReports";

// Hero load sequence (ms after mount), matching the reference site's timings: the
// headline lines rise 24px one after another, then the paragraph, buttons and check line
// rise 16px, then the report card rises 32px. All start before the 1.5s fallback.
const T = {
  icon: 0,
  lines: [70, 115, 190, 250],
  paragraph: 320,
  buttons: 390,
  check: 440,
  shape: 150,
  arc: 300,
  card: 600,
  chip: 1000,
  count: 900,
  bar: 1000,
  pill: 1500,
};

// The headline as four lines so each can rise on its own. Four short lines fit at every
// width (40px on phones, 84px from lg).
const HEADLINE = ["Know what a", "home is worth", "before you", "make an offer."];
const HEADLINE_TEXT =
  "font-serif text-ink text-[40px] leading-[42px] tracking-[-0.8px] md:text-[60px] md:leading-[63px] md:tracking-[-1.2px] lg:text-[84px] lg:leading-[86px] lg:tracking-[-1.68px]";

// A large, soft version of the Gauge mark's arc and needle, behind the hero card.
function ArcShape() {
  const tokens = useTokens();
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 28 20"
      preserveAspectRatio="xMidYMin meet"
      {...HIDDEN_FROM_SCREEN_READERS}
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
        <Reveal trigger="load" from="x-10" delay={T.chip} className="flex-row items-center gap-1.5">
          <PulseDot />
          <Text className="font-mono text-[11px] leading-4 text-muted">
            Sample estimate · {SNAPSHOT_DATE}
          </Text>
        </Reveal>
        <Text className="font-sans-medium font-medium text-sm text-ink" numberOfLines={1}>
          {r.address}
        </Text>
      </View>
      <View className="gap-1">
        <Text className="font-mono-medium font-medium text-[11px] leading-4 uppercase tracking-widest text-muted">
          Estimated value
        </Text>
        <CountUp
          value={r.estimatedValue}
          format={formatMoney}
          delayMs={T.count}
          className="font-serif text-ink text-[44px] leading-[48px] tracking-[-0.88px]"
        />
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
        animateDelayMs={T.bar}
      />
      {r.listPrice !== undefined && r.potentialMargin !== undefined ? (
        <View className="gap-3">
          <View className="flex-row justify-between gap-3">
            <Text className="font-sans text-sm text-muted">List price</Text>
            <Text className="font-sans-medium font-medium text-sm text-ink">
              {formatMoney(r.listPrice)}
            </Text>
          </View>
          <Reveal trigger="load" from="x-10" delay={T.pill}>
            <MarginPill margin={r.potentialMargin} />
          </Reveal>
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
            <Reveal trigger="load" from="y6" delay={T.icon} duration={500}>
              <GaugeIcon color={tokens.accent} />
            </Reveal>
            <View role="heading" aria-level={1}>
              {HEADLINE.map((line, i) => (
                <Reveal key={line} trigger="load" from="y24" delay={T.lines[i]}>
                  <Text className={HEADLINE_TEXT}>{line}</Text>
                </Reveal>
              ))}
            </View>
            <Reveal trigger="load" from="y16" delay={T.paragraph} duration={590}>
              <Text className="font-sans text-lg leading-[29px] lg:text-xl lg:leading-[32px] text-muted max-w-[576px]">
                Enter an address and Gauge estimates its value from nearby comparable homes,
                shows how that compares with the list price, and adds rent and market context.
                One screen, no account.
              </Text>
            </Reveal>
            <Reveal trigger="load" from="y16" delay={T.buttons} duration={590} className="flex-row flex-wrap gap-3 pt-2">
              <PrimaryLinkButton href="/report" label="Try an address" />
              <OutlineLinkButton
                href={{ pathname: "/report", params: { address: SAMPLE_ADDRESSES[0] } }}
                label="See a sample report"
              />
            </Reveal>
            <Reveal trigger="load" from="y16" delay={T.check} duration={590} className="flex-row items-center gap-2">
              <CheckIcon color={tokens.accent} />
              <Text className="font-sans text-sm text-muted">Estimates only — not an appraisal.</Text>
            </Reveal>
          </View>
          <View className="lg:flex-[5] items-center justify-center">
            {/* The arc sits behind the card, larger than it, like a backdrop shape. It
                scales in, its arc draws itself, then it drifts slowly. */}
            <Reveal
              trigger="load"
              from="scale"
              delay={T.shape}
              className="absolute inset-x-0 -top-6 bottom-16 lg:-inset-x-8 lg:-top-16 lg:bottom-10"
            >
              <View className="drift flex-1">
                <Reveal trigger="load" from="draw" delay={T.arc} className="flex-1">
                  <ArcShape />
                </Reveal>
              </View>
            </Reveal>
            <Reveal trigger="load" from="y32" delay={T.card} className="w-full max-w-[420px] pt-20 lg:pt-28">
              <View className="lift rounded-[18px]">
                <HeroCard />
              </View>
            </Reveal>
          </View>
        </View>
      </View>
    </View>
  );
}
