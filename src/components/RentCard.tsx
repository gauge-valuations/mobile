import { useState } from "react";
import { View, Text } from "react-native";
import type { RentEstimate } from "@/types";
import { formatMoney, formatPricePerSqft } from "@/format";
import { Card } from "./Card";
import { CompRow } from "./CompRow";
import { RangeBar } from "./RangeBar";
import { COLLAPSED_ROW_COUNT, ShowAllToggle } from "./ShowAllToggle";

export function RentCard({ rent }: { rent: RentEstimate }) {
  const { rentPerSqft, rentRangeLow, rentRangeHigh } = rent;
  const [expanded, setExpanded] = useState(false);
  const shownComps = expanded ? rent.rentComps : rent.rentComps.slice(0, COLLAPSED_ROW_COUNT);

  return (
    <Card title="Rent estimate">
      <View className="gap-1">
        <View className="flex-row items-baseline gap-1.5">
          {/* Line height ~1.1 (40px); letter spacing -0.02em in px. */}
          <Text className="font-serif text-ink text-[36px] leading-[40px] tracking-[-0.72px]">
            {formatMoney(rent.monthlyRent)}
          </Text>
          <Text className="font-sans text-sm text-muted">/ month</Text>
        </View>
        {rentPerSqft !== undefined ? (
          <Text className="font-mono text-sm text-muted">
            {formatPricePerSqft(rentPerSqft, { monthly: true })}
          </Text>
        ) : null}
      </View>

      {/* A range needs both ends; one alone is not shown. Rent ends stay whole dollars:
          compact money would round $3,150 to $3.2K. */}
      {rentRangeLow !== undefined && rentRangeHigh !== undefined ? (
        <RangeBar
          low={rentRangeLow}
          high={rentRangeHigh}
          estimate={rent.monthlyRent}
          format={formatMoney}
          size="compact"
          accessibilityLabel={
            `Rent range ${formatMoney(rentRangeLow)} to ${formatMoney(rentRangeHigh)} per month. ` +
            `Estimate ${formatMoney(rent.monthlyRent)} per month.`
          }
        />
      ) : null}

      {rent.rentComps.length > 0 ? (
        <View>
          <Text className="font-mono-medium font-medium text-[11px] leading-4 uppercase tracking-widest text-muted pb-1">
            Rent comps
          </Text>
          {shownComps.map((comp, i) => (
            <CompRow key={`${comp.address}-${i}`} comp={comp} monthly first={i === 0} />
          ))}
          <ShowAllToggle
            total={rent.rentComps.length}
            expanded={expanded}
            onToggle={() => setExpanded((e) => !e)}
          />
        </View>
      ) : null}
    </Card>
  );
}
