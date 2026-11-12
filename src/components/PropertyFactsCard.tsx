import { View, Text } from "react-native";
import type { Property } from "@/types";
import { formatMoney, formatSaleDate, formatSqft } from "@/format";
import { Card } from "./Card";

function Fact({ label, value }: { label: string; value: string }) {
  // Values may wrap (Last sale can take two lines at phone width).
  return (
    <View className="w-1/2 gap-1 pb-4 pr-3">
      <Text className="font-mono text-[11px] leading-4 uppercase tracking-wider text-muted">
        {label}
      </Text>
      <Text className="font-sans-medium font-medium text-base text-ink">{value}</Text>
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
      <Text className="font-serif text-ink text-[24px] leading-[30px] tracking-[-0.24px]">
        {property.address}
      </Text>
      <View className="flex-row flex-wrap -mb-4">
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
