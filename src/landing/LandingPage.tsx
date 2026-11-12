import { useEffect } from "react";
import { View } from "react-native";
import { HOW_IT_WORKS_ID } from "@/components/Header";
import { Hero } from "./Hero";
import { CompsSection } from "./CompsSection";
import { MarginSection } from "./MarginSection";
import { RentMarketSection } from "./RentMarketSection";
import { ReceiptSection } from "./ReceiptSection";
import { LimitsSection } from "./LimitsSection";
import { BuiltOnSection } from "./BuiltOnSection";
import { CtaSection } from "./CtaSection";
import { Footer } from "./Footer";

// The web landing page, section by section. No animation yet.
export function LandingPage() {
  // Arriving at /#how-it-works from another page: jump to that section once mounted.
  useEffect(() => {
    if (globalThis.location?.hash === `#${HOW_IT_WORKS_ID}`) {
      globalThis.document?.getElementById(HOW_IT_WORKS_ID)?.scrollIntoView({ block: "start" });
    }
  }, []);

  return (
    <View>
      <Hero />
      <CompsSection />
      <MarginSection />
      <RentMarketSection />
      <ReceiptSection />
      <LimitsSection />
      <BuiltOnSection />
      <CtaSection />
      <Footer />
    </View>
  );
}
