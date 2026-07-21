import { View, Text } from "react-native";
import type { Comp } from "@/types";
import { Card } from "./Card";
import { CompRow } from "./CompRow";

export function CompsList({ comps }: { comps: Comp[] }) {
  return (
    <Card title="Comparable homes">
      {comps.length === 0 ? (
        <Text className="text-sm text-neutral-500 dark:text-neutral-400">
          No comparable homes available.
        </Text>
      ) : (
        <View>
          {comps.map((comp, i) => (
            <CompRow key={`${comp.address}-${i}`} comp={comp} />
          ))}
        </View>
      )}
    </Card>
  );
}
