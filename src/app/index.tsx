import { useRef, useState } from "react";
import { ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header, HEADER_SCROLL_THRESHOLD } from "@/components/Header";
import { ScrollRootContext } from "@/components/Reveal";
import { LandingPage } from "@/landing/LandingPage";

// The web landing page at /. The iOS and Android apps use index.native.tsx instead,
// which sends them straight to the report screen.
export default function Index() {
  // The element that scrolls: scroll reveals measure against it, not the window.
  const scrollRef = useRef<ScrollView>(null);
  const [scrolled, setScrolled] = useState(false);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setScrolled(e.nativeEvent.contentOffset.y > HEADER_SCROLL_THRESHOLD);

  return (
    <SafeAreaView className="flex-1 bg-paper" edges={["top", "left", "right"]}>
      <View className="flex-1">
        <ScrollRootContext.Provider value={scrollRef}>
          {/* 72px of top padding for the header, which overlays the content. */}
          <ScrollView
            ref={scrollRef}
            onScroll={onScroll}
            scrollEventThrottle={16}
            contentContainerClassName="pt-[72px]"
          >
            <LandingPage />
          </ScrollView>
        </ScrollRootContext.Provider>
        <Header scrolled={scrolled} />
      </View>
    </SafeAreaView>
  );
}
