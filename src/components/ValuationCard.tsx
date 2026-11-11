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
        <Text className="text-xs text-neutral-500 dark:text-neutral-400">Estimated value</Text>
        <Text className="text-3xl font-bold text-neutral-900 dark:text-white">
          {formatMoney(estimatedValue)}
        </Text>
        {pricePerSqft !== undefined ? (
          <Text className="text-sm text-neutral-500 dark:text-neutral-400">
            {formatPricePerSqft(pricePerSqft)}
          </Text>
        ) : null}
        {showRange ? (
          <Text className="text-sm text-neutral-500 dark:text-neutral-400">
            Range: {formatMoneyRange(valueRangeLow, valueRangeHigh)}
          </Text>
        ) : null}
        {lowConfidence === true ? (
          <Text className="text-sm text-amber-700 dark:text-amber-300">
            Low confidence: few comparable homes.
          </Text>
        ) : null}
      </View>

      {listPrice !== undefined ? (
        <View className="flex-row justify-between">
          <Text className="text-sm text-neutral-500 dark:text-neutral-400">List price</Text>
          <Text className="text-sm font-medium text-neutral-900 dark:text-white">
            {formatMoney(listPrice)}
          </Text>
        </View>
      ) : (
        <Text className="text-sm text-neutral-500 dark:text-neutral-400">
          Not currently listed, so there&apos;s no list price to compare.
        </Text>
      )}

      {showMargin ? (
        <View className="flex-row justify-between">
          <Text className="text-sm text-neutral-500 dark:text-neutral-400">
            Potential margin vs. list price
          </Text>
          <Text
            className={`text-sm font-semibold ${
              positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}
          >
            {formatSignedMoney(margin as number)}
          </Text>
        </View>
      ) : null}
    </Card>
  );
}
