import { useState } from "react";
import { View, Text } from "react-native";
import type { Comp } from "@/types";
import { Card } from "./Card";
import { CompRow } from "./CompRow";
import { COLLAPSED_ROW_COUNT, ShowAllToggle } from "./ShowAllToggle";

export function CompsList({ comps }: { comps: Comp[] }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? comps : comps.slice(0, COLLAPSED_ROW_COUNT);

  return (
    <Card title="Comparable homes">
      {comps.length === 0 ? (
        <Text className="font-sans text-sm text-muted">
          No comparable homes available.
        </Text>
      ) : (
        <View>
          {shown.map((comp, i) => (
            <CompRow key={`${comp.address}-${i}`} comp={comp} />
          ))}
          <ShowAllToggle
            total={comps.length}
            expanded={expanded}
            onToggle={() => setExpanded((e) => !e)}
          />
        </View>
      )}
    </Card>
  );
}
