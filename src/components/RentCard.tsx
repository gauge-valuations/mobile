import { View, Text } from "react-native";
import type { RentEstimate } from "@/types";
import { formatMoney } from "@/format";
import { Card } from "./Card";
import { CompRow } from "./CompRow";

export function RentCard({ rent }: { rent: RentEstimate }) {
  return (
    <Card title="Rent estimate">
      <View className="flex-row items-baseline gap-1">
        <Text className="text-3xl font-bold text-neutral-900 dark:text-white">
          {formatMoney(rent.monthlyRent)}
        </Text>
        <Text className="text-sm text-neutral-500 dark:text-neutral-400">/ month</Text>
      </View>

      {rent.rentComps.length > 0 ? (
        <View>
          <Text className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 pt-1">
            Rent comps
          </Text>
          {rent.rentComps.map((comp, i) => (
            <CompRow key={`${comp.address}-${i}`} comp={comp} />
          ))}
        </View>
      ) : null}
    </Card>
  );
}
