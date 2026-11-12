import { Pressable, Text } from "react-native";
import { Link, type Href } from "expo-router";

type LinkButtonProps = { href: Href; label: string };

// Primary: ink background, paper text, 40px tall, 8px radius, 14px medium.
export function PrimaryLinkButton({ href, label }: LinkButtonProps) {
  return (
    <Link href={href} asChild>
      <Pressable role="link" className="h-10 items-center justify-center rounded-lg bg-ink px-4">
        <Text className="font-sans-medium font-medium text-sm text-paper">{label}</Text>
      </Pressable>
    </Link>
  );
}

// Outline: transparent with a 1px ink border, same size as the primary button.
export function OutlineLinkButton({ href, label }: LinkButtonProps) {
  return (
    <Link href={href} asChild>
      <Pressable
        role="link"
        className="h-10 items-center justify-center rounded-lg border border-ink px-4"
      >
        <Text className="font-sans-medium font-medium text-sm text-ink">{label}</Text>
      </Pressable>
    </Link>
  );
}
