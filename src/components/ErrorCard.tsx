import { View, Text, Pressable } from "react-native";
import type { FetchFailureKind } from "@/api";

type Tone = "wait" | "loss";

// Keyed by FetchFailureKind so a new kind fails to compile until it has a label and
// tone. User-fixable kinds and the demo limit use the wait tone; system failures use
// the loss tone.
const TONE: Record<FetchFailureKind, Tone> = {
  bad_address: "wait",
  not_found: "wait",
  quota: "wait",
  incomplete: "wait",
  server: "loss",
  network: "loss",
  timeout: "loss",
  invalid: "loss",
};

const LABEL: Record<FetchFailureKind, string> = {
  bad_address: "Check the address",
  not_found: "No data for this address",
  quota: "Demo limit reached",
  incomplete: "Incomplete record",
  server: "Server problem",
  network: "Connection problem",
  timeout: "Took too long",
  invalid: "Something went wrong",
};

// Tailwind can't compute class names dynamically, so map tone -> full classes.
const BOX: Record<Tone, string> = {
  wait: "bg-wait-tint border-wait/40",
  loss: "bg-loss-tint border-loss/40",
};
const LABEL_TEXT: Record<Tone, string> = {
  wait: "text-wait",
  loss: "text-loss",
};

type ErrorCardProps = {
  failure: FetchFailureKind;
  // The user-facing message (FAILURE_COPY in index.tsx), shown unchanged.
  message: string;
  // Show Retry (RETRYABLE in index.tsx).
  retryable: boolean;
  onRetry: () => void;
};

// The error state, shown where the report would be. The label and message form one
// alert so screen readers announce the failure; Retry sits outside it.
export function ErrorCard({ failure, message, retryable, onRetry }: ErrorCardProps) {
  const tone = TONE[failure];
  return (
    <View className={`rounded-[18px] border p-5 gap-4 ${BOX[tone]}`}>
      <View role="alert" className="gap-2">
        <Text
          className={`font-mono-medium font-medium text-[11px] leading-4 uppercase tracking-widest ${LABEL_TEXT[tone]}`}
        >
          {LABEL[failure]}
        </Text>
        <Text className="font-sans text-base text-ink">{message}</Text>
      </View>
      {retryable ? (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          className="press h-10 self-start items-center justify-center rounded-lg bg-ink px-4"
        >
          <Text className="font-sans-medium font-medium text-sm text-paper">Retry</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
