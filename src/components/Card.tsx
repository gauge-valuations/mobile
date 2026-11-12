import { View, Text } from "react-native";
import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  children: ReactNode;
  // Extra classes (e.g. "panel" for landing mocks: a stronger border and a soft shadow).
  className?: string;
};

// Shared card wrapper used by every section of the results screen: 18px radius, 1px
// rule border, no shadow. The title is a small mono label (rendered uppercase).
export function Card({ title, children, className }: CardProps) {
  return (
    <View className={`rounded-[18px] bg-card border border-rule p-5 gap-4 ${className ?? ""}`}>
      {title ? (
        <Text
          role="heading"
          aria-level={2}
          className="font-mono-medium font-medium text-[11px] leading-4 uppercase tracking-widest text-muted"
        >
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}
