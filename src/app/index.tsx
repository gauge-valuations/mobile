import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { LandingPage } from "@/landing/LandingPage";

// The web landing page at /. The iOS and Android apps use index.native.tsx instead,
// which sends them straight to the report screen.
export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-paper" edges={["top", "left", "right"]}>
      {/* Fixed above the ScrollView, as on the report page. */}
      <Header />
      <ScrollView>
        <LandingPage />
      </ScrollView>
    </SafeAreaView>
  );
}
