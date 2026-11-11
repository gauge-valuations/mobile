import { View, Text } from "react-native";
import type { Property } from "@/types";
import { formatMoney, formatSaleDate, formatSqft } from "@/format";
import { Card } from "./Card";

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View className="w-1/2 pb-3">
      <Text className="text-xs text-neutral-500 dark:text-neutral-400">{label}</Text>
      <Text className="text-base font-medium text-neutral-900 dark:text-white">{value}</Text>
    </View>
  );
}

export function PropertyFactsCard({ property }: { property: Property }) {
  const saleDate = property.lastSaleDate ? formatSaleDate(property.lastSaleDate) : null;
  const lastSale =
    property.lastSalePrice !== undefined
      ? `${formatMoney(property.lastSalePrice)}${saleDate ? ` (${saleDate})` : ""}`
      : (saleDate ?? "—"); // no price: show the date alone when there is one

  return (
    <Card title="Property facts">
      <Text className="text-base font-medium text-neutral-900 dark:text-white">
        {property.address}
      </Text>
      <View className="flex-row flex-wrap">
        <Fact label="Beds" value={String(property.beds)} />
        <Fact label="Baths" value={String(property.baths)} />
        <Fact label="Sqft" value={formatSqft(property.sqft)} />
        <Fact
          label="Year built"
          value={property.yearBuilt !== undefined ? String(property.yearBuilt) : "—"}
        />
        <Fact
          label="Lot size"
          value={
            property.lotSizeSqft !== undefined ? `${formatSqft(property.lotSizeSqft)} sqft` : "—"
          }
        />
        <Fact label="Last sale" value={lastSale} />
      </View>
    </Card>
  );
}
