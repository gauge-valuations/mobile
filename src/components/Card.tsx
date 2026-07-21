import { View, Text } from "react-native";
import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  children: ReactNode;
};

// Shared card wrapper used by every section of the results screen.
export function Card({ title, children }: CardProps) {
  return (
    <View className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 gap-3">
      {title ? (
        <Text className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}
