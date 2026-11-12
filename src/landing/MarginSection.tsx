import { View, Text } from "react-native";
import { formatMoney, formatSignedMoney } from "@/format";
import { BAND } from "@/theme/tokens";
import { FeatureSection, MockLabel } from "./Section";
import { MarginIcon } from "./icons";
import { SAMPLE_REPORTS, SNAPSHOT_DATE, type SampleReport } from "./sampleReports";

type Row = { label: string; value: (r: SampleReport) => string; tone?: (r: SampleReport) => string };

// The comparison rows. A home with no list price shows that plainly, never a margin.
const ROWS: Row[] = [
  { label: "Estimated value", value: (r) => formatMoney(r.estimatedValue) },
  {
    label: "List price",
    value: (r) => (r.listPrice !== undefined ? formatMoney(r.listPrice) : "No current list price"),
  },
  {
    label: "Potential margin",
    value: (r) =>
      r.potentialMargin !== undefined ? formatSignedMoney(r.potentialMargin) : "No current list price",
    tone: (r) =>
      r.potentialMargin === undefined
        ? "text-night-muted"
        : r.potentialMargin >= 0
          ? "text-night-accent"
          : "text-on-night",
  },
  { label: "Comps shown", value: (r) => String(r.compsShown) },
  { label: "Confidence", value: (r) => (r.lowConfidence ? "Low" : "Standard") },
];

// The two sample homes side by side, on the night band.
function ComparisonMock() {
  return (
    <View className="gap-4">
      <MockLabel band="night">{`Sample reports · ${SNAPSHOT_DATE}`}</MockLabel>
      <View className="rounded-[18px] border border-on-night/15">
        <View className="flex-row border-b border-on-night/15">
          <View className="hidden sm:flex sm:flex-[4]" />
          {SAMPLE_REPORTS.map((r) => (
            <View key={r.address} className="flex-[5] px-4 py-4">
              <Text className="font-sans-medium font-medium text-sm text-on-night">
                {r.address.split(",")[0]}
              </Text>
              <Text className="font-mono text-xs text-night-muted">
                {r.address.split(",").slice(1).join(",").trim()}
              </Text>
            </View>
          ))}
        </View>
        {ROWS.map((row, i) => (
          <View
            key={row.label}
            className={`sm:flex-row ${i > 0 ? "border-t border-on-night/10" : ""}`}
          >
            <View className="px-4 pt-3 sm:py-4 sm:flex-[4]">
              <Text className="font-mono text-[11px] leading-4 uppercase tracking-widest text-night-muted">
                {row.label}
              </Text>
            </View>
            <View className="flex-row sm:flex-[10]">
              {SAMPLE_REPORTS.map((r) => (
                <View key={r.address} className="flex-1 px-4 pb-3 pt-1.5 sm:py-4">
                  <Text
                    className={`font-mono-medium font-medium text-sm ${row.tone ? row.tone(r) : "text-on-night"}`}
                  >
                    {row.value(r)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export function MarginSection() {
  return (
    <FeatureSection
      band="night"
      icon={<MarginIcon color={BAND.nightAccent} />}
      headline="See the potential margin at a glance."
      paragraph="Gauge subtracts the list price from its estimate, so you can see at a glance whether a home is priced above or below what similar homes suggest."
      mock={<ComparisonMock />}
      textSide="left"
    />
  );
}
