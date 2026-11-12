import { View, Text } from "react-native";
import type { Valuation } from "@/types";
import { formatMoney, formatMoneyCompact, formatPricePerSqft } from "@/format";
import { Card } from "./Card";
import { RangeBar } from "./RangeBar";
import { MarginPill } from "./MarginPill";
import { LowConfidenceNote } from "./LowConfidenceNote";

// NOTE: This is an ESTIMATED VALUE and a POTENTIAL MARGIN vs. list price only.
// It is deliberately NOT value-minus-debt, since we cannot know what is owed on
// the property from an address. See CLAUDE.md rule #3.
//
// Reading order: label, value, $/sqft, range bar, list price row, margin chip,
// low-confidence callout.
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

  // The bar's values in words, for screen readers.
  const rangeLabel =
    valueRangeLow !== undefined && valueRangeHigh !== undefined
      ? `Value range ${formatMoney(valueRangeLow)} to ${formatMoney(valueRangeHigh)}. ` +
        `Estimate ${formatMoney(estimatedValue)}.` +
        (listPrice !== undefined ? ` List price ${formatMoney(listPrice)}.` : "")
      : "";

  return (
    <Card title="Estimated value">
      <View className="gap-1">
        {/* Line height ~1.1 (53px / 70px) leaves room for the "$" on Android; letter
            spacing is -0.02em written in px. */}
        <Text className="font-serif text-ink text-[48px] leading-[53px] tracking-[-0.96px] md:text-[64px] md:leading-[70px] md:tracking-[-1.28px]">
          {formatMoney(estimatedValue)}
        </Text>
        {pricePerSqft !== undefined ? (
          <Text className="font-mono text-sm text-muted">{formatPricePerSqft(pricePerSqft)}</Text>
        ) : null}
      </View>

      {/* A range needs both ends; one alone is not shown. */}
      {valueRangeLow !== undefined && valueRangeHigh !== undefined ? (
        <RangeBar
          low={valueRangeLow}
          high={valueRangeHigh}
          estimate={estimatedValue}
          listPrice={listPrice}
          format={formatMoneyCompact}
          accessibilityLabel={rangeLabel}
        />
      ) : null}

      {listPrice !== undefined && margin !== undefined ? (
        <View className="gap-3">
          <View className="flex-row justify-between gap-3">
            <Text className="font-sans text-sm text-muted">List price</Text>
            <Text className="font-sans-medium font-medium text-sm text-ink">
              {formatMoney(listPrice)}
            </Text>
          </View>
          <MarginPill margin={margin} />
        </View>
      ) : (
        <Text className="font-sans text-sm text-muted">
          No current list price, so no potential margin.
        </Text>
      )}

      {lowConfidence === true ? <LowConfidenceNote /> : null}
    </Card>
  );
}
