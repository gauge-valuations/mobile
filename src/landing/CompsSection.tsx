import { View, Text } from "react-native";
import { Card } from "@/components/Card";
import { CompRow, type CompRowData } from "@/components/CompRow";
import { HOW_IT_WORKS_ID } from "@/components/Header";
import { useTokens } from "@/theme/tokens";
import { FeatureSection, MockLabel } from "./Section";
import { HomesIcon } from "./icons";

type Mark = "closest" | "dropped" | null;

// An illustration, not a real report: made-up streets and prices. The report itself
// does not show which comps were closest or dropped.
const ROWS: { comp: CompRowData; mark: Mark }[] = [
  { comp: { address: "118 Elm Hollow Ln", beds: 4, baths: 3, distanceMiles: 0.3, status: "sold", price: 612000, pricePerSqft: 254 }, mark: "closest" },
  { comp: { address: "42 Cedar Bluff Rd", beds: 4, baths: 2.5, distanceMiles: 0.5, status: "for_sale", price: 598000, pricePerSqft: 249 }, mark: "closest" },
  { comp: { address: "907 Larkspur Ct", beds: 3, baths: 2, distanceMiles: 0.8, status: "sold", price: 545000, pricePerSqft: 261 }, mark: null },
  { comp: { address: "15 Quarry Rim Dr", beds: 5, baths: 4, distanceMiles: 1.1, status: "for_sale", price: 1150000, pricePerSqft: 412 }, mark: "dropped" },
  { comp: { address: "260 Fern Gully Way", beds: 4, baths: 3, distanceMiles: 1.2, status: "off_market", price: 629000, pricePerSqft: 258 }, mark: null },
];

function MarkLabel({ mark }: { mark: Exclude<Mark, null> }) {
  return (
    <Text
      className={`font-mono-medium font-medium text-[10px] leading-4 uppercase tracking-widest ${
        mark === "closest" ? "text-accent" : "text-loss"
      }`}
    >
      {mark === "closest" ? "Closest match" : "Dropped · outlier"}
    </Text>
  );
}

function CompsMock() {
  return (
    <Card>
      <View className="flex-row items-center justify-between">
        <Text className="font-mono-medium font-medium text-[11px] leading-4 uppercase tracking-widest text-muted">
          Comparable homes
        </Text>
        <MockLabel>Illustration</MockLabel>
      </View>
      <View>
        {ROWS.map(({ comp, mark }, i) => (
          <View
            key={comp.address}
            className={`rounded-xl px-3 -mx-3 ${mark === "closest" ? "bg-accent-tint" : ""} ${
              mark && i > 0 ? "mt-1" : ""
            }`}
          >
            {mark ? (
              <View className="pt-2">
                <MarkLabel mark={mark} />
              </View>
            ) : null}
            {/* A dropped comp is dimmed; its label above stays at full contrast. */}
            <View className={mark === "dropped" ? "opacity-50" : ""}>
              <CompRow comp={comp} first={i === 0 || mark !== null || ROWS[i - 1].mark !== null} />
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}

export function CompsSection() {
  const tokens = useTokens();
  return (
    <FeatureSection
      band="paper"
      id={HOW_IT_WORKS_ID}
      icon={<HomesIcon color={tokens.accent} />}
      headline="Every estimate starts from the homes around it."
      paragraph="Gauge pulls nearby homes, compares their price per square foot, drops the outliers and weights the rest by how closely the data provider scores each one against the home you entered."
      mock={<CompsMock />}
      textSide="right"
    />
  );
}
