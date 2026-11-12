import { View, Text } from "react-native";
import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  children: ReactNode;
};

// Shared card wrapper used by every section of the results screen: 18px radius, 1px
// rule border, no shadow. The title is a small mono label (rendered uppercase).
export function Card({ title, children }: CardProps) {
  return (
    <View className="rounded-[18px] bg-card border border-rule p-5 gap-4">
      {title ? (
        <Text className="font-mono-medium font-medium text-[11px] leading-4 uppercase tracking-widest text-muted">
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}
