import { View, Text } from "react-native";
import type { Valuation } from "@/types";
import { formatMoney, formatMoneyRange, formatPricePerSqft, formatSignedMoney } from "@/format";
import { Card } from "./Card";

// NOTE: This is an ESTIMATED VALUE and a POTENTIAL MARGIN vs. list price only.
// It is deliberately NOT value-minus-debt, since we cannot know what is owed on
// the property from an address. See CLAUDE.md rule #3.
export function ValuationCard({ valuation }: { valuation: Valuation }) {
  const {
    estimatedValue,
    listPrice,
    potentialMargin,
    pricePerSqft,
    valueRangeLow,
    valueRangeHigh,
    lowConfidence,
  } = valuation;
  // The backend may omit potentialMargin; derive it from the list price when it's missing.
  const margin =
    listPrice === undefined ? undefined : (potentialMargin ?? estimatedValue - listPrice);
  const showMargin = margin !== undefined;
  const positive = (margin ?? 0) >= 0;
  // A range needs both ends; one alone is not shown.
  const showRange = valueRangeLow !== undefined && valueRangeHigh !== undefined;

  return (
    <Card title="Valuation">
      <View className="gap-1">
        <Text className="font-sans text-xs text-muted">Estimated value</Text>
        <Text className="font-serif text-3xl text-ink">
          {formatMoney(estimatedValue)}
        </Text>
        {pricePerSqft !== undefined ? (
          <Text className="font-mono text-sm text-muted">
            {formatPricePerSqft(pricePerSqft)}
          </Text>
        ) : null}
        {showRange ? (
          <Text className="font-sans text-sm text-muted">
            Range: {formatMoneyRange(valueRangeLow, valueRangeHigh)}
          </Text>
        ) : null}
        {lowConfidence === true ? (
          <Text className="font-sans text-sm text-wait">
            Low confidence: few comparable homes.
          </Text>
        ) : null}
      </View>

      {listPrice !== undefined ? (
        <View className="flex-row justify-between">
          <Text className="font-sans text-sm text-muted">List price</Text>
          <Text className="font-mono-medium font-medium text-sm text-ink">
            {formatMoney(listPrice)}
          </Text>
        </View>
      ) : (
        <Text className="font-sans text-sm text-muted">
          No current list price, so no potential margin.
        </Text>
      )}

      {showMargin ? (
        <View className="flex-row justify-between">
          <Text className="font-sans text-sm text-muted">
            Potential margin vs. list price
          </Text>
          <Text
            className={`font-mono-medium font-medium text-sm ${positive ? "text-gain" : "text-loss"}`}
          >
            {formatSignedMoney(margin as number)}
          </Text>
        </View>
      ) : null}
    </Card>
  );
}
