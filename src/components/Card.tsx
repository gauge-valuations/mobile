import { View, Text } from "react-native";
import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  children: ReactNode;
};

// Shared card wrapper used by every section of the results screen.
export function Card({ title, children }: CardProps) {
  return (
    <View className="rounded-2xl bg-card border border-rule p-4 gap-3">
      {title ? (
        <Text className="font-mono-medium font-medium text-xs uppercase tracking-wide text-muted">
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}
