import { View, Text } from "react-native";
import type { Valuation } from "@/types";
import { formatMoney, formatSignedMoney } from "@/format";
import { Card } from "./Card";

// NOTE: This is an ESTIMATED VALUE and a POTENTIAL MARGIN vs. list price only.
// It is deliberately NOT value-minus-debt, since we cannot know what is owed on
// the property from an address. See CLAUDE.md rule #2.
export function ValuationCard({ valuation }: { valuation: Valuation }) {
  const { estimatedValue, listPrice, potentialMargin } = valuation;
  const showMargin = listPrice !== undefined && potentialMargin !== undefined;
  const positive = (potentialMargin ?? 0) >= 0;

  return (
    <Card title="Valuation">
      <View>
        <Text className="text-xs text-neutral-500 dark:text-neutral-400">Estimated value</Text>
        <Text className="text-3xl font-bold text-neutral-900 dark:text-white">
          {formatMoney(estimatedValue)}
        </Text>
      </View>

      {listPrice !== undefined ? (
        <View className="flex-row justify-between">
          <Text className="text-sm text-neutral-500 dark:text-neutral-400">List price</Text>
          <Text className="text-sm font-medium text-neutral-900 dark:text-white">
            {formatMoney(listPrice)}
          </Text>
        </View>
      ) : null}

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
            {formatSignedMoney(potentialMargin as number)}
          </Text>
        </View>
      ) : null}
    </Card>
  );
}
