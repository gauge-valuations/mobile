import type { ReactNode } from "react";
import { View, Text, Platform, type TextStyle } from "react-native";

// Band backgrounds. night and forest are fixed in both themes (src/global.css); night
// gets a top and bottom edge that only shows on dark paper. "grain" is a web-only noise
// overlay defined in src/app/+html.tsx.
export type Band = "paper" | "paper-deep" | "night" | "forest";

const BAND_BG: Record<Band, string> = {
  paper: "bg-paper",
  "paper-deep": "bg-paper-deep",
  night: "bg-night border-y border-night-edge",
  forest: "bg-forest grain",
};

export const HEADLINE_TEXT: Record<Band, string> = {
  paper: "text-ink",
  "paper-deep": "text-ink",
  night: "text-on-night",
  forest: "text-on-forest",
};

export const BODY_TEXT: Record<Band, string> = {
  paper: "text-muted",
  "paper-deep": "text-muted",
  night: "text-night-muted",
  // White at 85%: 4.89:1 on forest (AA).
  forest: "text-on-forest/85",
};

// Web only: balance headline line lengths.
const BALANCE: TextStyle | undefined =
  Platform.OS === "web" ? ({ textWrap: "balance" } as TextStyle) : undefined;

type BandProps = { band: Band; id?: string; children: ReactNode };

// A full-width band with the centered content column: 1280px max, 40px side padding
// (20px on phones), 128px vertical padding (80px on phones).
export function BandSection({ band, id, children }: BandProps) {
  return (
    <View id={id} className={`w-full ${BAND_BG[band]}`}>
      <View className="w-full max-w-[1280px] self-center px-5 py-20 lg:px-10 lg:py-32">
        {children}
      </View>
    </View>
  );
}

type FeatureProps = {
  band: Band;
  id?: string;
  icon: ReactNode;
  headline: string;
  paragraph: string;
  mock: ReactNode;
  // Which side the text sits on from lg up; the mock takes the other side.
  textSide: "left" | "right";
};

// A feature section: icon, serif headline and paragraph in 5 of 12 columns, the mock
// in 7, side by side from lg and alternating sides; stacked (text first) below lg.
export function FeatureSection({ band, id, icon, headline, paragraph, mock, textSide }: FeatureProps) {
  return (
    <BandSection band={band} id={id}>
      <View
        className={`gap-12 lg:gap-8 lg:items-center ${
          textSide === "left" ? "lg:flex-row" : "lg:flex-row-reverse"
        }`}
      >
        <View className="gap-5 lg:flex-[5]">
          {icon}
          <Text
            role="heading"
            aria-level={2}
            className={`font-serif text-[36px] leading-[38px] tracking-[-0.72px] lg:text-[60px] lg:leading-[63px] lg:tracking-[-1.2px] ${HEADLINE_TEXT[band]}`}
            style={BALANCE}
          >
            {headline}
          </Text>
          <Text className={`font-sans text-lg leading-[29px] max-w-[560px] ${BODY_TEXT[band]}`}>
            {paragraph}
          </Text>
        </View>
        <View className="lg:flex-[7]">{mock}</View>
      </View>
    </BandSection>
  );
}

// Small mono uppercase label above a mock (e.g. "Sample reports", "Illustration").
export function MockLabel({ children, band = "paper" }: { children: string; band?: Band }) {
  return (
    <Text
      className={`font-mono-medium font-medium text-[11px] leading-4 uppercase tracking-widest ${BODY_TEXT[band]}`}
    >
      {children}
    </Text>
  );
}
