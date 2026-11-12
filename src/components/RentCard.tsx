import { useState } from "react";
import { View, Text } from "react-native";
import type { RentEstimate } from "@/types";
import { formatMoney, formatMoneyRange, formatPricePerSqft } from "@/format";
import { Card } from "./Card";
import { CompRow } from "./CompRow";
import { COLLAPSED_ROW_COUNT, ShowAllToggle } from "./ShowAllToggle";

export function RentCard({ rent }: { rent: RentEstimate }) {
  const { rentPerSqft, rentRangeLow, rentRangeHigh } = rent;
  // A range needs both ends; one alone is not shown.
  const showRange = rentRangeLow !== undefined && rentRangeHigh !== undefined;
  const [expanded, setExpanded] = useState(false);
  const shownComps = expanded ? rent.rentComps : rent.rentComps.slice(0, COLLAPSED_ROW_COUNT);

  return (
    <Card title="Rent estimate">
      <View className="gap-1">
        <View className="flex-row items-baseline gap-1">
          <Text className="font-serif text-3xl text-ink">
            {formatMoney(rent.monthlyRent)}
          </Text>
          <Text className="font-sans text-sm text-muted">/ month</Text>
        </View>
        {rentPerSqft !== undefined ? (
          <Text className="font-mono text-sm text-muted">
            {formatPricePerSqft(rentPerSqft, { monthly: true })}
          </Text>
        ) : null}
        {showRange ? (
          <Text className="font-sans text-sm text-muted">
            Range: {formatMoneyRange(rentRangeLow, rentRangeHigh)} / month
          </Text>
        ) : null}
      </View>

      {rent.rentComps.length > 0 ? (
        <View>
          <Text className="font-mono-medium font-medium text-xs uppercase tracking-wide text-muted pt-1">
            Rent comps
          </Text>
          {shownComps.map((comp, i) => (
            <CompRow key={`${comp.address}-${i}`} comp={comp} monthly />
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
