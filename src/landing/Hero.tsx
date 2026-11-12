import { View, Text } from "react-native";
import Svg, { Circle, Defs, Line, LinearGradient, Path, RadialGradient, Stop } from "react-native-svg";
import { HIDDEN_FROM_SCREEN_READERS } from "@/components/hiddenFromScreenReaders";
import { RangeBar } from "@/components/RangeBar";
import { MarginPill } from "@/components/MarginPill";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/motion/CountUp";
import { PulseDot } from "@/motion/PulseDot";
import { formatMoney, formatMoneyCompact, formatPricePerSqft } from "@/format";
import { SAMPLE_ADDRESSES } from "@/sampleAddresses";
import { BAND, TOKENS, useTokens } from "@/theme/tokens";
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

// A large, dimensional version of the Gauge mark behind the hero card: a thick arc and
// needle with a vertical gradient, a narrow highlight along the top of the arc, an inner
// shade line and a soft offset shadow. Light: mint to accent green. Dark: the deep greens
// only, so the glass card's muted text stays AA over it. Every path is under 40 units
// long, so the arc-drawing CSS (dasharray 40) draws each one fully.
function ArcShape() {
  const tokens = useTokens();
  const dark = tokens === TOKENS.dark;
  const top = dark ? BAND.forest : tokens.accentTint;
  const bottom = dark ? tokens.accentTint : tokens.accent;
  const highlight = dark ? tokens.accent : tokens.onAccent;
  const shadowOpacity = dark ? 0.55 : 0.14;
  const ARC = "M3.5 17.5a10.5 10.5 0 0 1 21 0";
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 28 20"
      preserveAspectRatio="xMidYMin meet"
      {...HIDDEN_FROM_SCREEN_READERS}
    >
      <Defs>
        <LinearGradient id="gaugeBody" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={top} />
          <Stop offset="1" stopColor={bottom} />
        </LinearGradient>
        <RadialGradient id="gaugeHub" cx="0.4" cy="0.35" r="0.7">
          <Stop offset="0" stopColor={highlight} stopOpacity={0.6} />
          <Stop offset="1" stopColor={bottom} />
        </RadialGradient>
      </Defs>
      {/* Soft shadow under the arc and needle. */}
      <Path d={ARC} transform="translate(0 0.9)" stroke={BAND.night} strokeOpacity={shadowOpacity} strokeWidth={6.6} strokeLinecap="round" fill="none" />
      {/* The arc body. */}
      <Path d={ARC} stroke="url(#gaugeBody)" strokeWidth={6} strokeLinecap="round" fill="none" />
      {/* Highlight along the outer top edge, and a shade along the inner edge. */}
      <Path d="M2.3 17.5a11.7 11.7 0 0 1 23.4 0" stroke={highlight} strokeOpacity={0.5} strokeWidth={0.7} strokeLinecap="round" fill="none" />
      <Path d="M6.1 17.5a7.9 7.9 0 0 1 15.8 0" stroke={BAND.night} strokeOpacity={dark ? 0.35 : 0.12} strokeWidth={0.6} strokeLinecap="round" fill="none" />
      <Line x1={14} y1={18.3} x2={19.5} y2={11.3} stroke={BAND.night} strokeOpacity={shadowOpacity} strokeWidth={3.6} strokeLinecap="round" />
      <Line x1={14} y1={17.5} x2={19.5} y2={10.5} stroke="url(#gaugeBody)" strokeWidth={3.2} strokeLinecap="round" />
      <Circle cx={14} cy={17.5} r={2.6} fill="url(#gaugeHub)" />
    </Svg>
  );
}

// The sample report card in the hero: real numbers from the first sample report.
function HeroCard() {
  const r = PRENTICE;
  // Glass (web): translucent fill, blur, light border and accent shadow ("glass" in
  // +html.tsx). Same padding and gaps as a report card.
  return (
    <View className="glass rounded-[22px] p-5 gap-4">
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
    </View>
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
              <View className="lift rounded-[22px]">
                <HeroCard />
              </View>
            </Reveal>
          </View>
        </View>
      </View>
    </View>
  );
}
