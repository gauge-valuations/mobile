import { View, Text, Pressable, Platform } from "react-native";
import { Link, usePathname } from "expo-router";
import { SAMPLE_ADDRESSES } from "@/sampleAddresses";
import { LogoMark } from "./LogoMark";
import { ThemeToggle } from "./ThemeToggle";

const IS_WEB = Platform.OS === "web";

// The landing page's "How it works" section (src/landing/LandingPage.tsx).
export const HOW_IT_WORKS_ID = "how-it-works";

// Scrolls to "How it works" on the landing page, or opens the landing page at that
// section from anywhere else. Web only.
function goToHowItWorks(onLanding: boolean) {
  if (onLanding) {
    globalThis.document?.getElementById(HOW_IT_WORKS_ID)?.scrollIntoView({ block: "start" });
  } else {
    globalThis.location?.assign(`/#${HOW_IT_WORKS_ID}`);
  }
}

function NavLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} role="link" className="press min-h-[40px] justify-center">
      <Text className="font-sans text-[15px] text-ink">{label}</Text>
    </Pressable>
  );
}

// Scrolled past this many px, the header turns translucent with a border and blur.
export const HEADER_SCROLL_THRESHOLD = 41;

// Bar overlaying the top of the scrolling content, shared by the landing page and the
// report (the pages pad their content by 72px). Logo and wordmark link home. On web:
// "How it works" and "Sample report" links (hidden below md so nothing wraps on phones),
// the theme toggle and a "Try an address" button. The native apps have no landing page,
// so they show only the logo and the toggle.
// At the top: solid paper, transparent border. Scrolled (web): paper at 75%, a rule
// border and a backdrop blur, over 0.3s (the blur and timing are in +html.tsx). Native
// stays solid, since it has no blur behind the bar.
export function Header({ scrolled = false }: { scrolled?: boolean }) {
  const pathname = usePathname();
  const onLanding = pathname === "/";
  const glass = scrolled && IS_WEB;
  const headerData = IS_WEB ? ({ dataSet: { header: "", scrolled: String(scrolled) } } as object) : {};

  return (
    <View
      {...headerData}
      className={`absolute left-0 right-0 top-0 z-10 border-b ${
        glass ? "bg-paper/75 border-rule" : scrolled ? "bg-paper border-rule" : "bg-paper border-transparent"
      }`}
    >
      <View className="w-full max-w-[1280px] self-center h-[72px] flex-row items-center justify-between gap-4 px-5 lg:px-10">
        <View className="flex-row items-center gap-8">
          <Link href="/" asChild>
            <Pressable
              accessibilityLabel="Gauge home"
              className="min-h-[40px] flex-row items-center gap-2"
            >
              <LogoMark />
              {/* Brand wordmark, not a heading. */}
              <Text className="font-serif text-2xl text-ink">Gauge</Text>
            </Pressable>
          </Link>
          {IS_WEB ? (
            <View className="hidden md:flex flex-row items-center gap-6">
              <NavLink label="How it works" onPress={() => goToHowItWorks(onLanding)} />
              <Link href={{ pathname: "/report", params: { address: SAMPLE_ADDRESSES[0] } }} asChild>
                <Pressable role="link" className="press min-h-[40px] justify-center">
                  <Text className="font-sans text-[15px] text-ink">Sample report</Text>
                </Pressable>
              </Link>
            </View>
          ) : null}
        </View>
        <View className="flex-row items-center gap-2">
          <ThemeToggle />
          {IS_WEB ? (
            <Link href="/report" asChild>
              <Pressable
                role="link"
                className="press h-10 items-center justify-center rounded-lg bg-ink px-4"
              >
                <Text className="font-sans-medium font-medium text-sm text-paper">
                  Try an address
                </Text>
              </Pressable>
            </Link>
          ) : null}
        </View>
      </View>
    </View>
  );
}
